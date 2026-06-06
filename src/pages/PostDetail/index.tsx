import {
  getCommentsByQuestionId,
  getQuestionById,
} from '@/server/seed/questions';
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
import { history, useParams } from '@umijs/max';
import { Avatar, Button, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const DEFAULT_QUESTION_ID = '1';

export default function PostDetail() {
  const { id: routeId } = useParams<{ id: string }>();
  const questionId = routeId || DEFAULT_QUESTION_ID;
  const question =
    getQuestionById(questionId) ?? getQuestionById(DEFAULT_QUESTION_ID)!;
  const initialComments = getCommentsByQuestionId(questionId);

  const POST_DATA = {
    id: question.id,
    title: question.title,
    content: question.content ?? question.excerpt,
    author: question.author,
    authorId: question.authorId ?? '2',
    authorRole: question.authorRole ?? 'student',
    authorRep: question.authorRep ?? 0,
    timestamp: question.timestamp,
    tags: question.tags,
    subject: question.subject ?? '',
    votes: question.votes,
    views: question.views,
  };

  const currentUser = authUtils.getCurrentUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [votes, setVotes] = useState(POST_DATA.votes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [answers, setAnswers] = useState(initialComments);
  const [newAnswer, setNewAnswer] = useState('');
  const [isOwner] = useState(currentUser?.id === POST_DATA.authorId);

  const handleVote = (type: 'up' | 'down') => {
    if (type === 'up') {
      if (!isLiked) {
        setVotes(votes + (isDisliked ? 2 : 1));
        setIsLiked(true);
        setIsDisliked(false);
      } else {
        setVotes(votes - 1);
        setIsLiked(false);
      }
    } else {
      if (!isDisliked) {
        setVotes(votes - (isLiked ? 2 : 1));
        setIsDisliked(true);
        setIsLiked(false);
      } else {
        setVotes(votes + 1);
        setIsDisliked(false);
      }
    }
  };

  const handleSelectBest = (answerId: string) => {
    if (!isOwner) {
      message.warning(
        'Chỉ người đặt câu hỏi mới có thể chọn câu trả lời hay nhất',
      );
      return;
    }
    setAnswers(answers.map((a) => ({ ...a, isBest: a.id === answerId })));
    message.success('✅ Đã chọn câu trả lời hay nhất!');
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) {
      message.warning('Vui lòng nhập câu trả lời');
      return;
    }
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để trả lời');
      history.push('/login');
      return;
    }
    const newAns = {
      id: Date.now().toString(),
      author: currentUser.name,
      authorId: currentUser.id,
      authorRole: currentUser.role,
      authorRep: currentUser.reputation,
      avatar: currentUser.name.charAt(0),
      timestamp: 'Vừa xong',
      votes: 0,
      isBest: false,
      content: newAnswer,
      replies: [],
    };
    setAnswers([...answers, newAns]);
    setNewAnswer('');
    message.success('🎉 Câu trả lời đã được đăng!');
  };

  const sortedAnswers = [...answers].sort(
    (a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0),
  );

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
              <span className={styles.solvedBadge}>
                <CheckCircleFilled /> Đã Giải Quyết
              </span>
            )}
            <span className={styles.subjectBadge}>{POST_DATA.subject}</span>
          </div>
          <h1 className={styles.questionTitle}>{POST_DATA.title}</h1>
          <div className={styles.questionMeta}>
            <Avatar size={32} style={{ background: 'var(--color-primary)' }}>
              {POST_DATA.author.charAt(0)}
            </Avatar>
            <span
              className={styles.authorName}
              onClick={() => history.push(`/profile/${POST_DATA.authorId}`)}
            >
              {POST_DATA.author}
            </span>
            <span className={styles.roleBadge}>
              {POST_DATA.authorRole === 'teacher'
                ? '👨‍🏫 Giảng viên'
                : '👨‍🎓 Sinh viên'}
            </span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.timestamp}>{POST_DATA.timestamp}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.viewCount}>
              👁 {POST_DATA.views} lượt xem
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.questionContent}>
          {POST_DATA.content.split('\n\n').map((block, i) => {
            if (block.startsWith('```')) {
              const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
              return (
                <div key={i} className={styles.codeWrapper}>
                  <div className={styles.codeHeader}>
                    <span>Java</span>
                    <button
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
                  __html: block.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>',
                  ),
                }}
              />
            );
          })}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {POST_DATA.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.questionActions}>
          <div className={styles.voteGroup}>
            <button
              className={`${styles.voteBtn} ${isLiked ? styles.active : ''}`}
              onClick={() => handleVote('up')}
            >
              {isLiked ? <LikeFilled /> : <LikeOutlined />}
            </button>
            <span className={styles.voteCount}>{votes}</span>
            <button
              className={`${styles.voteBtn} ${
                isDisliked ? styles.activeDown : ''
              }`}
              onClick={() => handleVote('down')}
            >
              {isDisliked ? <DislikeFilled /> : <DislikeOutlined />}
            </button>
          </div>
          <button
            className={`${styles.actionBtn} ${
              isBookmarked ? styles.bookmarked : ''
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? <StarFilled /> : <StarOutlined />}
            {isBookmarked ? 'Đã Lưu' : 'Lưu Bài'}
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              message.success('Đã sao chép link!');
            }}
          >
            <ShareAltOutlined /> Chia Sẻ
          </button>
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

        {sortedAnswers.map((answer) => (
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
                <button className={styles.smallVoteBtn}>
                  <LikeOutlined />
                </button>
                <span className={styles.smallVoteNum}>{answer.votes}</span>
                <button className={styles.smallVoteBtn}>
                  <DislikeOutlined />
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
                        answer.authorRole === 'teacher'
                          ? '#6366f1'
                          : 'var(--color-primary)',
                    }}
                  >
                    {answer.avatar}
                  </Avatar>
                  <span
                    className={styles.authorName}
                    onClick={() => history.push(`/profile/${answer.authorId}`)}
                  >
                    {answer.author}
                  </span>
                  <span className={styles.roleBadge}>
                    {answer.authorRole === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                  </span>
                  <span className={styles.repBadge}>⭐ {answer.authorRep}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.timestamp}>{answer.timestamp}</span>
                </div>

                <div className={styles.answerText}>
                  {answer.content.split('\n\n').map((block, i) => {
                    if (block.startsWith('```')) {
                      const code = block
                        .replace(/```\w*\n?/, '')
                        .replace(/```$/, '');
                      return (
                        <div key={i} className={styles.codeWrapper}>
                          <div className={styles.codeHeader}>
                            <span>Java</span>
                            <button
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
                          __html: block.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong>$1</strong>',
                          ),
                        }}
                      />
                    );
                  })}
                </div>

                <div className={styles.answerActions}>
                  <button className={styles.replyBtn}>💬 Trả Lời</button>
                  {isOwner && !answer.isBest && (
                    <button
                      className={styles.selectBestBtn}
                      onClick={() => handleSelectBest(answer.id)}
                    >
                      <CheckCircleOutlined /> Chọn Hay Nhất
                    </button>
                  )}
                </div>

                {/* Replies */}
                {answer.replies.length > 0 && (
                  <div className={styles.replies}>
                    {answer.replies.map((reply) => (
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
              <button key={tool} className={styles.toolBtn}>
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
              📤 Đăng Câu Trả Lời
            </Button>
            <span className={styles.charCount}>{newAnswer.length} ký tự</span>
          </div>
        </div>
      </div>
    </div>
  );
}
