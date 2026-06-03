import React, { useState } from 'react';
import { Avatar, Button, Space, Tag, Divider, Form, Input, Tooltip, message } from 'antd';
import {
  LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled,
  ShareAltOutlined, BookmarkOutlined, BookmarkFilled,
  CheckCircleFilled, CheckCircleOutlined, ArrowLeftOutlined, CopyOutlined,
} from '@ant-design/icons';
import { useParams, history } from '@umijs/max';
import { authUtils } from '@/utils/auth';
import styles from './index.less';

const POST_DATA = {
  id: '1',
  title: 'Giải thích OOP trong Java: Class, Object, Inheritance và Polymorphism',
  content: `OOP (Object-Oriented Programming) là một mô hình lập trình dựa trên khái niệm "đối tượng". Trong Java, OOP là nền tảng cốt lõi.

## 1. Class và Object

**Class** là bản thiết kế, mẫu để tạo ra object.
**Object** là một instance (thể hiện) của class.

\`\`\`java
public class Car {
    String color;
    String brand;
    
    public Car(String color, String brand) {
        this.color = color;
        this.brand = brand;
    }
    
    public void display() {
        System.out.println("Car: " + brand + " - " + color);
    }
}

// Tạo Object
Car myCar = new Car("red", "Toyota");
myCar.display(); // Output: Car: Toyota - red
\`\`\`

## 2. Inheritance (Kế thừa)

Inheritance cho phép một class con kế thừa thuộc tính và phương thức từ class cha.

\`\`\`java
public class Vehicle {
    String color;
    
    public void move() {
        System.out.println("Moving...");
    }
}

public class Car extends Vehicle {
    String brand;
    
    @Override
    public void move() {
        System.out.println("Car is moving with brand: " + brand);
    }
}
\`\`\`

## 3. Polymorphism (Đa Hình)

Polymorphism cho phép các object khác nhau phản hồi cùng một phương thức theo cách riêng.`,
  author: 'Nguyễn Văn A', authorId: '2', authorRole: 'student',
  authorRep: 1250, timestamp: '2 giờ trước',
  tags: ['Java', 'OOP', 'Lập Trình', 'Kế Thừa'],
  subject: 'Lập Trình Cơ Bản', votes: 45, views: 523,
};

const ANSWERS = [
  {
    id: '1', author: 'PGS.TS Lê Minh Đức', authorId: '3', authorRole: 'teacher',
    authorRep: 5430, avatar: 'L', timestamp: '1 giờ trước', votes: 28, isBest: true,
    content: `Đây là một câu hỏi rất hay về OOP! Để hiểu rõ hơn, mình sẽ giải thích từng khái niệm:

**Class** là bản thiết kế (blueprint) – giống như bản vẽ kỹ thuật của một chiếc xe.
**Object** là thực thể cụ thể – chiếc xe thật được tạo ra từ bản vẽ đó.

\`\`\`java
// Class = Bản thiết kế
class Student {
    String name;
    int age;
    
    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    void study() {
        System.out.println(name + " đang học...");
    }
}

// Object = Thực thể
Student s1 = new Student("An", 20);
Student s2 = new Student("Bình", 21);
s1.study(); // An đang học...
\`\`\`

Về **Inheritance**, đây là cơ chế quan trọng nhất trong OOP. Con kế thừa tất cả từ cha.`,
    replies: [
      {
        id: 'r1', author: 'Trần Văn B', authorId: '4', timestamp: '45 phút trước',
        content: 'Cảm ơn thầy! Phần về polymorphism thầy có thể giải thích thêm không ạ?', votes: 3,
      },
    ],
  },
  {
    id: '2', author: 'Trần Thị Hương', authorId: '2', authorRole: 'student',
    authorRep: 1250, avatar: 'T', timestamp: '30 phút trước', votes: 12, isBest: false,
    content: `Bổ sung thêm về **Encapsulation** (Đóng gói) - cũng là một trụ cột quan trọng của OOP:

\`\`\`java
public class BankAccount {
    private double balance; // Ẩn dữ liệu
    
    public double getBalance() { // Getter
        return balance;
    }
    
    public void deposit(double amount) { // Setter với validation
        if (amount > 0) balance += amount;
    }
}
\`\`\`

Encapsulation giúp bảo vệ dữ liệu và giảm sự phụ thuộc giữa các module.`,
    replies: [],
  },
];

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const currentUser = authUtils.getCurrentUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [votes, setVotes] = useState(POST_DATA.votes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [answers, setAnswers] = useState(ANSWERS);
  const [newAnswer, setNewAnswer] = useState('');
  const [isOwner] = useState(currentUser?.id === POST_DATA.authorId);

  const handleVote = (type: 'up' | 'down') => {
    if (type === 'up') {
      if (!isLiked) { setVotes(votes + (isDisliked ? 2 : 1)); setIsLiked(true); setIsDisliked(false); }
      else { setVotes(votes - 1); setIsLiked(false); }
    } else {
      if (!isDisliked) { setVotes(votes - (isLiked ? 2 : 1)); setIsDisliked(true); setIsLiked(false); }
      else { setVotes(votes + 1); setIsDisliked(false); }
    }
  };

  const handleSelectBest = (answerId: string) => {
    if (!isOwner) { message.warning('Chỉ người đặt câu hỏi mới có thể chọn câu trả lời hay nhất'); return; }
    setAnswers(answers.map((a) => ({ ...a, isBest: a.id === answerId })));
    message.success('✅ Đã chọn câu trả lời hay nhất!');
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) { message.warning('Vui lòng nhập câu trả lời'); return; }
    if (!currentUser) { message.warning('Vui lòng đăng nhập để trả lời'); history.push('/login'); return; }
    const newAns = {
      id: Date.now().toString(), author: currentUser.name,
      authorId: currentUser.id, authorRole: currentUser.role,
      authorRep: currentUser.reputation, avatar: currentUser.name.charAt(0),
      timestamp: 'Vừa xong', votes: 0, isBest: false, content: newAnswer, replies: [],
    };
    setAnswers([...answers, newAns]);
    setNewAnswer('');
    message.success('🎉 Câu trả lời đã được đăng!');
  };

  const sortedAnswers = [...answers].sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0));

  return (
    <div className={styles.postDetail}>
      <button className={styles.backBtn} onClick={() => history.push('/forum')}>
        <ArrowLeftOutlined /> Quay lại
      </button>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <div className={styles.badges}>
            {answers.some((a) => a.isBest) && (
              <span className={styles.solvedBadge}><CheckCircleFilled /> Đã Giải Quyết</span>
            )}
            <span className={styles.subjectBadge}>{POST_DATA.subject}</span>
          </div>
          <h1 className={styles.questionTitle}>{POST_DATA.title}</h1>
          <div className={styles.questionMeta}>
            <Avatar size={32} style={{ background: 'var(--color-primary)' }}>
              {POST_DATA.author.charAt(0)}
            </Avatar>
            <span className={styles.authorName} onClick={() => history.push(`/profile/${POST_DATA.authorId}`)}>
              {POST_DATA.author}
            </span>
            <span className={styles.roleBadge}>
              {POST_DATA.authorRole === 'teacher' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Sinh viên'}
            </span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.timestamp}>{POST_DATA.timestamp}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.viewCount}>👁 {POST_DATA.views} lượt xem</span>
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
          })}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {POST_DATA.tags.map((tag) => (
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
            {isBookmarked ? <BookmarkFilled /> : <BookmarkOutlined />}
            {isBookmarked ? 'Đã lưu' : 'Lưu bài'}
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
                <button className={styles.smallVoteBtn}>
                  <LikeOutlined />
                </button>
                <span className={styles.smallVoteNum}>{answer.votes}</span>
                <button className={styles.smallVoteBtn}>
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
                    {answer.authorRole === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                  </span>
                  <span className={styles.repBadge}>⭐ {answer.authorRep}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.timestamp}>{answer.timestamp}</span>
                </div>

                <div className={styles.answerText}>
                  {answer.content.split('\n\n').map((block, i) => {
                    if (block.startsWith('```')) {
                      const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
                      return (
                        <div key={i} className={styles.codeWrapper}>
                          <div className={styles.codeHeader}>
                            <span>Java</span>
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
                  <button className={styles.replyBtn}>💬 Trả Lời</button>
                  {isOwner && !answer.isBest && (
                    <button className={styles.selectBestBtn} onClick={() => handleSelectBest(answer.id)}>
                      <CheckCircleOutlined /> Chọn Hay Nhất
                    </button>
                  )}
                </div>

                {/* Replies */}
                {answer.replies.length > 0 && (
                  <div className={styles.replies}>
                    {answer.replies.map((reply) => (
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
          <h3>Viết câu trả lời</h3>
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
              Đăng câu trả lời
            </Button>
            <span className={styles.charCount}>{newAnswer.length} ký tự</span>
          </div>
        </div>
      </div>
    </div>
  );
}
