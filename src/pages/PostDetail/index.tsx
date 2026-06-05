import React, { useState, useEffect } from 'react';
import { Avatar, Button, Space, Tag, Divider, Form, Input, Tooltip, message } from 'antd';
import {
  LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled,
  ShareAltOutlined, StarOutlined, StarFilled,
  CheckCircleFilled, CheckCircleOutlined, ArrowLeftOutlined, CopyOutlined,
} from '@ant-design/icons';
import { useParams, history, request } from '@umijs/max';
import type { Comment } from '@/server/models';
import { authUtils } from '@/utils/auth';
import styles from './index.less';

const DEFAULT_QUESTION_ID = '1';

export default function PostDetail() {
  const { id: routeId } = useParams<{ id: string }>();
  const questionId = routeId || DEFAULT_QUESTION_ID;

  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = authUtils.getCurrentUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [votes, setVotes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const fetchPostData = async () => {
    setLoading(true);
    try {
      const resPost = await request<{ success: boolean; data: { question: any } }>(`/api/posts/${questionId}`, {
        method: 'GET',
      });
      if (resPost && resPost.success) {
        setPost(resPost.data.question);
        setVotes(resPost.data.question.votes);
      } else {
        message.error('Không tìm thấy bài viết');
      }

      const resComments = await request<{ success: boolean; data: any[] }>(`/api/posts/${questionId}/comments`, {
        method: 'GET',
      });
      if (resComments && resComments.success) {
        setAnswers(resComments.data);
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

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để vote');
      history.push('/login');
      return;
    }
    const val = type === 'up' ? 1 : -1;
    try {
      const res = await request<{ success: boolean; data: { votes: number } }>(`/api/posts/${questionId}/vote`, {
        method: 'POST',
        data: {
          targetType: 'question',
          targetId: questionId,
          userId: currentUser.id,
          value: val,
        },
      });
      if (res && res.success) {
        setVotes(res.data.votes);
        if (type === 'up') {
          if (!isLiked) {
            setIsLiked(true);
            setIsDisliked(false);
          } else {
            setIsLiked(false);
          }
        } else {
          if (!isDisliked) {
            setIsDisliked(true);
            setIsLiked(false);
          } else {
            setIsDisliked(false);
          }
        }
        message.success('Đã cập nhật vote!');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi xử lý vote');
    }
  };

  const handleCommentVote = async (commentId: string, type: 'up' | 'down') => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để vote');
      history.push('/login');
      return;
    }
    const val = type === 'up' ? 1 : -1;
    try {
      const res = await request<{ success: boolean; data: { votes: number } }>(`/api/posts/${questionId}/vote`, {
        method: 'POST',
        data: {
          targetType: 'comment',
          targetId: commentId,
          userId: currentUser.id,
          value: val,
        },
      });
      if (res && res.success) {
        setAnswers(answers.map(ans => ans.id === commentId ? { ...ans, votes: res.data.votes } : ans));
        message.success('Đã cập nhật vote!');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi xử lý vote');
    }
  };

  const handleSelectBest = async (answerId: string) => {
    if (!isOwner) {
      message.warning('Chỉ người đặt câu hỏi mới có thể chọn câu trả lời hay nhất');
      return;
    }
    try {
      const res = await request<{ success: boolean }>(`/api/posts/${questionId}/comments`, {
        method: 'PUT',
        data: {
          commentId: answerId,
          isBest: true,
        },
      });
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
      const res = await request<{ success: boolean; data: any }>(`/api/posts/${questionId}/comments`, {
        method: 'POST',
        data: {
          content: newAnswer,
          authorId: currentUser.id,
        },
      });
      if (res && res.success) {
        setAnswers([...answers, res.data]);
        setNewAnswer('');
        message.success('Câu trả lời đã được đăng!');
      }
    } catch (error: any) {
      message.error(error.message || 'Không thể đăng câu trả lời');
    }
  };

  const sortedAnswers = [...answers].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));


  if (loading || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className={styles.postDetail}>
      <button className={styles.backBtn} onClick={() => history.push('/forum')}>
        <ArrowLeftOutlined /> Quay Lại Diễn Đàn
      </button>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <div className={styles.badges}>
            {answers.some((a) => a.isBest) && (
              <span className={styles.solvedBadge}><CheckCircleFilled /> Đã Giải Quyết</span>
            )}
            {post.subject && <span className={styles.subjectBadge}>{post.subject}</span>}
          </div>
          <h1 className={styles.questionTitle}>{post.title}</h1>
          <div className={styles.questionMeta}>
            <Avatar size={32} style={{ background: 'var(--color-primary)' }}>
              {post.author ? post.author.charAt(0) : 'U'}
            </Avatar>
            <span className={styles.authorName} onClick={() => history.push(`/profile/${post.authorId}`)}>
              {post.author}
            </span>
            <span className={styles.roleBadge}>
              {post.authorRole === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
            </span>
            {post.authorRep !== undefined && <span className={styles.repBadge}>⭐ {post.authorRep}</span>}
            <span className={styles.metaDot}>·</span>
            <span className={styles.timestamp}>{post.timestamp}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.viewCount}>{post.views} lượt xem</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.questionContent}>
          {post.content ? post.content.split('\n\n').map((block: string, i: number) => {
            if (block.startsWith('```')) {
              const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
              return (
                <div key={i} className={styles.codeWrapper}>
                  <div className={styles.codeHeader}>
                    <span>Code</span>
                    <button className={styles.copyBtn}
                      onClick={() => { navigator.clipboard.writeText(code); message.success('Đã sao chép!'); }}>
                      <CopyOutlined /> Sao Chép
                    </button>
                  </div>
                  <pre className={styles.codeBlock}><code>{code}</code></pre>
                </div>
              );
            }
            if (block.startsWith('## ')) {
              return <h2 key={i} className={styles.contentH2}>{block.replace('## ', '')}</h2>;
            }
            return <p key={i} className={styles.contentP}
              dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
          }) : null}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {post.tags && post.tags.map((tag: string) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.questionActions}>
          <div className={styles.voteGroup}>
            <button className={`${styles.voteBtn} ${isLiked ? styles.active : ''}`} onClick={() => handleVote('up')}>
              {isLiked ? <LikeFilled /> : <LikeOutlined />}
            </button>
            <span className={styles.voteCount}>{votes}</span>
            <button className={`${styles.voteBtn} ${isDisliked ? styles.activeDown : ''}`} onClick={() => handleVote('down')}>
              {isDisliked ? <DislikeFilled /> : <DislikeOutlined />}
            </button>
          </div>
          <button
            className={`${styles.actionBtn} ${isBookmarked ? styles.bookmarked : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? <StarFilled /> : <StarOutlined />}
            {isBookmarked ? 'Đã Lưu' : 'Lưu Bài'}
          </button>
          <button className={styles.actionBtn}
            onClick={() => { navigator.clipboard.writeText(window.location.href); message.success('Đã sao chép link!'); }}>
            <ShareAltOutlined /> Chia Sẻ
          </button>
        </div>
      </div>

      {/* Answers */}
      <div className={styles.answersSection}>
        <h2 className={styles.answersTitle}>
          {sortedAnswers.length} Câu Trả Lời
          {answers.some((a) => a.isBest) && <span className={styles.solvedInfo}>· Đã có câu trả lời hay nhất</span>}
        </h2>

        {sortedAnswers.map((answer) => (
          <div key={answer.id} className={`${styles.answerCard} ${answer.isBest ? styles.bestAnswer : ''}`}>
            {answer.isBest && (
              <div className={styles.bestBanner}>
                <CheckCircleFilled /> Câu Trả Lời Hay Nhất
              </div>
            )}

            <div className={styles.answerLayout}>
              <div className={styles.answerVoteCol}>
                <button className={styles.smallVoteBtn} onClick={() => handleCommentVote(answer.id, 'up')}>
                  <LikeOutlined />
                </button>
                <span className={styles.smallVoteNum}>{answer.votes}</span>
                <button className={styles.smallVoteBtn} onClick={() => handleCommentVote(answer.id, 'down')}>
                  <DislikeOutlined />
                </button>
                {answer.isBest && <CheckCircleFilled className={styles.bestIcon} />}
              </div>

              <div className={styles.answerContent}>
                <div className={styles.answerMeta}>
                  <Avatar size={28} style={{ background: answer.authorRole === 'teacher' ? '#6366f1' : 'var(--color-primary)' }}>
                    {answer.avatar}
                  </Avatar>
                  <span className={styles.authorName} onClick={() => history.push(`/profile/${answer.authorId}`)}>
                    {answer.author}
                  </span>
                  <span className={styles.roleBadge}>
                    {answer.authorRole === 'teacher' ? 'GV' : 'SV'}
                  </span>
                  <span className={styles.repBadge}>⭐ {answer.authorRep}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.timestamp}>{answer.timestamp}</span>
                </div>

                <div className={styles.answerText}>
                  {answer.content && answer.content.split('\n\n').map((block: string, i: number) => {
                    if (block.startsWith('```')) {
                      const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
                      return (
                        <div key={i} className={styles.codeWrapper}>
                          <div className={styles.codeHeader}>
                            <span>Code</span>
                            <button className={styles.copyBtn}
                              onClick={() => { navigator.clipboard.writeText(code); message.success('Đã sao chép!'); }}>
                              <CopyOutlined /> Sao Chép
                            </button>
                          </div>
                          <pre className={styles.codeBlock}><code>{code}</code></pre>
                        </div>
                      );
                    }
                    return <p key={i} className={styles.contentP}
                      dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                  })}
                </div>

                <div className={styles.answerActions}>
                  <button className={styles.replyBtn}>Trả Lời</button>
                  {isOwner && !answer.isBest && (
                    <button className={styles.selectBestBtn} onClick={() => handleSelectBest(answer.id)}>
                      <CheckCircleOutlined /> Chọn Hay Nhất
                    </button>
                  )}
                </div>

                {/* Replies */}
                {answer.replies && answer.replies.length > 0 && (
                  <div className={styles.replies}>
                    {answer.replies.map((reply: any) => (
                      <div key={reply.id} className={styles.reply}>
                        <Avatar size={24} style={{ background: '#6b7280', flexShrink: 0 }}>
                          {reply.author.charAt(0)}
                        </Avatar>
                        <div className={styles.replyContent}>
                          <span className={styles.replyAuthor}>{reply.author}</span>
                          <span className={styles.replyText}> {reply.content}</span>
                          <span className={styles.replyTime}> · {reply.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Answer Form */}
        <div className={styles.answerForm}>
          <h3>✍️ Viết Câu Trả Lời</h3>
          {!currentUser && (
            <div className={styles.loginPrompt}>
              <span>Bạn cần đăng nhập để trả lời.</span>
              <Button type="primary" danger size="small" onClick={() => history.push('/login')}>
                Đăng Nhập
              </Button>
            </div>
          )}
          <div className={styles.editorToolbar}>
            {['B', 'I', 'Code', 'Link', 'Img'].map((tool) => (
              <button key={tool} className={styles.toolBtn}>{tool}</button>
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
            <Button type="primary" danger size="large"
              disabled={!newAnswer.trim()} onClick={handleSubmitAnswer}>
              Đăng Câu Trả Lời
            </Button>
            <span className={styles.charCount}>{newAnswer.length} ký tự</span>
          </div>
        </div>
      </div>
    </div>
  );
}

