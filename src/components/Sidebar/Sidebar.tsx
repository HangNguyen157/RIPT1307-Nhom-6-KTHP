import React, { useState } from 'react';
import { Button, Collapse, Tooltip } from 'antd';
import {
  FireOutlined, BookOutlined, TeamOutlined, TagsOutlined,
  CloseOutlined, FilterOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import styles from './index.less';

const popularTags = [
  { name: 'Java', count: 245, color: '#f97316' },
  { name: 'JavaScript', count: 198, color: '#eab308' },
  { name: 'React', count: 176, color: '#06b6d4' },
  { name: 'Python', count: 154, color: '#3b82f6' },
  { name: 'TypeScript', count: 142, color: '#2563eb' },
  { name: 'Node.js', count: 128, color: '#10b981' },
  { name: 'SQL', count: 112, color: '#8b5cf6' },
  { name: 'AI/ML', count: 98, color: '#ec4899' },
];

const subjects = [
  { name: 'Lập Trình Cơ Bản', count: 89 },
  { name: 'Cấu Trúc Dữ Liệu', count: 76 },
  { name: 'Mạng Máy Tính', count: 65 },
  { name: 'Cơ Sở Dữ Liệu', count: 54 },
  { name: 'Hệ Điều Hành', count: 43 },
  { name: 'Web Development', count: 38 },
];

const departments = ['CNTT', 'HTTT', 'Kỹ Thuật Phần Mềm', 'An Toàn Thông Tin'];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [followedTags, setFollowedTags] = useState<string[]>(['React', 'JavaScript']);

  const toggleFollow = (tag: string) => {
    setFollowedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const collapseItems = [
    {
      key: '1',
      label: (
        <span className={styles.collapseLabel}>
          <FireOutlined style={{ color: '#dc2626' }} /> Thẻ Phổ Biến
        </span>
      ),
      children: (
        <div className={styles.tagList}>
          {popularTags.map((tag) => (
            <Tooltip
              key={tag.name}
              title={followedTags.includes(tag.name) ? 'Bỏ theo dõi' : 'Theo dõi'}
              placement="right"
            >
              <div
                className={`${styles.tagItem} ${followedTags.includes(tag.name) ? styles.followed : ''}`}
                onClick={() => toggleFollow(tag.name)}
              >
                <span
                  className={styles.tagDot}
                  style={{ background: tag.color }}
                />
                <span className={styles.tagName} style={{ color: tag.color }}>
                  {tag.name}
                </span>
                <span className={styles.tagCount}>{tag.count}</span>
                {followedTags.includes(tag.name) && (
                  <span className={styles.followedCheck}>✓</span>
                )}
              </div>
            </Tooltip>
          ))}
          <button className={styles.viewAllBtn} onClick={() => history.push('/tags')}>
            Xem Tất Cả Thẻ →
          </button>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className={styles.collapseLabel}>
          <BookOutlined style={{ color: '#dc2626' }} /> Môn Học
        </span>
      ),
      children: (
        <div className={styles.subjectList}>
          {subjects.map((subject) => (
            <div key={subject.name} className={styles.subjectItem}
              onClick={() => history.push(`/forum?subject=${subject.name}`)}>
              <span>{subject.name}</span>
              <span className={styles.count}>{subject.count}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className={styles.collapseLabel}>
          <TeamOutlined style={{ color: '#dc2626' }} /> Chuyên Ngành
        </span>
      ),
      children: (
        <div className={styles.departmentList}>
          {departments.map((dept) => (
            <button key={dept} className={styles.deptBtn}
              onClick={() => history.push(`/forum?dept=${dept}`)}>
              {dept}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const filterOptions = [
    { key: 'newest', label: '⏰ Mới Nhất' },
    { key: 'votes', label: '👍 Nhiều Vote' },
    { key: 'hot', label: '🔥 Đang Hot' },
    { key: 'unanswered', label: '❓ Chưa Trả Lời' },
    { key: 'solved', label: '✅ Đã Giải Quyết' },
  ];

  return (
    <aside className={styles.sidebar}>
      {onClose && (
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>📚 EduForum</span>
          <button className={styles.closeBtn} onClick={onClose}><CloseOutlined /></button>
        </div>
      )}

      {/* Quick nav for mobile drawer */}
      {onClose && (
        <div className={styles.quickNav}>
          {[
            { label: '🏠 Trang Chủ', path: '/home' },
            { label: '💬 Diễn Đàn', path: '/forum' },
            { label: '🏷️ Thẻ', path: '/tags' },
            { label: '🏆 Xếp Hạng', path: '/leaderboard' },
          ].map((item) => (
            <button key={item.path} className={styles.quickNavBtn}
              onClick={() => { history.push(item.path); onClose(); }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Collapse sections */}
      <div className={styles.collapseWrapper}>
        <Collapse
          items={collapseItems}
          defaultActiveKey={['1', '2']}
          className={styles.collapse}
          expandIconPosition="end"
        />
      </div>

      {/* Filter */}
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>
          <FilterOutlined style={{ color: '#dc2626' }} /> Bộ Lọc
        </div>
        <div className={styles.filterList}>
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.filterBtn} ${activeFilter === opt.key ? styles.active : ''}`}
              onClick={() => setActiveFilter(activeFilter === opt.key ? null : opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
