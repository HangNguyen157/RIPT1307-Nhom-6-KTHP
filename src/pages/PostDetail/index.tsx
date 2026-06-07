import { authUtils } from '@/utils/auth';
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CopyOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { history, request, useParams } from '@umijs/max';
import { Avatar, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const DEFAULT_QUESTION_ID = '1';

// Escape HTML để chống XSS trước khi render nội dung người dùng nhập
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Chỉ cho phép cú pháp **đậm**, mọi HTML khác đều bị escape
const renderInline = (block: string) =>
  escapeHtml(block).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

// Helper: get vote state (up/down/none)
const getVoteState = (userId: string, allVotes: any[], targetId: string) => {
  const vote = allVotes.find(
    (v) => v.userId === userId && v.targetId === targetId,
  );
  if (!vote) return 'none';
  return vote.value === 1 ? 'up' : 'down';
};

export default function PostDetail() {
  const { id: routeId } = useParams<{ id: string }>();
  const questionId = routeId || DEFAULT_QUESTION_ID;

  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [allVotes, setAllVotes] = useState<any[]>([]); // Track all votes
  const [loading, setLoading] = useState(true);

  const currentUser = authUtils.getCurrentUser();
  const [votes, setVotes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  // Reply state tracking
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchPostData = async () => {
    setLoading(true);
    try {
      const resPost = await request<{
        success: boolean;
        data: { question: any };
      }>(`/api/posts/${questionId}`, {
        method: 'GET',
      });
      if (resPost && resPost.success) {
        setPost(resPost.data.question);
        setVotes(resPost.data.question.votes);
      } else {
        message.error('Không tìm thấy bài viết');
      }

      const resComments = await request<{ success: boolean; data: any[] }>(
        `/api/posts/${questionId}/comments`,
        {
          method: 'GET',
        },
      );
      if (resComments && resComments.success) {
        setAnswers(resComments.data);
      }

      // Fetch votes
      const resVotes = await request<{ success: boolean; data: any[] }>(
        `/api/posts/${questionId}/vote`,
        {
          method: 'GET',
        },
      );
      if (resVotes && resVotes.success) {
        setAllVotes(resVotes.data);
      }
    } catch (error) {
      console.error('Lỗi tải chi tiết bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [questionId]);

  const isOwner = currentUser?.id === post?.authorId;

  // Vote handler: single state logic
  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để vote');
      history.push('/login');
      return;
    }

    const currentState = getVoteState(currentUser.id, allVotes, questionId);
    const voteValue = type === 'up' ? 1 : -1;

    // Determine new state after click
    let newState = 'none';
    if (currentState === 'none') {
      newState = type === 'up' ? 'up' : 'down';
    } else if (currentState === type) {
      newState = 'none'; // Click same = remove vote
    } else {
      newState = type === 'up' ? 'up' : 'down'; // Switch
    }

    try {
      const res = await request<{ success: boolean; data: { votes: number } }>(
        `/api/posts/${questionId}/vote`,
        {
          method: 'POST',
          data: {
            targetType: 'question',
            targetId: questionId,
            userId: currentUser.id,
            value: voteValue,
          },
        },
      );
      if (res && res.success) {
        setVotes(res.data.votes);
        // Update vote list
        const newVotes = allVotes.filter(
          (v) => !(v.userId === currentUser.id && v.targetId === questionId),
        );
        if (newState !== 'none') {
          newVotes.push({
            userId: currentUser.id,
            targetId: questionId,
            value: voteValue,
          });
        }
        setAllVotes(newVotes);
        message.success('Đã cập nhật vote!');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi xử lý vote');
    }
  };

  // Vote handler for comments
  const handleCommentVote = async (commentId: string, type: 'up' | 'down') => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để vote');
      history.push('/login');
      return;
    }

    const currentState = getVoteState(currentUser.id, allVotes, commentId);
    const voteValue = type === 'up' ? 1 : -1;

    // Determine new state
    let newState = 'none';
    if (currentState === 'none') {
      newState = type === 'up' ? 'up' : 'down';
    } else if (currentState === type) {
      newState = 'none';
    } else {
      newState = type === 'up' ? 'up' : 'down';
    }

    try {
      const res = await request<{ success: boolean; data: { votes: number } }>(
        `/api/posts/${questionId}/vote`,
        {
          method: 'POST',
          data: {
            targetType: 'comment',
            targetId: commentId,
            userId: currentUser.id,
            value: voteValue,
          },
        },
      );
      if (res && res.success) {
        // Update answers votes
        setAnswers(
          answers.map((ans) => {
            if (ans.id === commentId) {
              return { ...ans, votes: res.data.votes };
            }
            if (ans.replies) {
              return {
                ...ans,
                replies: ans.replies.map((r: any) =>
                  r.id === commentId ? { ...r, votes: res.data.votes } : r,
                ),
              };
            }
            return ans;
          }),
        );

        // Update vote list
        const newVotes = allVotes.filter(
          (v) => !(v.userId === currentUser.id && v.targetId === commentId),
        );
        if (newState !== 'none') {
          newVotes.push({
            userId: currentUser.id,
            targetId: commentId,
            value: voteValue,
          });
        }
        setAllVotes(newVotes);
        message.success('Đã cập nhật vote!');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi xử lý vote');
    }
  };

  const handleSelectBest = async (answerId: string) => {
    if (!isOwner) {
      message.warning(
        'Chỉ người đặt câu hỏi mới có thể chọn câu trả lời hay nhất',
      );
      return;
    }
    try {
      const res = await request<{ success: boolean }>(
        `/api/posts/${questionId}/comments`,
        {
          method: 'PUT',
          data: {
            commentId: answerId,
            isBest: true,
          },
        },
      );
      if (res && res.success) {
        setAnswers(answers.map((a) => ({ ...a, isBest: a.id === answerId })));
        if (post) {
          setPost({ ...post, isSolved: true });
        }
        message.success('Đã chọn câu trả lời hay nhất!');
      }
    } catch (error: any) {
      message.error(error.message || 'Không thể cập nhật câu trả lời hay nhất');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) {
      message.warning('Vui lòng nhập câu trả lời');
      return;
    }
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để trả lời');
      history.push('/login');
      return;
    }
    try {
      const res = await request<{ success: boolean; data: any }>(
        `/api/posts/${questionId}/comments`,
        {
          method: 'POST',
          data: {
            content: newAnswer,
            authorId: currentUser.id,
          },
        },
      );
      if (res && res.success) {
        setAnswers([...answers, res.data]);
        setNewAnswer('');
        message.success('Câu trả lời đã được đăng!');
      }
    } catch (error: any) {
      message.error(error.message || 'Không thể đăng câu trả lời');
    }
  };

  // Handle reply submit
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) {
      message.warning('Vui lòng nhập nội dung trả lời');
      return;
    }
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để trả lời');
      history.push('/login');
      return;
    }
    try {
      const res = await request<{ success: boolean; data: any }>(
        `/api/posts/${questionId}/comments`,
        {
          method: 'POST',
          data: {
            content: replyContent,
            authorId: currentUser.id,
            parentId: parentCommentId,
          },
        },
      );
      if (res && res.success) {
        // Update answers with new reply
        setAnswers(
          answers.map((ans) =>
            ans.id === parentCommentId
              ? {
                  ...ans,
                  replies: ans.replies
                    ? [...ans.replies, res.data]
                    : [res.data],
                }
              : ans,
          ),
        );
        setReplyContent('');
        setReplyingTo(null);
        message.success('Trả lời đã được đăng!');
      }
    } catch (error: any) {
      message.error(error.message || 'Không thể đăng trả lời');
    }
  };

  const handleDelete = async () => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để xóa bài viết');
      history.push('/login');
      return;
    }

    if (!isOwner && currentUser.role !== 'admin') {
      message.error('Bạn không có quyền xóa bài viết này');
      return;
    }

    try {
      const confirmed = window.confirm(
        'Bạn chắc chắn muốn xóa bài viết này? Thao tác này không thể hoàn tác.',
      );
      if (!confirmed) {
        return;
      }

      const token = authUtils.getToken();

      const res = await request<{ success: boolean; message: string }>(
        `/api/posts/${questionId}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: token } : undefined,
        },
      );
      if (res && res.success) {
        message.success('Đã xóa bài viết thành công');
        setTimeout(() => {
          history.push('/forum');
        }, 500);
      } else {
        message.error(res?.message || 'Không thể xóa bài viết');
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi xóa bài viết');
    }
  };

  const sortedAnswers = [...answers].sort(
    (a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0),
  );

  // Get vote state for UI
  const postVoteState = currentUser
    ? getVoteState(currentUser.id, allVotes, questionId)
    : 'none';

  if (loading || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className={styles.postDetail}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => history.push('/forum')}
      >
        <ArrowLeftOutlined /> Quay Lại Diễn Đàn
      </button>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <div className={styles.badges}>
            {answers.some((a) => a.isBest) && (
              <span className={styles.solvedBadge}>
                <CheckCircleFilled /> Đã Giải Quyết
              </span>
            )}
            {post.subject && (
              <span className={styles.subjectBadge}>{post.subject}</span>
            )}
          </div>
          <h1 className={styles.questionTitle}>{post.title}</h1>
          <div className={styles.questionMeta}>
            <Avatar size={32} style={{ background: 'var(--color-primary)' }}>
              {post.author ? post.author.charAt(0) : 'U'}
            </Avatar>
            <span
              className={styles.authorName}
              onClick={() => history.push(`/profile/${post.authorId}`)}
            >
              {post.author}
            </span>
            <span className={styles.roleBadge}>
              {post.authorRole === 'giangvien' ? 'Giảng viên' : 'Sinh viên'}
            </span>
            {post.authorRep !== undefined && (
              <span className={styles.repBadge}>⭐ {post.authorRep}</span>
            )}
            <span className={styles.metaDot}>·</span>
            <span className={styles.timestamp}>{post.timestamp}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.viewCount}>{post.views} lượt xem</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.questionContent}>
          {post.content
            ? post.content.split('\n\n').map((block: string, i: number) => {
                if (block.startsWith('```')) {
                  const code = block
                    .replace(/```\w*\n?/, '')
                    .replace(/```$/, '');
                  return (
                    <div key={i} className={styles.codeWrapper}>
                      <div className={styles.codeHeader}>
                        <span>Code</span>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            message.success('Đã sao chép!');
                          }}
                        >
                          <CopyOutlined /> Sao Chép
                        </button>
                      </div>
                      <pre className={styles.codeBlock}>
                        <code>{code}</code>
                      </pre>
                    </div>
                  );
                }
                if (block.startsWith('## ')) {
                  return (
                    <h2 key={i} className={styles.contentH2}>
                      {block.replace('## ', '')}
                    </h2>
                  );
                }
                return (
                  <p
                    key={i}
                    className={styles.contentP}
                    dangerouslySetInnerHTML={{
                      __html: renderInline(block),
                    }}
                  />
                );
              })
            : null}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {post.tags &&
            post.tags.map((tag: string) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
        </div>

        {/* Actions */}
        <div className={styles.questionActions}>
          <div className={styles.voteGroup}>
            <button
              type="button"
              className={`${styles.voteBtn} ${
                postVoteState === 'up' ? styles.active : ''
              }`}
              onClick={() => handleVote('up')}
              title="Up vote"
            >
              {postVoteState === 'up' ? <LikeFilled /> : <LikeOutlined />}
            </button>
            <span className={styles.voteCount}>{votes}</span>
            <button
              type="button"
              className={`${styles.voteBtn} ${
                postVoteState === 'down' ? styles.activeDown : ''
              }`}
              onClick={() => handleVote('down')}
              title="Down vote"
            >
              {postVoteState === 'down' ? (
                <DislikeFilled />
              ) : (
                <DislikeOutlined />
              )}
            </button>
          </div>
          <button
            type="button"
            className={`${styles.actionBtn} ${
              isBookmarked ? styles.bookmarked : ''
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? <StarFilled /> : <StarOutlined />}
            {isBookmarked ? 'Đã Lưu' : 'Lưu Bài'}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              message.success('Đã sao chép link!');
            }}
          >
            <ShareAltOutlined /> Chia Sẻ
          </button>
          {(isOwner || currentUser?.role === 'admin') && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={handleDelete}
            >
              Xóa Bài
            </button>
          )}
        </div>
      </div>

      {/* Answers */}
      <div className={styles.answersSection}>
        <h2 className={styles.answersTitle}>
          {sortedAnswers.length} Câu Trả Lời
          {answers.some((a) => a.isBest) && (
            <span className={styles.solvedInfo}>
              · Đã có câu trả lời hay nhất
            </span>
          )}
        </h2>

        {sortedAnswers.map((answer) => {
          const commentVoteState = currentUser
            ? getVoteState(currentUser.id, allVotes, answer.id)
            : 'none';

          return (
            <div
              key={answer.id}
              className={`${styles.answerCard} ${
                answer.isBest ? styles.bestAnswer : ''
              }`}
            >
              {answer.isBest && (
                <div className={styles.bestBanner}>
                  <CheckCircleFilled /> Câu Trả Lời Hay Nhất
                </div>
              )}

              <div className={styles.answerLayout}>
                <div className={styles.answerVoteCol}>
                  <button
                    type="button"
                    className={`${styles.smallVoteBtn} ${
                      commentVoteState === 'up' ? styles.activeSmall : ''
                    }`}
                    onClick={() => handleCommentVote(answer.id, 'up')}
                    title="Up vote"
                  >
                    {commentVoteState === 'up' ? (
                      <LikeFilled />
                    ) : (
                      <LikeOutlined />
                    )}
                  </button>
                  <span className={styles.smallVoteNum}>{answer.votes}</span>
                  <button
                    type="button"
                    className={`${styles.smallVoteBtn} ${
                      commentVoteState === 'down' ? styles.activeSmall : ''
                    }`}
                    onClick={() => handleCommentVote(answer.id, 'down')}
                    title="Down vote"
                  >
                    {commentVoteState === 'down' ? (
                      <DislikeFilled />
                    ) : (
                      <DislikeOutlined />
                    )}
                  </button>
                  {answer.isBest && (
                    <CheckCircleFilled className={styles.bestIcon} />
                  )}
                </div>

                <div className={styles.answerContent}>
                  <div className={styles.answerMeta}>
                    <Avatar
                      size={28}
                      style={{
                        background:
                          answer.authorRole === 'giangvien'
                            ? '#6366f1'
                            : 'var(--color-primary)',
                      }}
                    >
                      {answer.avatar}
                    </Avatar>
                    <span
                      className={styles.authorName}
                      onClick={() =>
                        history.push(`/profile/${answer.authorId}`)
                      }
                    >
                      {answer.author}
                    </span>
                    <span className={styles.roleBadge}>
                      {answer.authorRole === 'giangvien' ? 'GV' : 'SV'}
                    </span>
                    <span className={styles.repBadge}>
                      ⭐ {answer.authorRep}
                    </span>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.timestamp}>{answer.timestamp}</span>
                  </div>

                  <div className={styles.answerText}>
                    {answer.content &&
                      answer.content
                        .split('\n\n')
                        .map((block: string, i: number) => {
                          if (block.startsWith('```')) {
                            const code = block
                              .replace(/```\w*\n?/, '')
                              .replace(/```$/, '');
                            return (
                              <div key={i} className={styles.codeWrapper}>
                                <div className={styles.codeHeader}>
                                  <span>Code</span>
                                  <button
                                    type="button"
                                    className={styles.copyBtn}
                                    onClick={() => {
                                      navigator.clipboard.writeText(code);
                                      message.success('Đã sao chép!');
                                    }}
                                  >
                                    <CopyOutlined /> Sao Chép
                                  </button>
                                </div>
                                <pre className={styles.codeBlock}>
                                  <code>{code}</code>
                                </pre>
                              </div>
                            );
                          }
                          return (
                            <p
                              key={i}
                              className={styles.contentP}
                              dangerouslySetInnerHTML={{
                                __html: renderInline(block),
                              }}
                            />
                          );
                        })}
                  </div>

                  <div className={styles.answerActions}>
                    <button
                      type="button"
                      className={styles.replyBtn}
                      onClick={() => setReplyingTo(answer.id)}
                    >
                      Trả Lời
                    </button>
                    {isOwner && !answer.isBest && (
                      <button
                        type="button"
                        className={styles.selectBestBtn}
                        onClick={() => handleSelectBest(answer.id)}
                      >
                        <CheckCircleOutlined /> Chọn Hay Nhất
                      </button>
                    )}
                  </div>

                  {/* Reply Input Form */}
                  {replyingTo === answer.id && (
                    <div className={styles.replyForm}>
                      <textarea
                        className={styles.replyTextarea}
                        placeholder="Viết trả lời của bạn..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                      />
                      <div className={styles.replyActions}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleSubmitReply(answer.id)}
                          disabled={!replyContent.trim()}
                        >
                          Gửi
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {answer.replies && answer.replies.length > 0 && (
                    <div className={styles.replies}>
                      {answer.replies.map((reply: any) => {
                        const replyVoteState = currentUser
                          ? getVoteState(currentUser.id, allVotes, reply.id)
                          : 'none';

                        return (
                          <div key={reply.id} className={styles.reply}>
                            <Avatar
                              size={24}
                              style={{ background: '#6b7280', flexShrink: 0 }}
                            >
                              {reply.author.charAt(0)}
                            </Avatar>
                            <div className={styles.replyContent}>
                              <span className={styles.replyAuthor}>
                                {reply.author}
                              </span>
                              <span className={styles.replyText}>
                                {' '}
                                {reply.content}
                              </span>
                              <span className={styles.replyTime}>
                                {' '}
                                · {reply.timestamp}
                              </span>
                              <div className={styles.replyVotes}>
                                <button
                                  type="button"
                                  className={`${styles.replyVoteBtn} ${
                                    replyVoteState === 'up' ? styles.active : ''
                                  }`}
                                  onClick={() =>
                                    handleCommentVote(reply.id, 'up')
                                  }
                                  title="Up vote"
                                >
                                  {replyVoteState === 'up' ? (
                                    <LikeFilled />
                                  ) : (
                                    <LikeOutlined />
                                  )}
                                </button>
                                <span className={styles.replyVoteCount}>
                                  {reply.votes}
                                </span>
                                <button
                                  type="button"
                                  className={`${styles.replyVoteBtn} ${
                                    replyVoteState === 'down'
                                      ? styles.active
                                      : ''
                                  }`}
                                  onClick={() =>
                                    handleCommentVote(reply.id, 'down')
                                  }
                                  title="Down vote"
                                >
                                  {replyVoteState === 'down' ? (
                                    <DislikeFilled />
                                  ) : (
                                    <DislikeOutlined />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Answer Form */}
        <div className={styles.answerForm}>
          <h3>✍️ Viết Câu Trả Lời</h3>
          {!currentUser && (
            <div className={styles.loginPrompt}>
              <span>Bạn cần đăng nhập để trả lời.</span>
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => history.push('/login')}
              >
                Đăng Nhập
              </Button>
            </div>
          )}
          <div className={styles.editorToolbar}>
            {['B', 'I', 'Code', 'Link', 'Img'].map((tool) => (
              <button type="button" key={tool} className={styles.toolBtn}>
                {tool}
              </button>
            ))}
          </div>
          <textarea
            className={styles.answerTextarea}
            placeholder="Viết câu trả lời của bạn (hỗ trợ Markdown)..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            rows={6}
          />
          <div className={styles.answerFormActions}>
            <Button
              type="primary"
              danger
              size="large"
              disabled={!newAnswer.trim()}
              onClick={handleSubmitAnswer}
            >
              Đăng Câu Trả Lời
            </Button>
            <span className={styles.charCount}>{newAnswer.length} ký tự</span>
          </div>
        </div>
      </div>
    </div>
  );
}
