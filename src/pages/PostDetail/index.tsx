import { authUtils } from '@/utils/auth';
import {
  ArrowLeftOutlined,
  BookFilled,
  BookOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CopyOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { history, request, useParams } from '@umijs/max';
import { Avatar, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface Tag {
  id: number;
  name: string;
  slug?: string;
  color?: string;
}

interface Reply {
  id: string;
  author: string;
  authorId?: string;
  timestamp: string;
  content: string;
  votes?: number;
}

interface Answer {
  id: string;
  author: string;
  authorId: string;
  authorRole: string;
  authorRep: number;
  avatar: string;
  timestamp: string;
  votes: number;
  isBest: boolean;
  content: string;
  replies: Reply[];
}

interface Question {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  authorId: string;
  authorRole: string;
  authorRep?: number;
  timestamp: string;
  tags: Tag[];
  subject: string;
  votes: number;
  views: number;
  isSolved?: boolean;
  userVote?: number;
}

interface QuestionDetailResponse {
  success: boolean;
  data?: {
    question: Question;
    answers: Answer[];
  };
  message?: string;
}

export default function PostDetail() {
  const { id: questionId } = useParams<{ id: string }>();
  const currentUser = authUtils.getCurrentUser();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isOwner = currentUser?.id === question?.authorId;
  const isLiked = question?.userVote === 1;
  const isDisliked = question?.userVote === -1;
  const votes = question?.votes ?? 0;

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = authUtils.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const loadQuestionDetail = async () => {
    if (!questionId) return;

    try {
      setLoading(true);
      const res = await request<QuestionDetailResponse>(
        `/api/questions/${questionId}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        },
      );

      if (res?.success && res.data) {
        setQuestion(res.data.question);
        setAnswers(res.data.answers || []);
      } else {
        setQuestion(null);
        setAnswers([]);
      }
    } catch {
      setQuestion(null);
      setAnswers([]);
      message.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionDetail();
  }, [questionId]);

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để bỏ phiếu');
      history.push('/login');
      return;
    }

    if (!questionId) return;

    try {
      await request(`/api/questions/${questionId}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        data: { value: type === 'up' ? 1 : -1 },
      });
      loadQuestionDetail();
    } catch {
      message.error('Bỏ phiếu thất bại');
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
      await request(`/api/answers/${answerId}/accept`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      message.success('✅ Đã chọn câu trả lời hay nhất!');
      loadQuestionDetail();
    } catch {
      message.error('Chọn câu trả lời hay nhất thất bại');
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
    if (!questionId) return;

    try {
      await request(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        data: { content: newAnswer },
      });
      setNewAnswer('');
      message.success('🎉 Câu trả lời đã được đăng!');
      loadQuestionDetail();
    } catch {
      message.error('Đăng câu trả lời thất bại');
    }
  };

  const sortedAnswers = [...answers].sort(
    (a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0),
  );

  const questionContent = question?.content ?? question?.excerpt ?? '';

  if (loading) {
    return <div>Đang tải bài viết...</div>;
  }

  if (!question) {
    return <div>Không tìm thấy bài viết</div>;
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
              <span className={styles.solvedBadge}>
                <CheckCircleFilled /> Đã Giải Quyết
              </span>
            )}
            <span className={styles.subjectBadge}>{question.subject}</span>
          </div>
          <h1 className={styles.questionTitle}>{question.title}</h1>
          <div className={styles.questionMeta}>
            <Avatar size={32} style={{ background: 'var(--color-primary)' }}>
              {question.author.charAt(0)}
            </Avatar>
            <span
              className={styles.authorName}
              onClick={() => history.push(`/profile/${question.authorId}`)}
            >
              {question.author}
            </span>
            <span className={styles.roleBadge}>
              {question.authorRole === 'teacher'
                ? '👨‍🏫 Giảng viên'
                : '👨‍🎓 Sinh viên'}
            </span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.timestamp}>{question.timestamp}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.viewCount}>
              👁 {question.views} lượt xem
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.questionContent}>
          {questionContent.split('\n\n').map((block, i) => {
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
          {question?.tags?.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
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
            {isBookmarked ? <BookFilled /> : <BookOutlined />}
            {isBookmarked ? 'Đã Lưu' : 'Lưu Bài'}
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => {
              const url = window.location.href;

              // Kiểm tra xem trình duyệt có hỗ trợ API Clipboard hiện đại không (HTTPS hoặc localhost)
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                  .writeText(url)
                  .then(() => {
                    message.success('Đã sao chép link!');
                  })
                  .catch(() => {
                    message.error('Không thể sao chép liên kết');
                  });
              } else {
                // Giải pháp dự phòng (Fallback) dành cho môi trường HTTP thường
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed'; // Tránh làm cuộn trang bậy bạ
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.opacity = '0';

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                  const successful = document.execCommand('copy');
                  if (successful) {
                    message.success('Đã sao chép link!');
                  } else {
                    message.error('Không thể sao chép liên kết');
                  }
                } catch (err) {
                  message.error(
                    'Trình duyệt không hỗ trợ tính năng sao chép tự động',
                  );
                }

                document.body.removeChild(textArea);
              }
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
