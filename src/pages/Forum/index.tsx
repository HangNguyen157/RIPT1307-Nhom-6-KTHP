import PostCard from '@/components/PostCard';
import { MOCK_QUESTIONS } from '@/server/seed/questions';
import {
  ClockCircleOutlined,
  FireOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const mockPosts = MOCK_QUESTIONS;

const topContributors = [
  {
    id: '3',
    name: 'PGS.TS Lê Minh Đức',
    role: 'teacher',
    rep: 5430,
    emoji: '🏆',
  },
  { id: '2', name: 'Trần Thị Hương', role: 'student', rep: 1250, emoji: '⭐' },
  { id: '4', name: 'Hoàng Văn Bình', role: 'student', rep: 980, emoji: '⭐' },
  { id: '5', name: 'Nguyễn Minh Châu', role: 'teacher', rep: 870, emoji: '🤝' },
  { id: '6', name: 'Lê Thị Lan', role: 'student', rep: 654, emoji: '🤝' },
];

const trendingTags = [
  { name: 'Java', count: 245, color: '#f97316' },
  { name: 'React', count: 198, color: '#06b6d4' },
  { name: 'Python', count: 176, color: '#3b82f6' },
  { name: 'SQL', count: 154, color: '#8b5cf6' },
  { name: 'JavaScript', count: 142, color: '#eab308' },
  { name: 'AI/ML', count: 128, color: '#ec4899' },
];

export default function Forum() {
  const [activeFilter, setActiveFilter] = useState('hot');
  const [activePosts, setActivePosts] = useState(mockPosts);

  const filterOptions = [
    { key: 'hot', label: 'Nóng', icon: <FireOutlined /> },
    { key: 'newest', label: 'Mới Nhất', icon: <ClockCircleOutlined /> },
    { key: 'votes', label: 'Nhiều Vote', icon: <LikeOutlined /> },
    {
      key: 'unanswered',
      label: 'Chưa Trả Lời',
      icon: <QuestionCircleOutlined />,
    },
  ];

  const handleFilter = (key: string) => {
    setActiveFilter(key);
    if (key === 'unanswered') {
      setActivePosts(mockPosts.filter((p) => !p.isSolved));
    } else if (key === 'votes') {
      setActivePosts([...mockPosts].sort((a, b) => b.votes - a.votes));
    } else if (key === 'newest') {
      setActivePosts([...mockPosts].reverse());
    } else {
      setActivePosts(mockPosts);
    }
  };

  return (
    <div className={styles.forumPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Diễn Đàn Hỏi Đáp</h1>
          <p className={styles.pageSubtitle}>
            Khám phá {mockPosts.length * 100}+ câu hỏi từ cộng đồng sinh viên
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
            {activePosts.map((post, index) => (
              <div
                key={post.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={styles.postItem}
              >
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
