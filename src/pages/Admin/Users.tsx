<<<<<<< HEAD
=======
import { MOCK_ADMIN_USERS } from '@/server/seed/users';
>>>>>>> Phanh
import {
  EyeOutlined,
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import { useState } from 'react';
import styles from './index.less';

<<<<<<< HEAD
const USERS = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'a@student.ptit.edu.vn',
    role: 'student',
    rep: 450,
    posts: 12,
    status: 'active',
    joinDate: '15/09/2024',
  },
  {
    id: '2',
    name: 'Trần Thị Hương',
    email: 'huong@student.ptit.edu.vn',
    role: 'student',
    rep: 1250,
    posts: 28,
    status: 'active',
    joinDate: '01/09/2024',
  },
  {
    id: '3',
    name: 'PGS.TS Lê Minh Đức',
    email: 'duc@ptit.edu.vn',
    role: 'teacher',
    rep: 5430,
    posts: 85,
    status: 'active',
    joinDate: '15/06/2023',
  },
  {
    id: '4',
    name: 'Hoàng Văn Bình',
    email: 'binh@student.ptit.edu.vn',
    role: 'student',
    rep: 980,
    posts: 35,
    status: 'banned',
    joinDate: '20/09/2024',
  },
  {
    id: '5',
    name: 'Nguyễn Minh Châu',
    email: 'chau@ptit.edu.vn',
    role: 'teacher',
    rep: 870,
    posts: 42,
    status: 'active',
    joinDate: '01/08/2023',
  },
  {
    id: '6',
    name: 'Phạm Thị Lan',
    email: 'lan@student.ptit.edu.vn',
    role: 'student',
    rep: 320,
    posts: 8,
    status: 'active',
    joinDate: '05/10/2024',
  },
];
=======
const USERS = MOCK_ADMIN_USERS.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  rep: u.reputation,
  posts: u.posts,
  status: u.status ?? 'active',
  joinDate: u.joinDate,
}));
>>>>>>> Phanh

const ROLE_COLORS: Record<string, string> = {
  student: 'blue',
  teacher: 'purple',
  admin: 'red',
};

const ROLE_LABELS: Record<string, string> = {
  student: '👨‍🎓 Sinh viên',
  teacher: '👨‍🏫 Giảng viên',
  admin: '⚙️ Admin',
};

export default function AdminUsers() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleBan = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'banned' : 'active' }
          : u,
      ),
    );
    const user = users.find((u) => u.id === id);
    message.success(
      user?.status === 'active'
        ? `Đã khóa tài khoản ${user.name}`
        : `Đã mở khóa tài khoản`,
    );
  };

  const columns = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (record: any) => (
        <div className={styles.userCell}>
          <Avatar
            size={36}
            style={{
              background:
                record.role === 'teacher' ? '#6366f1' : 'var(--color-primary)',
            }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div className={styles.userName}>{record.name}</div>
            <div className={styles.userEmail}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={ROLE_COLORS[role]}>{ROLE_LABELS[role]}</Tag>
      ),
    },
    {
      title: 'Uy Tín',
      dataIndex: 'rep',
      key: 'rep',
      sorter: (a: any, b: any) => b.rep - a.rep,
      render: (rep: number) => (
        <span className={styles.repScore}>⭐ {rep.toLocaleString('vi')}</span>
      ),
    },
    {
      title: 'Bài Viết',
      dataIndex: 'posts',
      key: 'posts',
      sorter: (a: any, b: any) => b.posts - a.posts,
    },
    {
      title: 'Ngày Tham Gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'error'}
          text={status === 'active' ? 'Hoạt Động' : 'Đã Khóa'}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/profile/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            size="small"
            danger={record.status === 'active'}
            type={record.status === 'active' ? 'default' : 'primary'}
            icon={
              record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />
            }
            onClick={() => toggleBan(record.id)}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở'}
          </Button>
        </Space>
      ),
    },
  ];

  const stats = [
    {
      label: 'Tổng Người Dùng',
      value: users.length,
      icon: '👥',
      color: '#3b82f6',
    },
    {
      label: 'Sinh Viên',
      value: users.filter((u) => u.role === 'student').length,
      icon: '👨‍🎓',
      color: '#10b981',
    },
    {
      label: 'Giảng Viên',
      value: users.filter((u) => u.role === 'teacher').length,
      icon: '👨‍🏫',
      color: '#8b5cf6',
    },
    {
      label: 'Đã Khóa',
      value: users.filter((u) => u.status === 'banned').length,
      icon: '🔒',
      color: '#ef4444',
    },
  ];

  return (
    <div className={styles.adminSection}>
      <h2 className={styles.sectionTitle}>👥 Quản Lý Người Dùng</h2>

      {/* Stats */}
      <div className={styles.miniStats}>
        {stats.map((s, i) => (
          <div key={i} className={styles.miniStat}>
            <span className={styles.miniStatIcon}>{s.icon}</span>
            <div>
              <div className={styles.miniStatValue} style={{ color: s.color }}>
                {s.value}
              </div>
              <div className={styles.miniStatLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { label: 'Tất Cả', value: 'all' },
            { label: '👨‍🎓 Sinh Viên', value: 'student' },
            { label: '👨‍🏫 Giảng Viên', value: 'teacher' },
          ]}
          style={{ width: 160 }}
        />
        <Button type="primary" danger>
          + Thêm Người Dùng
        </Button>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        className={styles.adminTable}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        rowClassName={(record) =>
          record.status === 'banned' ? styles.bannedRow : ''
        }
      />
    </div>
  );
}
