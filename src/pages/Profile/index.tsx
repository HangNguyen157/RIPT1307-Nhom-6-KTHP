import PostCard from '@/components/PostCard';
import {
  getBadgesByIds,
  getNextLevel,
  getProgressToNextLevel,
  getReputationLevel,
} from '@/utils/reputation';
import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  FireOutlined,
  LikeOutlined,
  MailOutlined,
  MessageOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { history, request, useParams } from '@umijs/max';
import { Avatar, Button, Empty, Progress, Skeleton, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const generateHeatmap = () => {
  const data = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const rand = Math.random();
      week.push(
        rand < 0.5 ? 0 : rand < 0.7 ? 1 : rand < 0.85 ? 2 : rand < 0.95 ? 3 : 4,
      );
    }
    data.push(week);
  }
  return data;
};

const heatmapData = generateHeatmap();
const heatColors = ['#e5e7eb', '#fecaca', '#f87171', '#ef4444', '#b91c1c'];

function formatJoinDate(date: string | undefined): string {
  if (!date) return 'Mới đây';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Mới đây';
  return d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
}

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  major?: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  posts: number;
  answers: number;
  votes: number;
  followers: number;
  following: number;
  badges: string[];
  createdAt?: string;
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Chạy cả 2 API cùng một lúc để tối ưu tốc độ
        const [userResult, postsResult] = await Promise.allSettled([
          request(`/api/admin/users/${id}`, { method: 'GET' }),
          request('/api/posts', { method: 'GET', params: { authorId: id } }),
        ]);

        // 1. Xử lý kết quả API User độc lập
        if (userResult.status === 'fulfilled') {
          const userRes = userResult.value;
          console.log('Profile Response:', userRes);

          if (userRes?.success && userRes.data) {
            setUser(userRes.data);
          } else {
            setUser(null);
          }
        } else {
          console.error('API User bị lỗi kết nối:', userResult.reason);
          setUser(null);
        }

        // 2. Xử lý kết quả API Posts độc lập (Lỗi posts thì user vẫn hiển thị bình thường)
        if (postsResult.status === 'fulfilled') {
          const postsRes = postsResult.value;
          if (postsRes?.success && Array.isArray(postsRes.data?.list)) {
            setUserPosts(postsRes.data.list);
          } else {
            setUserPosts([]);
          }
        } else {
          console.error('API Posts bị lỗi kết nối:', postsResult.reason);
          setUserPosts([]);
        }
      } catch (err) {
        console.error('Lỗi hệ thống không lường trước:', err);
        setUser(null);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <Skeleton active />;
  if (!user) return <Empty description="Không tìm thấy người dùng" />;

  const repLevel = getReputationLevel(user.reputation);
  const nextLevel = getNextLevel(user.reputation);
  const progress = getProgressToNextLevel(user.reputation);
  const badges = getBadgesByIds(user.badges || []);

  const tabItems = [
    {
      key: 'posts',
      label: (
        <span>
          <BookOutlined /> Câu Hỏi ({userPosts.length})
        </span>
      ),
      children: (
        <div className={styles.postList}>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                author={user.name}
                tags={post.tags || []}
                votes={post.votes ?? 0}
                comments={post.comments ?? 0}
                views={post.views ?? 0}
                timestamp={
                  post.created_at
                    ? new Date(post.created_at).toLocaleDateString('vi-VN')
                    : 'Mới'
                }
                subject={post.subject}
                isSolved={post.is_solved === 1 || post.isSolved}
              />
            ))
          ) : (
            <Empty description="Chưa có câu hỏi" />
          )}
        </div>
      ),
    },
    {
      key: 'saved',
      label: (
        <span>
          <BookOutlined /> Đã Lưu
        </span>
      ),
      children: (
        <div className={styles.savedInfo}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📌</div>
            <p>Chưa có bài viết được lưu</p>
            <Button
              type="primary"
              danger
              onClick={() => history.push('/forum')}
            >
              Khám Phá Diễn Đàn
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'activity',
      label: (
        <span>
          <CalendarOutlined /> Hoạt Động
        </span>
      ),
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
                <div
                  key={i}
                  className={styles.legendCell}
                  style={{ background: c }}
                />
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
      <div className={styles.coverPhoto}>
        <div className={styles.coverGradient} />
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <Avatar size={100} className={styles.avatar} src={user.avatar}>
              {user.name?.charAt(0) || 'U'}
            </Avatar>
            <div className={styles.levelEmoji}>{repLevel.emoji}</div>
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.profileName}>{user.name}</h1>
              <span className={styles.roleTag}>
                {user.role === 'teacher'
                  ? '👨‍🏫 Giảng viên'
                  : user.role === 'admin'
                  ? '⚙️ Quản trị viên'
                  : '👨‍🎓 Sinh viên'}
              </span>
            </div>

            <div className={styles.profileDetails}>
              <span>
                <MailOutlined /> {user.email}
              </span>
              {user.department && <span>🏛️ {user.department}</span>}
              {user.major && <span>📚 {user.major}</span>}
              <span>
                <CalendarOutlined /> Tham gia {formatJoinDate(user.createdAt)}
              </span>
            </div>

            <p className={styles.bio}>{user.bio || 'Chưa có tiểu sử'}</p>
          </div>

          <Button
            type="primary"
            danger
            icon={<EditOutlined />}
            className={styles.editBtn}
          >
            Chỉnh Sửa
          </Button>
        </div>

        <div className={styles.statsRow}>
          {[
            {
              icon: <TrophyOutlined />,
              label: 'Điểm Uy Tín',
              value: user.reputation,
              color: '#dc2626',
            },
            {
              icon: <BookOutlined />,
              label: 'Câu Hỏi',
              value: user.posts,
              color: '#3b82f6',
            },
            {
              icon: <MessageOutlined />,
              label: 'Câu Trả Lời',
              value: user.answers,
              color: '#10b981',
            },
            {
              icon: <LikeOutlined />,
              label: 'Tổng Vote',
              value: user.votes,
              color: '#f59e0b',
            },
            {
              icon: <FireOutlined />,
              label: 'Người Theo Dõi',
              value: user.followers,
              color: '#8b5cf6',
            },
          ].map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value.toLocaleString('vi')}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.repSection}>
          <div className={styles.repHeader}>
            <div className={styles.repLevel}>
              <span style={{ color: repLevel.color }}>
                {repLevel.emoji} {repLevel.name}
              </span>
              <span className={styles.repPoints}>{user.reputation} pts</span>
            </div>
            {nextLevel && (
              <span className={styles.nextLevel}>
                Cần <strong>{nextLevel.minPoints - user.reputation}</strong> pts
                để lên {nextLevel.emoji} {nextLevel.name}
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

        {badges.length > 0 && (
          <div className={styles.badgesSection}>
            <div className={styles.badgesTitle}>🏅 Huy Hiệu</div>
            <div className={styles.badgesList}>
              {badges.map((badge) => (
                <Tooltip key={badge.id} title={badge.description}>
                  <div
                    className={styles.badge}
                    style={{
                      borderColor: `${badge.color}40`,
                      background: `${badge.color}10`,
                    }}
                  >
                    <span className={styles.badgeEmoji}>{badge.emoji}</span>
                    <span
                      className={styles.badgeName}
                      style={{ color: badge.color }}
                    >
                      {badge.name}
                    </span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.tabsCard}>
        <Tabs items={tabItems} size="large" />
      </div>
    </div>
  );
}
