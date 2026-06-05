import React, { useState, useEffect } from 'react';
import { Avatar, Button, Tabs, Tag, Progress, Tooltip, Spin, message } from 'antd';
import {
  EditOutlined, MailOutlined, TrophyOutlined,
  FireOutlined, LikeOutlined, CalendarOutlined,
  BookOutlined, MessageOutlined, StarOutlined,
} from '@ant-design/icons';
import { useParams, history, request } from '@umijs/max';
import { getReputationLevel, getNextLevel, getProgressToNextLevel, getBadgesByIds } from '@/utils/reputation';
import PostCard from '@/components/PostCard';
import { authUtils } from '@/utils/auth';
import styles from './index.less';

export default function Profile() {
  const { id: paramId } = useParams<{ id: string }>();
  const currentUser = authUtils.getCurrentUser();
  const userId = paramId || currentUser?.id || '2';

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const resUser = await request<{ success: boolean; data: any }>(`/api/admin/users/${userId}`, {
          method: 'GET',
        });
        if (resUser && resUser.success) {
          setUser(resUser.data);
        }

        const resPosts = await request<{ success: boolean; data: { list: any[] } }>('/api/posts', {
          method: 'GET',
          params: {
            authorId: userId,
          },
        });
        if (resPosts && resPosts.success) {
          setPosts(resPosts.data.list);
        }
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
        message.error('Không thể tải thông tin trang cá nhân');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải thông tin cá nhân..." />
      </div>
    );
  }

  const repLevel = getReputationLevel(user.reputation);
  const nextLevel = getNextLevel(user.reputation);
  const progress = getProgressToNextLevel(user.reputation);
  const badges = getBadgesByIds(user.badges || []);


  const tabItems = [
    {
      key: 'posts',
      label: (
        <span><BookOutlined /> Câu Hỏi ({user.posts})</span>
      ),
      children: (
        <div className={styles.postList}>
          {posts.map((post) => (
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
            { text: 'Đã trả lời "Cách dùng useEffect trong React"', time: '2 giờ trước', votes: 8 },
            { text: 'Câu trả lời về SQL JOIN được chọn hay nhất', time: '1 ngày trước', votes: 15 },
            { text: 'Đã trả lời "Phân biệt Stack và Queue"', time: '3 ngày trước', votes: 5 },
          ].map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>{item.text}</span>
                <div className={styles.activityMeta}>
                  <span>{item.time}</span>
                  <span>{item.votes} vote</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'saved',
      label: <span><StarOutlined /> Đã Lưu</span>,
      children: (
        <div className={styles.savedInfo}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>—</div>
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
            <div className={styles.levelBadge} style={{ color: repLevel.color }}>{repLevel.name.charAt(0)}</div>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.profileName}>{user.name}</h1>
              <span className={styles.roleTag}>
                {user.role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
              </span>
            </div>

            <div className={styles.profileDetails}>
              <span><MailOutlined /> {user.email}</span>
              <span>{user.department}</span>
              <span>{user.major}</span>
              <span>{user.studentId}</span>
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
              <span style={{ color: repLevel.color }}>{repLevel.name}</span>
              <span className={styles.repPoints}>{user.reputation} pts</span>
            </div>
            {nextLevel && (
              <span className={styles.nextLevel}>
                Cần <strong>{nextLevel.minPoints - user.reputation}</strong> pts để lên {nextLevel.name}
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
            <div className={styles.badgesTitle}>Huy Hiệu</div>
            <div className={styles.badgesList}>
              {badges.map((badge) => (
                <Tooltip key={badge.id} title={badge.description}>
                  <div className={styles.badge} style={{ borderColor: `${badge.color}40`, background: `${badge.color}10` }}>
                    <span className={styles.badgeEmoji}>{badge.name.charAt(0)}</span>
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