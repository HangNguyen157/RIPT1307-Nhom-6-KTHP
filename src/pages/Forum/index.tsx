import PostCard from '@/components/PostCard';
import {
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { history, request } from '@umijs/max';
import { Button, Empty, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const trendingTags = [
  { name: 'Java', count: 245, color: '#f97316' },
  { name: 'React', count: 198, color: '#06b6d4' },
  { name: 'Python', count: 176, color: '#3b82f6' },
  { name: 'SQL', count: 154, color: '#8b5cf6' },
];

export default function Forum() {
  const [activeFilter, setActiveFilter] = useState('hot');
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, leaderboardRes] = await Promise.all([
          request('/api/posts', { method: 'GET' }),
          request('/api/leaderboard', { method: 'GET' }),
        ]);
        if (postsRes?.success && Array.isArray(postsRes.data.list)) {
          setPosts(postsRes.data.list);
          setFilteredPosts(postsRes.data.list);
        }
        if (
          leaderboardRes?.success &&
          Array.isArray(leaderboardRes.data?.list)
        ) {
          setTopContributors(
            leaderboardRes.data.list.slice(0, 3).map((u: any) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              rep: u.rep ?? 0,
              emoji: (u.rep ?? 0) >= 2000 ? '🏆' : '⭐',
            })),
          );
        }
      } catch (err) {
        console.error('Error fetching forum data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterOptions = [
    { key: 'hot', label: 'Nóng', icon: <FireOutlined /> },
    { key: 'newest', label: 'Mới Nhất', icon: <ClockCircleOutlined /> },
  ];

  const handleFilter = (key: string) => {
    setActiveFilter(key);
    if (key === 'newest') {
      setFilteredPosts([...posts].reverse());
    } else {
      setFilteredPosts(posts);
    }
  };

  return (
    <div className={styles.forumPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Diễn Đàn Hỏi Đáp</h1>
          <p className={styles.pageSubtitle}>
            Khám phá {posts.length}+ câu hỏi từ cộng đồng sinh viên
          </p>
        </div>
        <Button
          type="primary"
          danger
          size="large"
          className={styles.askBtn}
          onClick={() => history.push('/post/new')}
        >
          + Đặt Câu Hỏi
        </Button>
      </div>

      <div className={styles.forumLayout}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Filter Tabs */}
          <div className={styles.filterBar}>
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                className={`${styles.filterBtn} ${
                  activeFilter === opt.key ? styles.active : ''
                }`}
                onClick={() => handleFilter(opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Post List */}
          <div className={styles.postList}>
            {loading ? (
              <Skeleton active />
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={styles.postItem}
                >
                  <PostCard
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.author?.name || 'Ẩn danh'}
                    tags={post.tags || []}
                    votes={post.votes ?? 0}
                    comments={post.comments ?? 0}
                    views={post.views ?? 0}
                    timestamp={post.timestamp ?? 'Mới'}
                    subject={post.subject}
                    isSolved={post.isSolved}
                  />
                </div>
              ))
            ) : (
              <Empty description="Chưa có câu hỏi" />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          {/* Top Contributors */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <TrophyOutlined className={styles.widgetIcon} />
              <span>Top Đóng Góp</span>
            </div>
            <div className={styles.contributorList}>
              {topContributors.map((user, index) => (
                <div
                  key={user.id}
                  className={styles.contributor}
                  onClick={() => history.push(`/profile/${user.id}`)}
                >
                  <span className={styles.rank}>#{index + 1}</span>
                  <div className={styles.contributorAvatar}>
                    {user.name.charAt(0)}
                  </div>
                  <div className={styles.contributorInfo}>
                    <div className={styles.contributorName}>{user.name}</div>
                    <div className={styles.contributorRole}>
                      {user.role === 'teacher'
                        ? '👨‍🏫 Giảng viên'
                        : '👨‍🎓 Sinh viên'}
                    </div>
                  </div>
                  <div className={styles.contributorRep}>
                    <span>{user.emoji}</span>
                    <span>{user.rep.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.viewMoreBtn}
              onClick={() => history.push('/leaderboard')}
            >
              Xem Bảng Xếp Hạng <RightOutlined />
            </button>
          </div>

          {/* Trending Tags */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <FireOutlined className={styles.widgetIcon} />
              <span>Tags Thịnh Hành</span>
            </div>
            <div className={styles.trendingTags}>
              {trendingTags.map((tag) => (
                <div
                  key={tag.name}
                  className={styles.trendingTag}
                  onClick={() => history.push(`/tags`)}
                >
                  <span
                    className={styles.tagDot}
                    style={{ background: tag.color }}
                  />
                  <span className={styles.tagName}>{tag.name}</span>
                  <span className={styles.tagCount}>{tag.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <ClockCircleOutlined className={styles.widgetIcon} />
              <span>Hoạt Động Gần Đây</span>
            </div>
            <div className={styles.activityList}>
              {[
                {
                  user: 'Nguyễn Văn A',
                  action: 'đã đặt câu hỏi',
                  time: '5 phút trước',
                  emoji: '❓',
                },
                {
                  user: 'Trần Thị B',
                  action: 'đã trả lời',
                  time: '12 phút trước',
                  emoji: '💬',
                },
                {
                  user: 'Lê Văn C',
                  action: 'đã upvote',
                  time: '20 phút trước',
                  emoji: '👍',
                },
                {
                  user: 'PGS.TS Lê Minh Đức',
                  action: 'đã chọn best answer',
                  time: '1 giờ trước',
                  emoji: '✅',
                },
              ].map((act, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles.activityEmoji}>{act.emoji}</span>
                  <div>
                    <span className={styles.activityUser}>{act.user}</span>
                    <span className={styles.activityAction}> {act.action}</span>
                    <div className={styles.activityTime}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
