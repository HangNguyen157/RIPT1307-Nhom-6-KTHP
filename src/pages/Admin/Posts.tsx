import React, { useState } from 'react';
import { Button, Select, Input, Table, Tag, Space, Badge, Popconfirm, message } from 'antd';
import { SearchOutlined, DeleteOutlined, PushpinOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import styles from './index.less';

const POSTS = [
  { id: '1', title: 'Giải thích OOP trong Java: Class, Object, Inheritance', author: 'Nguyễn Văn A', subject: 'Lập Trình Cơ Bản', votes: 45, comments: 12, status: 'active', isSolved: true, createdAt: '09/05/2026' },
  { id: '2', title: 'React Hooks: useState, useEffect, useContext', author: 'Trần Thị B', subject: 'Web Development', votes: 67, comments: 23, status: 'active', isSolved: false, createdAt: '08/05/2026' },
  { id: '3', title: 'SQL: JOIN, Subquery, và Optimization', author: 'Phạm Minh D', subject: 'Cơ Sở Dữ Liệu', votes: 56, comments: 15, status: 'active', isSolved: false, createdAt: '07/05/2026' },
  { id: '4', title: 'Cấu trúc dữ liệu: Stack và Queue', author: 'Lê Văn C', subject: 'CTDL', votes: 34, comments: 8, status: 'reported', isSolved: true, createdAt: '06/05/2026' },
  { id: '5', title: 'Git & GitHub: Quản lý phiên bản hiệu quả', author: 'Hoàng Anh E', subject: 'DevOps', votes: 78, comments: 31, status: 'active', isSolved: true, createdAt: '05/05/2026' },
];

export default function AdminPosts() {
  const [posts, setPosts] = useState(POSTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    message.success('Đã xóa bài viết');
  };

  const columns = [
    {
      title: 'Tiêu Đề',
      key: 'title',
      render: (record: any) => (
        <div className={styles.postCell}>
          <div className={styles.postTitle}>{record.title}</div>
          <div className={styles.postMeta}>
            <span>👤 {record.author}</span>
            <span>📚 {record.subject}</span>
            <span>📅 {record.createdAt}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Vote / Bình Luận',
      key: 'stats',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <span>👍 {record.votes} vote</span>
          <span>💬 {record.comments} bình luận</span>
        </Space>
      ),
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      render: (record: any) => (
        <Space direction="vertical" size={4}>
          <Badge
            status={record.status === 'active' ? 'success' : record.status === 'reported' ? 'warning' : 'default'}
            text={record.status === 'active' ? 'Đang Hoạt Động' : record.status === 'reported' ? '⚠️ Bị Báo Cáo' : 'Ẩn'}
          />
          {record.isSolved && <Tag color="green">✅ Đã Giải Quyết</Tag>}
        </Space>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => history.push(`/post/${record.id}`)}>
            Xem
          </Button>
          <Popconfirm
            title="Xóa bài viết này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => deletePost(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.adminSection}>
      <h2 className={styles.sectionTitle}>📝 Quản Lý Bài Viết</h2>

      <div className={styles.miniStats}>
        {[
          { label: 'Tổng Bài Viết', value: posts.length, icon: '📝', color: '#3b82f6' },
          { label: 'Đang Hoạt Động', value: posts.filter((p) => p.status === 'active').length, icon: '✅', color: '#10b981' },
          { label: 'Bị Báo Cáo', value: posts.filter((p) => p.status === 'reported').length, icon: '⚠️', color: '#f59e0b' },
          { label: 'Đã Giải Quyết', value: posts.filter((p) => p.isSolved).length, icon: '🏆', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className={styles.miniStat}>
            <span className={styles.miniStatIcon}>{s.icon}</span>
            <div>
              <div className={styles.miniStatValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.miniStatLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filterRow}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: 'Tất Cả', value: 'all' },
            { label: '✅ Đang Hoạt Động', value: 'active' },
            { label: '⚠️ Bị Báo Cáo', value: 'reported' },
          ]}
          style={{ width: 180 }}
        />
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        className={styles.adminTable}
        pagination={{ pageSize: 10 }}
        rowClassName={(record) => record.status === 'reported' ? styles.reportedRow : ''}
      />
    </div>
  );
}
