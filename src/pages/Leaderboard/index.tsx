import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { history, request } from '@umijs/max';
import styles from './index.less';

const MEDAL_CONFIG = [
  { label: '#1', bg: 'linear-gradient(135deg, #ffd700, #f59e0b)', textColor: '#92400e' },
  { label: '#2', bg: 'linear-gradient(135deg, #c0c0c0, #94a3b8)', textColor: '#374151' },
  { label: '#3', bg: 'linear-gradient(135deg, #cd7f32, #d97706)', textColor: '#92400e' },
];

const PERIOD_OPTIONS = [
  { key: 'all', label: 'Mọi Thời Gian' },
  { key: 'month', label: 'Tháng Này' },
  { key: 'week', label: 'Tuần Này' },
];

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await request<{ success: boolean; data: { list: any[] } }>('/api/leaderboard');
        if (res && res.success) {
          setUsers(res.data.list);
        }
      } catch (error) {
        console.error('Lỗi tải bảng xếp hạng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filtered = users.filter((u) => roleFilter === 'all' || u.role === roleFilter);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải bảng xếp hạng..." />
      </div>
    );
  }


  return (
    <div className={styles.leaderboardPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng Xếp Hạng</h1>
          <p className={styles.pageSubtitle}>Top người đóng góp của cộng đồng EduForum</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.periodFilter}>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.filterBtn} ${period === opt.key ? styles.active : ''}`}
              onClick={() => setPeriod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={styles.roleFilter}>
          {[
            { key: 'all', label: 'Tất Cả' },
            { key: 'student', label: 'Sinh Viên' },
            { key: 'teacher', label: 'Giảng Viên' },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`${styles.filterBtn} ${roleFilter === opt.key ? styles.active : ''}`}
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
          <div className={styles.podiumCard} onClick={() => history.push(`/profile/${top3[1].id}`)}>
            <div className={styles.podiumMedal} style={{ background: MEDAL_CONFIG[1].bg }}>
              {MEDAL_CONFIG[1].label}
            </div>
            <div className={styles.podiumAvatar} style={{ border: '3px solid #c0c0c0' }}>
              {top3[1].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[1].name}</div>
            <div className={styles.podiumRole}>{top3[1].role === 'teacher' ? 'Giảng viên' : 'Sinh viên'} · {top3[1].dept}</div>
            <div className={styles.podiumRep} style={{ color: '#94a3b8' }}>{top3[1].rep.toLocaleString('vi')} pts</div>
            <div className={styles.podiumBase} style={{ background: '#c0c0c0', height: 80 }}>
              <span>#2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className={`${styles.podiumCard} ${styles.first}`} onClick={() => history.push(`/profile/${top3[0].id}`)}>
            <div className={styles.podiumMedal} style={{ background: MEDAL_CONFIG[0].bg }}>
              {MEDAL_CONFIG[0].label}
            </div>
            <div className={styles.podiumAvatar} style={{ border: '3px solid #ffd700', width: 80, height: 80, fontSize: 32 }}>
              {top3[0].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[0].name}</div>
            <div className={styles.podiumRole}>{top3[0].role === 'teacher' ? 'Giảng viên' : 'Sinh viên'} · {top3[0].dept}</div>
            <div className={styles.podiumRep} style={{ color: '#f59e0b' }}>{top3[0].rep.toLocaleString('vi')} pts</div>
            <div className={styles.podiumBase} style={{ background: '#ffd700', height: 120 }}>
              <span>#1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className={styles.podiumCard} onClick={() => history.push(`/profile/${top3[2].id}`)}>
            <div className={styles.podiumMedal} style={{ background: MEDAL_CONFIG[2].bg }}>
              {MEDAL_CONFIG[2].label}
            </div>
            <div className={styles.podiumAvatar} style={{ border: '3px solid #cd7f32' }}>
              {top3[2].name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top3[2].name}</div>
            <div className={styles.podiumRole}>{top3[2].role === 'teacher' ? 'Giảng viên' : 'Sinh viên'} · {top3[2].dept}</div>
            <div className={styles.podiumRep} style={{ color: '#d97706' }}>{top3[2].rep.toLocaleString('vi')} pts</div>
            <div className={styles.podiumBase} style={{ background: '#cd7f32', height: 60 }}>
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
                <span className={styles.medal}>{['#1', '#2', '#3'][index]}</span>
              ) : (
                <span className={styles.rankNumText}>#{index + 1}</span>
              )}
            </div>

            <div className={styles.rankAvatar} style={{ background: user.role === 'teacher' ? '#6366f1' : 'var(--color-primary)' }}>
              {user.name.charAt(0)}
            </div>

            <div className={styles.rankInfo}>
              <div className={styles.rankName}>{user.name}</div>
              <div className={styles.rankMeta}>
                <span>{user.role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}</span>
                <span>·</span>
                <span>{user.dept}</span>
                <span>·</span>
                <span>Tham gia {user.joined}</span>
              </div>
            </div>

            <div className={styles.rankStats}>
              <div className={styles.rankStat}>{user.posts} bài</div>
              <div className={styles.rankStat}>{user.answers} trả lời</div>
            </div>

            <div className={styles.rankRep}>
              <span className={styles.repValue}>{user.rep.toLocaleString('vi')}</span>
              <span className={styles.repLabel}>pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
