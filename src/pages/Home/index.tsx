import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import { ArrowRightOutlined, RightOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import PostCard from '@/components/PostCard';
import styles from './index.less';

const mockPosts = [
  {
    id: '1', title: 'Giải thích OOP trong Java: Class, Object, Inheritance',
    excerpt: 'OOP là nền tảng của Java. Trong bài viết này, tôi sẽ giải thích chi tiết về các khái niệm cốt lõi như Class, Object, Inheritance và cách sử dụng chúng...',
    author: 'Nguyễn Văn A', tags: ['Java', 'OOP', 'Lập Trình'],
    votes: 45, comments: 12, views: 523, timestamp: '2 giờ trước', subject: 'Lập Trình Cơ Bản', isSolved: true,
  },
  {
    id: '2', title: 'React Hooks: useState, useEffect, useContext - Hướng dẫn đầy đủ',
    excerpt: 'React Hooks là một cách mới để viết components trong React. Bài viết này sẽ hướng dẫn bạn cách sử dụng các hooks phổ biến nhất...',
    author: 'Trần Thị B', tags: ['React', 'JavaScript', 'Web Development'],
    votes: 67, comments: 23, views: 892, timestamp: '5 giờ trước', subject: 'Web Development', isSolved: false,
  },
  {
    id: '3', title: 'SQL: JOIN, Subquery, và Optimization khi làm việc với big data',
    excerpt: 'JOIN là một trong những khái niệm quan trọng nhất trong SQL. Bài viết này sẽ giáo dạy bạn cách tối ưu query...',
    author: 'Phạm Minh D', tags: ['SQL', 'Database', 'Optimization'],
    votes: 56, comments: 15, views: 734, timestamp: '2 ngày trước', subject: 'Cơ Sở Dữ Liệu', isSolved: true,
  },
];

const stats = [
  { value: '10.000+', label: 'Câu Hỏi', icon: '❓', color: '#dc2626' },
  { value: '2.000+', label: 'Sinh Viên', icon: '👨‍🎓', color: '#3b82f6' },
  { value: '500+', label: 'Giảng Viên', icon: '👨‍🏫', color: '#10b981' },
  { value: '8.000+', label: 'Câu Trả Lời', icon: '💬', color: '#f59e0b' },
];

const features = [
  {
    icon: '🎯',
    title: 'Hỏi & Đáp Nhanh',
    desc: 'Đặt câu hỏi và nhận câu trả lời từ sinh viên và giảng viên trong vài phút',
  },
  {
    icon: '🏆',
    title: 'Hệ Thống Uy Tín',
    desc: 'Tích điểm, nhận huy hiệu và leo lên bảng xếp hạng cộng đồng',
  },
  {
    icon: '💡',
    title: 'Kiến Thức Chuyên Sâu',
    desc: 'Tìm kiếm câu trả lời cho mọi môn học: CTDL, Web Dev, AI, Database...',
  },
  {
    icon: '🤝',
    title: 'Cộng Đồng Học Thuật',
    desc: 'Kết nối với hàng nghìn sinh viên và giảng viên cùng trường',
  },
];

const topUsers = [
  { name: 'PGS.TS Lê Minh Đức', role: 'Giảng viên', rep: 5430, emoji: '🏆', id: '3' },
  { name: 'Trần Thị Hương', role: 'Sinh viên CNTT', rep: 1250, emoji: '⭐', id: '2' },
  { name: 'Hoàng Văn Bình', role: 'Sinh viên KTPM', rep: 980, emoji: '⭐', id: '4' },
];

export default function Home() {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const targetValues = [10000, 2000, 500, 8000];

  useEffect(() => {
    const timers = targetValues.map((target, i) => {
      const step = Math.ceil(target / 60);
      const interval = setInterval(() => {
        setCounters((prev) => {
          const next = [...prev];
          if (next[i] < target) {
            next[i] = Math.min(next[i] + step, target);
          }
          return next;
        });
      }, 16);
      return interval;
    });
    return () => timers.forEach(clearInterval);
  }, []);

  const formatNumber = (n: number, i: number) => {
    if (i === 0) return n >= 10000 ? '10.000+' : n.toLocaleString('vi');
    if (i === 1) return n >= 2000 ? '2.000+' : n.toLocaleString('vi');
    if (i === 2) return n >= 500 ? '500+' : n.toLocaleString('vi');
    return n >= 8000 ? '8.000+' : n.toLocaleString('vi');
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🎓 Nền tảng học thuật #1 PTIT</div>
          <h1 className={styles.heroTitle}>
            Kết Nối<br />
            <span className={styles.heroTitleHighlight}>Tri Thức Sinh Viên</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Hỏi, trả lời và cùng nhau học tập với cộng đồng sinh viên và giảng viên.
            Giống StackOverflow nhưng dành riêng cho bạn.
          </p>
          <div className={styles.heroCta}>
            <Button
              type="primary"
              danger
              size="large"
              className={styles.ctaPrimary}
              onClick={() => history.push('/post/new')}
            >
              ✏️ Đặt Câu Hỏi Ngay
            </Button>
            <Button
              size="large"
              className={styles.ctaSecondary}
              onClick={() => history.push('/forum')}
            >
              Khám Phá Diễn Đàn <ArrowRightOutlined />
            </Button>
          </div>

          {/* Tags Showcase */}
          <div className={styles.tagCloud}>
            {['Java', 'React', 'Python', 'SQL', 'AI/ML', 'Node.js', 'Git', 'CTDL'].map((tag) => (
              <span key={tag} className={styles.tagPill}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.heroIllustration}>
          <div className={styles.floatingCard} style={{ animationDelay: '0s' }}>
            <span>💬</span>
            <div>
              <div className={styles.cardTitle}>Câu trả lời mới</div>
              <div className={styles.cardSub}>OOP trong Java</div>
            </div>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.4s' }}>
            <span>🏆</span>
            <div>
              <div className={styles.cardTitle}>Best Answer</div>
              <div className={styles.cardSub}>+25 điểm uy tín</div>
            </div>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.8s' }}>
            <span>👍</span>
            <div>
              <div className={styles.cardTitle}>+100 upvote</div>
              <div className={styles.cardSub}>Huy hiệu mở khóa</div>
            </div>
          </div>
          <div className={styles.heroEmoji}>📚</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</div>
            <div className={styles.statValue} style={{ color: stat.color }}>
              {formatNumber(counters[i], i)}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Hot Questions */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🔥 Câu Hỏi Nổi Bật</h2>
          <Button type="link" danger onClick={() => history.push('/forum')}>
            Xem Tất Cả <ArrowRightOutlined />
          </Button>
        </div>
        <div className={styles.postGrid}>
          {mockPosts.map((post, index) => (
            <div key={post.id} className={styles.postItem} style={{ animationDelay: `${index * 0.1}s` }}>
              <PostCard
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                tags={post.tags}
                votes={post.votes}
                comments={post.comments}
                views={post.views}
                timestamp={post.timestamp}
                subject={post.subject}
                isSolved={post.isSolved}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>✨ Tại Sao Chọn EduForum?</h2>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Contributors */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🏆 Top Đóng Góp Viên</h2>
          <Button type="link" danger onClick={() => history.push('/leaderboard')}>
            Xem Bảng Xếp Hạng <ArrowRightOutlined />
          </Button>
        </div>
        <div className={styles.contributorsGrid}>
          {topUsers.map((user, i) => (
            <div
              key={user.id}
              className={styles.contributorCard}
              onClick={() => history.push(`/profile/${user.id}`)}
            >
              <div className={styles.contributorRank}>#{i + 1}</div>
              <div className={styles.contributorAvatar}>{user.name.charAt(0)}</div>
              <div className={styles.contributorName}>{user.name}</div>
              <div className={styles.contributorRole}>{user.role}</div>
              <div className={styles.contributorRep}>
                {user.emoji} {user.rep.toLocaleString('vi')} pts
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerContent}>
          <h2>Sẵn sàng chia sẻ kiến thức?</h2>
          <p>Tham gia cùng hàng nghìn sinh viên và giảng viên ngay hôm nay</p>
          <div className={styles.ctaBannerActions}>
            <Button size="large" type="primary" className={styles.ctaBannerBtn}
              onClick={() => history.push('/register')}>
              Đăng Ký Miễn Phí
            </Button>
            <Button size="large" ghost className={styles.ctaBannerGhost}
              onClick={() => history.push('/forum')}>
              Khám Phá Ngay
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}