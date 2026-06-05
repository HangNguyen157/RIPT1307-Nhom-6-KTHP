import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import {
  ArrowRightOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CommentOutlined,
  AimOutlined,
  TrophyOutlined,
  BulbOutlined,
  LikeOutlined,
  EditOutlined,
  BookOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { history, request } from '@umijs/max';
import PostCard from '@/components/PostCard';
import styles from './index.less';

const stats = [
  { value: '10.000+', label: 'Câu Hỏi', icon: <QuestionCircleOutlined />, color: '#dc2626' },
  { value: '2.000+', label: 'Sinh Viên', icon: <TeamOutlined />, color: '#3b82f6' },
  { value: '500+', label: 'Giảng Viên', icon: <UserOutlined />, color: '#10b981' },
  { value: '8.000+', label: 'Câu Trả Lời', icon: <CommentOutlined />, color: '#f59e0b' },
];

const features = [
  {
    icon: <AimOutlined />,
    title: 'Hỏi & Đáp Nhanh',
    desc: 'Đặt câu hỏi và nhận câu trả lời từ sinh viên và giảng viên trong vài phút',
  },
  {
    icon: <TrophyOutlined />,
    title: 'Hệ Thống Uy Tín',
    desc: 'Tích điểm, nhận huy hiệu và leo lên bảng xếp hạng cộng đồng',
  },
  {
    icon: <BulbOutlined />,
    title: 'Kiến Thức Chuyên Sâu',
    desc: 'Tìm kiếm câu trả lời cho mọi môn học: CTDL, Web Dev, AI, Database...',
  },
  {
    icon: <TeamOutlined />,
    title: 'Cộng Đồng Học Thuật',
    desc: 'Kết nối với hàng nghìn sinh viên và giảng viên cùng trường',
  },
];

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const targetValues = [10000, 2000, 500, 8000];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPosts = await request<{ success: boolean; data: { list: any[] } }>('/api/posts', {
          params: { sort: 'views' }
        });
        if (resPosts && resPosts.success) {
          setPosts(resPosts.data.list.slice(0, 3));
        }

        const resLeaderboard = await request<{ success: boolean; data: { list: any[] } }>('/api/leaderboard');
        if (resLeaderboard && resLeaderboard.success) {
          setTopUsers(resLeaderboard.data.list.slice(0, 3));
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <div className={styles.heroBadge}>Nền tảng học thuật #1 PTIT</div>
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
              <EditOutlined /> Đặt Câu Hỏi Ngay
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
            <CommentOutlined />
            <div>
              <div className={styles.cardTitle}>Câu trả lời mới</div>
              <div className={styles.cardSub}>OOP trong Java</div>
            </div>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.4s' }}>
            <TrophyOutlined />
            <div>
              <div className={styles.cardTitle}>Best Answer</div>
              <div className={styles.cardSub}>+25 điểm uy tín</div>
            </div>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.8s' }}>
            <LikeOutlined />
            <div>
              <div className={styles.cardTitle}>+100 upvote</div>
              <div className={styles.cardSub}>Huy hiệu mở khóa</div>
            </div>
          </div>
          <BookOutlined className={styles.heroEmoji} />
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
          <h2><FireOutlined /> Câu Hỏi Nổi Bật</h2>
          <Button type="link" danger onClick={() => history.push('/forum')}>
            Xem Tất Cả <ArrowRightOutlined />
          </Button>
        </div>
        <div className={styles.postGrid}>
          {posts.map((post, index) => (
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
          <h2><StarOutlined /> Tại Sao Chọn EduForum?</h2>
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
          <h2><TrophyOutlined /> Top Đóng Góp Viên</h2>
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
              <div className={styles.contributorRole}>
                {user.role === 'teacher' ? 'Giảng viên' : user.role === 'admin' ? 'Quản trị viên' : `Sinh viên ${user.department || ''}`}
              </div>
              <div className={styles.contributorRep}>
                {(user.reputation ?? 0).toLocaleString('vi')} pts
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