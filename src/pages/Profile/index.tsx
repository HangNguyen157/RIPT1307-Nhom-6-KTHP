import React, { useState } from 'react';
import { Avatar, Button, Tabs, Tag, Progress, Tooltip } from 'antd';
import {
  EditOutlined, MailOutlined, TrophyOutlined,
  FireOutlined, LikeOutlined, CalendarOutlined,
  BookOutlined, MessageOutlined, BookmarkOutlined,
} from '@ant-design/icons';
import { useParams, history } from '@umijs/max';
import { getReputationLevel, getNextLevel, getProgressToNextLevel, getBadgesByIds } from '@/utils/reputation';
import PostCard from '@/components/PostCard';
import styles from './index.less';

const MOCK_USER = {
  id: '2', name: 'Trần Thị Hương', email: 'huong@student.ptit.edu.vn',
  role: 'student', department: 'Công Nghệ Thông Tin', major: 'Lập Trình Web',
  studentId: 'B21DCCN123', bio: 'Sinh viên năm 3 ngành CNTT, đam mê Web Development và AI. Yêu thích React, Node.js và Python.',
  reputation: 1250, posts: 28, answers: 45, votes: 320, followers: 89, following: 34,
  joinDate: '01/09/2024', badges: ['first-question', 'helpful', '100-votes'],
  topTags: ['React', 'JavaScript', 'Python', 'Java'],
};

const userPosts = [
  {
    id: '1', title: 'Giải thích OOP trong Java: Class, Object, Inheritance',
    excerpt: 'OOP là nền tảng của Java. Tôi sẽ giải thích chi tiết về các khái niệm cốt lõi...',
    author: MOCK_USER.name, tags: ['Java', 'OOP', 'Lập Trình'],
    votes: 45, comments: 12, views: 523, timestamp: '2 giờ trước', subject: 'Lập Trình Cơ Bản', isSolved: true,
  },
  {
    id: '2', title: 'React Hooks: useState, useEffect, useContext',
    excerpt: 'React Hooks là một cách mới để viết components trong React...',
    author: MOCK_USER.name, tags: ['React', 'JavaScript', 'Web Development'],
    votes: 67, comments: 23, views: 892, timestamp: '5 giờ trước', subject: 'Web Development', isSolved: false,
  },
];

// Activity Heatmap - generate last 52 weeks
const generateHeatmap = () => {
  const data = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const rand = Math.random();
      week.push(rand < 0.5 ? 0 : rand < 0.7 ? 1 : rand < 0.85 ? 2 : rand < 0.95 ? 3 : 4);
    }
    data.push(week);
  }
  return data;
};

const heatmapData = generateHeatmap();
const heatColors = ['#e5e7eb', '#fecaca', '#f87171', '#ef4444', '#b91c1c'];

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const user = MOCK_USER;
  const repLevel = getReputationLevel(user.reputation);
  const nextLevel = getNextLevel(user.reputation);
  const progress = getProgressToNextLevel(user.reputation);
  const badges = getBadgesByIds(user.badges);

  const tabItems = [
    {
      key: 'posts',
      label: (
        <span><BookOutlined /> Câu Hỏi ({user.posts})</span>
      ),
      children: (
        <div className={styles.postList}>
          {userPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      ),
    },
    {
      key: 'answers',
      label: <span><MessageOutlined /> Câu Trả Lời ({user.answers})</span>,
      children: (
        <div className={styles.activityFeed}>
          {[
            { icon: '💬', text: 'Đã trả lời "Cách dùng useEffect trong React"', time: '2 giờ trước', votes: 8 },
            { icon: '✅', text: 'Câu trả lời về SQL JOIN được chọn hay nhất', time: '1 ngày trước', votes: 15 },
            { icon: '💬', text: 'Đã trả lời "Phân biệt Stack và Queue"', time: '3 ngày trước', votes: 5 },
          ].map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <span className={styles.activityIcon}>{item.icon}</span>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>{item.text}</span>
                <div className={styles.activityMeta}>
                  <span>{item.time}</span>
                  <span>👍 {item.votes} vote</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'saved',
      label: <span><BookmarkOutlined /> Đã Lưu</span>,
      children: (
        <div className={styles.savedInfo}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📌</div>
            <p>Chưa có bài viết được lưu</p>
            <Button type="primary" danger onClick={() => history.push('/forum')}>
              Khám Phá Diễn Đàn
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'activity',
      label: <span><CalendarOutlined /> Hoạt Động</span>,
      children: (
        <div>
          <div className={styles.heatmapSection}>
            <h3 className={styles.heatmapTitle}>Activity năm 2024</h3>
            <div className={styles.heatmap}>
              {heatmapData.map((week, wi) => (
                <div key={wi} className={styles.heatmapWeek}>
                  {week.map((level, di) => (
                    <Tooltip key={di} title={`${level} hoạt động`}>
                      <div
                        className={styles.heatmapCell}
                        style={{ background: heatColors[level] }}
                      />
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.heatmapLegend}>
              <span>Ít</span>
              {heatColors.map((c, i) => (
                <div key={i} className={styles.legendCell} style={{ background: c }} />
              ))}
              <span>Nhiều</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.profilePage}>
      {/* Cover Photo */}
      <div className={styles.coverPhoto}>
        <div className={styles.coverGradient} />
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <Avatar size={100} className={styles.avatar}>
              {user.name.charAt(0)}
            </Avatar>
            <div className={styles.levelEmoji}>{repLevel.emoji}</div>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.profileName}>{user.name}</h1>
              <span className={styles.roleTag}>
                {user.role === 'teacher' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Sinh viên'}
              </span>
            </div>

            <div className={styles.profileDetails}>
              <span><MailOutlined /> {user.email}</span>
              <span>🏛️ {user.department}</span>
              <span>📚 {user.major}</span>
              <span>🪪 {user.studentId}</span>
              <span><CalendarOutlined /> Tham gia {user.joinDate}</span>
            </div>

            <p className={styles.bio}>{user.bio}</p>

            <div className={styles.topTagsRow}>
              {user.topTags.map((tag) => (
                <span key={tag} className={styles.topTag}>{tag}</span>
              ))}
            </div>
          </div>

          <Button type="primary" danger icon={<EditOutlined />} className={styles.editBtn}>
            Chỉnh Sửa
          </Button>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          {[
            { icon: <TrophyOutlined />, label: 'Điểm Uy Tín', value: user.reputation, color: '#dc2626' },
            { icon: <BookOutlined />, label: 'Câu Hỏi', value: user.posts, color: '#3b82f6' },
            { icon: <MessageOutlined />, label: 'Câu Trả Lời', value: user.answers, color: '#10b981' },
            { icon: <LikeOutlined />, label: 'Tổng Vote', value: user.votes, color: '#f59e0b' },
            { icon: <FireOutlined />, label: 'Người Theo Dõi', value: user.followers, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</div>
              <div className={styles.statValue} style={{ color: stat.color }}>{stat.value.toLocaleString('vi')}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reputation Progress */}
        <div className={styles.repSection}>
          <div className={styles.repHeader}>
            <div className={styles.repLevel}>
              <span style={{ color: repLevel.color }}>{repLevel.emoji} {repLevel.name}</span>
              <span className={styles.repPoints}>{user.reputation} pts</span>
            </div>
            {nextLevel && (
              <span className={styles.nextLevel}>
                Cần <strong>{nextLevel.minPoints - user.reputation}</strong> pts để lên {nextLevel.emoji} {nextLevel.name}
              </span>
            )}
          </div>
          <Progress
            percent={progress}
            strokeColor={repLevel.color}
            trailColor="var(--border-color)"
            showInfo={false}
            size={['100%', 8]}
          />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className={styles.badgesSection}>
            <div className={styles.badgesTitle}>🏅 Huy Hiệu</div>
            <div className={styles.badgesList}>
              {badges.map((badge) => (
                <Tooltip key={badge.id} title={badge.description}>
                  <div className={styles.badge} style={{ borderColor: `${badge.color}40`, background: `${badge.color}10` }}>
                    <span className={styles.badgeEmoji}>{badge.emoji}</span>
                    <span className={styles.badgeName} style={{ color: badge.color }}>{badge.name}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabsCard}>
        <Tabs items={tabItems} size="large" />
      </div>
    </div>
  );
}