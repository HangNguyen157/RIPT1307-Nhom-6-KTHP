import React, { useState, useEffect } from 'react';
import { Button, Select, Input, Table, Tag, Space, Badge, Popconfirm, message, Spin } from 'antd';
import { SearchOutlined, DeleteOutlined, PushpinOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { history, request } from '@umijs/max';
import styles from './index.less';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { list: any[] } }>('/api/posts', {
        method: 'GET',
      });
      if (res && res.success) {
        setPosts(res.data.list);
      }
    } catch (error) {
      console.error('Lỗi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id: string) => {
    try {
      const res = await request<{ success: boolean; message?: string }>(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (res && res.success) {
        setPosts(posts.filter((p) => p.id !== id));
        message.success('Đã xóa bài viết thành công!');
      } else {
        message.error(res?.message || 'Xóa bài viết thất bại');
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi xóa bài viết');
    }
  };

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Tiêu Đề',
      key: 'title',
      render: (record: any) => (
        <div className={styles.postCell}>
          <div className={styles.postTitle}>{record.title}</div>
          <div className={styles.postMeta}>
            <span>{record.author}</span>
            <span>{record.subject}</span>
            <span>{record.createdAt}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Vote / Bình Luận',
      key: 'stats',
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <span>{record.votes} vote</span>
          <span>{record.comments} bình luận</span>
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
            text={record.status === 'active' ? 'Đang Hoạt Động' : record.status === 'reported' ? 'Bị Báo Cáo' : 'Ẩn'}
          />
          {record.isSolved && <Tag color="green">Đã Giải Quyết</Tag>}
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
      <h2 className={styles.sectionTitle}>Quản Lý Bài Viết</h2>

      <div className={styles.miniStats}>
        {[
          { label: 'Tổng Bài Viết', value: posts.length, color: '#3b82f6' },
          { label: 'Đang Hoạt Động', value: posts.filter((p) => p.status === 'active').length, color: '#10b981' },
          { label: 'Bị Báo Cáo', value: posts.filter((p) => p.status === 'reported').length, color: '#f59e0b' },
          { label: 'Đã Giải Quyết', value: posts.filter((p) => p.isSolved).length, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className={styles.miniStat}>
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
            { label: 'Đang Hoạt Động', value: 'active' },
            { label: 'Bị Báo Cáo', value: 'reported' },
          ]}
          style={{ width: 180 }}
        />
      </div>

      <Table
        loading={loading}
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
