import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Badge } from 'antd';
import {
  TeamOutlined, FileTextOutlined, CommentOutlined,
  ArrowUpOutlined, FireOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { request } from '@umijs/max';
import styles from './index.less';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const activityData = [15, 22, 18, 28, 25, 32, 19];
const maxActivity = Math.max(...activityData);

const topTags = [
  { name: 'Java', count: 87, color: '#f97316' },
  { name: 'JavaScript', count: 76, color: '#eab308' },
  { name: 'React', count: 65, color: '#06b6d4' },
  { name: 'Python', count: 54, color: '#3b82f6' },
  { name: 'SQL', count: 43, color: '#8b5cf6' },
];

const recentActivity = [
  { user: 'Nguyễn Văn A', action: 'đăng bài "Giải thích OOP trong Java"', time: '10 phút trước' },
  { user: 'Trần Thị B', action: 'bình luận trên bài "React Hooks"', time: '25 phút trước' },
  { user: 'Lê Văn C', action: 'đăng ký tài khoản mới', time: '1 giờ trước' },
  { user: 'Phạm Minh D', action: 'vote bài "SQL Optimization"', time: '2 giờ trước' },
  { user: 'PGS.TS Lê Minh Đức', action: 'chọn câu trả lời hay nhất', time: '3 giờ trước' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await request<{ success: boolean; data: any }>('/api/admin/dashboard', {
          method: 'GET',
        });
        if (res && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Lỗi tải thống kê admin:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const keyStats = [
    { title: 'Tổng Người Dùng', value: stats?.totalUsers ?? 0, icon: <TeamOutlined />, color: '#3b82f6', trend: '+12%', up: true },
    { title: 'Tổng Bài Viết', value: stats?.totalPosts ?? 0, icon: <FileTextOutlined />, color: '#dc2626', trend: '+8%', up: true },
    { title: 'Hoạt động (Active)', value: stats?.activeUsers ?? 0, icon: <FireOutlined />, color: '#10b981', trend: 'Tài khoản hoạt động', up: true },
    { title: 'Tổng Bình Luận', value: stats?.totalComments ?? 0, icon: <CommentOutlined />, color: '#f59e0b', trend: '+23%', up: true },
  ];


  return (
    <div className={styles.adminDashboard}>
      <div className={styles.dashboardHeader}>
        <h1>Bảng Điều Khiển</h1>
        <p>Chào mừng trở lại! Đây là tổng quan hệ thống hôm nay.</p>
      </div>

      {/* Key Stats */}
      <div className={styles.statsGrid}>
        {keyStats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${stat.color}18`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value.toLocaleString('vi')}
              </div>
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={`${styles.statTrend} ${stat.up ? styles.trendUp : styles.trendDown}`}>
                <ArrowUpOutlined /> {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        {/* Activity Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Bài Viết Theo Ngày</div>
          <div className={styles.barChart}>
            {activityData.map((val, i) => (
              <div key={i} className={styles.barItem}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(val / maxActivity) * 100}%` }}
                  >
                    <span className={styles.barValue}>{val}</span>
                  </div>
                </div>
                <span className={styles.barLabel}>{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Tags Phổ Biến Nhất</div>
          <div className={styles.topTagsList}>
            {topTags.map((tag, i) => (
              <div key={i} className={styles.topTagItem}>
                <div className={styles.topTagRank} style={{ color: tag.color }}>#{i + 1}</div>
                <span className={styles.topTagDot} style={{ background: tag.color }} />
                <span className={styles.topTagName}>{tag.name}</span>
                <div className={styles.topTagBar}>
                  <div
                    className={styles.topTagFill}
                    style={{
                      width: `${(tag.count / topTags[0].count) * 100}%`,
                      background: tag.color,
                    }}
                  />
                </div>
                <span className={styles.topTagCount}>{tag.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className={styles.activityCard}>
        <div className={styles.chartTitle}>Hoạt Động Gần Đây</div>
        <div className={styles.activityList}>
          {recentActivity.map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityContent}>
                <span className={styles.activityUser}>{item.user}</span>
                <span className={styles.activityAction}> {item.action}</span>
              </div>
              <span className={styles.activityTime}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <div className={styles.chartTitle}>Thao Tác Nhanh</div>
        <div className={styles.quickActionsGrid}>
          {[
            { label: 'Xem Báo Cáo', color: '#f59e0b', path: '/admin/reports' },
            { label: 'Quản Lý User', color: '#3b82f6', path: '/admin/users' },
            { label: 'Quản Lý Bài', color: '#10b981', path: '/admin/posts' },
            { label: 'Xem Diễn Đàn', color: '#8b5cf6', path: '/forum' },
          ].map((action, i) => (
            <button
              key={i}
              className={styles.quickAction}
              style={{ borderColor: action.color }}
              onClick={() => (window.location.href = action.path)}
            >
              <span className={styles.quickActionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
