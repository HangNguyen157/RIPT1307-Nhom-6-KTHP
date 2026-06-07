import {
  DeleteOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { history, request, useAccess } from '@umijs/max';
import {
  Alert,
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

/**
 * Khu vực kiểm duyệt — dành cho GIẢNG VIÊN (và admin).
 * Quyền canModerate định nghĩa tập trung tại src/access.ts;
 * server kiểm tra lại role qua JWT khi xóa bài (api/posts/[id]).
 */
export default function Moderation() {
  const access = useAccess();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [solvedFilter, setSolvedFilter] = useState('all');

  useEffect(() => {
    if (!access.canModerate) {
      message.warning('Khu vực kiểm duyệt chỉ dành cho giảng viên');
      history.replace('/home');
    }
  }, [access.canModerate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { list: any[] } }>(
        '/api/posts',
        { method: 'GET' },
      );
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
    if (access.canModerate) {
      fetchPosts();
    }
  }, []);

  if (!access.canModerate) {
    return null;
  }

  const deletePost = async (id: string) => {
    try {
      const res = await request<{ success: boolean; message?: string }>(
        `/api/posts/${id}`,
        { method: 'DELETE' },
      );
      if (res && res.success) {
        setPosts(posts.filter((p) => p.id !== id));
        message.success('Đã xóa bài viết vi phạm!');
      } else {
        message.error(res?.message || 'Xóa bài viết thất bại');
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi xóa bài viết');
    }
  };

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchSolved =
      solvedFilter === 'all' ||
      (solvedFilter === 'solved' ? p.isSolved : !p.isSolved);
    return matchSearch && matchSolved;
  });

  const columns = [
    {
      title: 'Bài Viết',
      key: 'title',
      render: (record: any) => (
        <div>
          <div className={styles.postTitle}>{record.title}</div>
          <Space size={8} className={styles.postMeta}>
            <span>{record.author}</span>
            <Tag color={record.authorRole === 'giangvien' ? 'purple' : 'blue'}>
              {record.authorRole === 'giangvien' ? 'GV' : 'SV'}
            </Tag>
            <span>{record.subject}</span>
            <span>{record.createdAt}</span>
          </Space>
        </div>
      ),
    },
    {
      title: 'Tương Tác',
      key: 'stats',
      width: 140,
      render: (record: any) => (
        <Space direction="vertical" size={2}>
          <span>{record.votes} vote</span>
          <span>{record.comments} trả lời</span>
        </Space>
      ),
    },
    {
      title: 'Trạng Thái',
      key: 'solved',
      width: 170,
      render: (record: any) =>
        record.isSolved ? (
          <Tag color="green">Đã có đáp án xác nhận</Tag>
        ) : (
          <Tag color="orange">Chưa có đáp án</Tag>
        ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 200,
      render: (record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/post/${record.id}`)}
          >
            Duyệt
          </Button>
          <Popconfirm
            title="Xóa bài viết này?"
            description="Bài viết vi phạm sẽ bị xóa vĩnh viễn."
            onConfirm={() => deletePost(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.moderationPage}>
      <h1 className={styles.title}>
        <SafetyCertificateOutlined /> Khu Vực Kiểm Duyệt
      </h1>

      <Alert
        type="info"
        showIcon
        className={styles.notice}
        message="Quyền kiểm duyệt của Giảng viên"
        description="Bạn có thể xóa bài viết vi phạm và xác nhận câu trả lời hay nhất (đáp án chuẩn) cho mọi bài viết. Bấm “Duyệt” để mở bài viết và thao tác chi tiết."
      />

      <div className={styles.statsRow}>
        {[
          { label: 'Tổng Bài Viết', value: posts.length, color: '#3b82f6' },
          {
            label: 'Đã Có Đáp Án',
            value: posts.filter((p) => p.isSolved).length,
            color: '#10b981',
          },
          {
            label: 'Chờ Xác Nhận Đáp Án',
            value: posts.filter((p) => !p.isSolved).length,
            color: '#f59e0b',
          },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>
              {s.value}
            </div>
            <div className={styles.statLabel}>{s.label}</div>
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
          value={solvedFilter}
          onChange={setSolvedFilter}
          options={[
            { label: 'Tất Cả', value: 'all' },
            { label: 'Đã có đáp án', value: 'solved' },
            { label: 'Chưa có đáp án', value: 'unsolved' },
          ]}
          style={{ width: 200 }}
        />
      </div>

      <Table
        loading={loading}
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
