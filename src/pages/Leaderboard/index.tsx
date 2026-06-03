import { history } from '@umijs/max';
import { useState } from 'react';
import styles from './index.less';

const ALL_USERS = [
  {
    id: '3',
    name: 'PGS.TS Lê Minh Đức',
    role: 'teacher',
    rep: 5430,
    posts: 85,
    answers: 210,
    badges: ['advisor', 'top-contributor'],
    dept: 'Khoa CNTT',
    joined: '2023',
  },
  {
    id: '2',
    name: 'Trần Thị Hương',
    role: 'student',
    rep: 1250,
    posts: 28,
    answers: 45,
    badges: ['expert', 'helpful'],
    dept: 'CNTT',
    joined: '2024',
  },
  {
    id: '4',
    name: 'Hoàng Văn Bình',
    role: 'student',
    rep: 980,
    posts: 35,
    answers: 78,
    badges: ['expert'],
    dept: 'KTPM',
    joined: '2024',
  },
  {
    id: '5',
    name: 'Nguyễn Minh Châu',
    role: 'teacher',
    rep: 870,
    posts: 42,
    answers: 120,
    badges: ['helpful'],
    dept: 'Khoa CNTT',
    joined: '2023',
  },
  {
    id: '6',
    name: 'Lê Thị Lan',
    role: 'student',
    rep: 654,
    posts: 18,
    answers: 34,
    badges: ['helpful'],
    dept: 'HTTT',
    joined: '2024',
  },
  {
    id: '7',
    name: 'Phạm Đức Thắng',
    role: 'student',
    rep: 521,
    posts: 15,
    answers: 29,
    badges: [],
    dept: 'KTPM',
    joined: '2024',
  },
  {
    id: '8',
    name: 'GV. Ngô Thị Mai',
    role: 'teacher',
    rep: 480,
    posts: 30,
    answers: 95,
    badges: ['helpful'],
    dept: 'Khoa CNTT',
    joined: '2023',
  },
  {
    id: '9',
    name: 'Đinh Hùng Cường',
    role: 'student',
    rep: 389,
    posts: 12,
    answers: 18,
    badges: [],
    dept: 'ATTT',
    joined: '2024',
  },
  {
    id: '10',
    name: 'Vũ Thị Thanh',
    role: 'student',
    rep: 312,
    posts: 9,
    answers: 15,
    badges: [],
    dept: 'CNTT',
    joined: '2025',
  },
];

const MEDAL_CONFIG = [
  {
    emoji: '🥇',
    label: '#1',
    bg: 'linear-gradient(135deg, #ffd700, #f59e0b)',
    textColor: '#92400e',
  },
  {
    emoji: '🥈',
    label: '#2',
    bg: 'linear-gradient(135deg, #c0c0c0, #94a3b8)',
    textColor: '#374151',
  },
  {
    emoji: '🥉',
    label: '#3',
    bg: 'linear-gradient(135deg, #cd7f32, #d97706)',
    textColor: '#92400e',
  },
];

const PERIOD_OPTIONS = [
  { key: 'all', label: 'Mọi Thời Gian' },
  { key: 'month', label: 'Tháng Này' },
  { key: 'week', label: 'Tuần Này' },
];

export default function Leaderboard() {
  const [period, setPeriod] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = ALL_USERS.filter(
    (u) => roleFilter === 'all' || u.role === roleFilter,
  );

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const getRepEmoji = (rep: number) => {
    if (rep >= 2000) return '🏆';
    if (rep >= 500) return '⭐';
    if (rep >= 100) return '🤝';
    return '🆕';
  };

  return (
    <div className={styles.leaderboardPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng xếp hạng</h1>
          <p className={styles.pageSubtitle}>
            Top người đóng góp của cộng đồng EduForum
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.periodFilter}>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.filterBtn} ${
                period === opt.key ? styles.active : ''
              }`}
              onClick={() => setPeriod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={styles.roleFilter}>
          {[
            { key: 'all', label: 'Tất Cả' },
            { key: 'student', label: '👨‍🎓 Sinh Viên' },
            { key: 'teacher', label: '👨‍🏫 Giảng Viên' },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`${styles.filterBtn} ${
                roleFilter === opt.key ? styles.active : ''
              }`}
              onClick={() => setRoleFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className={styles.podium}>
          {/* 2nd Place */}
          <div
            className={styles.podiumCard}
            onClick={() => history.push(`/profile/${top3[1].id}`)}
          >
            <div
              className={styles.podiumMedal}
              style={{ background: MEDAL_CONFIG[1].bg }}
            >
              {MEDAL_CONFIG[1].emoji}
            </div>
            <div
              className={styles.podiumAvatar}
              style={{ border: '3px solid #c0c0c0' }}
            >
              {top3[1].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[1].name}</div>
            <div className={styles.podiumRole}>
              {top3[1].role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {top3[1].dept}
            </div>
            <div className={styles.podiumRep} style={{ color: '#94a3b8' }}>
              ⭐ {top3[1].rep.toLocaleString('vi')} pts
            </div>
            <div
              className={styles.podiumBase}
              style={{ background: '#c0c0c0', height: 80 }}
            >
              <span>#2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div
            className={`${styles.podiumCard} ${styles.first}`}
            onClick={() => history.push(`/profile/${top3[0].id}`)}
          >
            <div className={styles.crownEmoji}>👑</div>
            <div
              className={styles.podiumMedal}
              style={{ background: MEDAL_CONFIG[0].bg }}
            >
              {MEDAL_CONFIG[0].emoji}
            </div>
            <div
              className={styles.podiumAvatar}
              style={{
                border: '3px solid #ffd700',
                width: 80,
                height: 80,
                fontSize: 32,
              }}
            >
              {top3[0].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[0].name}</div>
            <div className={styles.podiumRole}>
              {top3[0].role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {top3[0].dept}
            </div>
            <div className={styles.podiumRep} style={{ color: '#f59e0b' }}>
              🏆 {top3[0].rep.toLocaleString('vi')} pts
            </div>
            <div
              className={styles.podiumBase}
              style={{ background: '#ffd700', height: 120 }}
            >
              <span>#1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div
            className={styles.podiumCard}
            onClick={() => history.push(`/profile/${top3[2].id}`)}
          >
            <div
              className={styles.podiumMedal}
              style={{ background: MEDAL_CONFIG[2].bg }}
            >
              {MEDAL_CONFIG[2].emoji}
            </div>
            <div
              className={styles.podiumAvatar}
              style={{ border: '3px solid #cd7f32' }}
            >
              {top3[2].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[2].name}</div>
            <div className={styles.podiumRole}>
              {top3[2].role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {top3[2].dept}
            </div>
            <div className={styles.podiumRep} style={{ color: '#d97706' }}>
              ⭐ {top3[2].rep.toLocaleString('vi')} pts
            </div>
            <div
              className={styles.podiumBase}
              style={{ background: '#cd7f32', height: 60 }}
            >
              <span>#3</span>
            </div>
          </div>
        </div>
      )}

      {/* Ranking List */}
      <div className={styles.rankingList}>
        {filtered.map((user, index) => (
          <div
            key={user.id}
            className={`${styles.rankRow} ${index < 3 ? styles.topRank : ''}`}
            onClick={() => history.push(`/profile/${user.id}`)}
          >
            <div className={styles.rankNum}>
              {index < 3 ? (
                <span className={styles.medal}>
                  {['🥇', '🥈', '🥉'][index]}
                </span>
              ) : (
                <span className={styles.rankNumText}>#{index + 1}</span>
              )}
            </div>

            <div
              className={styles.rankAvatar}
              style={{
                background:
                  user.role === 'teacher' ? '#6366f1' : 'var(--color-primary)',
              }}
            >
              {user.name.charAt(0)}
            </div>

            <div className={styles.rankInfo}>
              <div className={styles.rankName}>{user.name}</div>
              <div className={styles.rankMeta}>
                <span>
                  {user.role === 'teacher' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Sinh viên'}
                </span>
                <span>·</span>
                <span>{user.dept}</span>
                <span>·</span>
                <span>Tham gia {user.joined}</span>
              </div>
            </div>

            <div className={styles.rankStats}>
              <div className={styles.rankStat}>
                <span>📝</span> {user.posts}
              </div>
              <div className={styles.rankStat}>
                <span>💬</span> {user.answers}
              </div>
            </div>

            <div className={styles.rankRep}>
              <span className={styles.repEmoji}>{getRepEmoji(user.rep)}</span>
              <span className={styles.repValue}>
                {user.rep.toLocaleString('vi')}
              </span>
              <span className={styles.repLabel}>pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
