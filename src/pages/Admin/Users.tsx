import React, { useState, useEffect } from 'react';
import { Button, Select, Input, Table, Tag, Avatar, Space, Badge, Modal, Form, Popconfirm, message } from 'antd';
import {
  FileTextOutlined, CommentOutlined,
  SearchOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, CheckOutlined, EyeOutlined,
  TrophyOutlined, FireOutlined,
} from '@ant-design/icons';
import { history, request } from '@umijs/max';
import styles from './index.less';

const ROLE_COLORS: Record<string, string> = {
  student: 'blue', teacher: 'purple', admin: 'red',
};

const ROLE_LABELS: Record<string, string> = {
  student: 'Sinh viên', teacher: 'Giảng viên', admin: 'Admin',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [addForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { list: any[] } }>('/api/admin/users', {
        method: 'GET',
      });
      if (res && res.success) {
        setUsers(res.data.list.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          rep: u.reputation,
          posts: u.posts,
          status: u.status ?? 'active',
          joinDate: u.joinDate,
        })));
      }
    } catch (error) {
      console.error('Lỗi tải danh sách người dùng:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      const res = await request<{ success: boolean; message?: string }>(`/api/admin/users/${id}`, {
        method: 'PUT',
        data: { status: nextStatus },
      });
      if (res && res.success) {
        setUsers(users.map((u) => u.id === id ? { ...u, status: nextStatus } : u));
        message.success(nextStatus === 'banned' ? 'Đã khóa tài khoản thành công!' : 'Đã mở khóa tài khoản thành công!');
      } else {
        message.error(res?.message || 'Thao tác thất bại');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi kết nối khi cập nhật tài khoản');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await request<{ success: boolean; message?: string }>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res && res.success) {
        setUsers(users.filter((u) => u.id !== id));
        message.success('Đã xóa tài khoản khỏi cơ sở dữ liệu!');
      } else {
        message.error(res?.message || 'Xóa tài khoản thất bại');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi kết nối API xóa tài khoản');
    }
  };

  const handleAddUser = async (values: any) => {
    try {
      const res = await request<{ success: boolean; message?: string; data: any }>('/api/admin/users', {
        method: 'POST',
        data: values,
      });
      if (res && res.success) {
        message.success('Thêm người dùng mới thành công!');
        setIsAddUserModalOpen(false);
        addForm.resetFields();
        fetchUsers();
      } else {
        message.error(res?.message || 'Không thể tạo người dùng');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi kết nối khi thêm người dùng');
    }
  };

  const handleResetPassword = async (values: any) => {
    if (!selectedUserId) return;
    try {
      const res = await request<{ success: boolean; message?: string }>(`/api/admin/users/${selectedUserId}`, {
        method: 'PUT',
        data: { newPassword: values.password },
      });
      if (res && res.success) {
        message.success('Cấp lại mật khẩu mới thành công!');
        setIsResetPasswordModalOpen(false);
        resetForm.resetFields();
      } else {
        message.error(res?.message || 'Không thể cấp lại mật khẩu');
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi kết nối khi cấp lại mật khẩu');
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const columns = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (record: any) => (
        <div className={styles.userCell}>
          <Avatar size={36} style={{ background: record.role === 'teacher' ? '#6366f1' : 'var(--color-primary)' }}>
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
      render: (role: string) => <Tag color={ROLE_COLORS[role]}>{ROLE_LABELS[role]}</Tag>,
    },
    {
      title: 'Uy Tín',
      dataIndex: 'rep',
      key: 'rep',
      sorter: (a: any, b: any) => b.rep - a.rep,
      render: (rep: number) => <span className={styles.repScore}>{rep.toLocaleString('vi')} pts</span>,
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
          <Button size="small" icon={<EyeOutlined />}
            onClick={() => history.push(`/profile/${record.id}`)}>
            Xem
          </Button>
          <Button
            size="small"
            danger={record.status === 'active'}
            type={record.status === 'active' ? 'default' : 'primary'}
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => toggleBan(record.id, record.status)}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở'}
          </Button>
          <Button
            size="small"
            icon={<LockOutlined />}
            onClick={() => {
              setSelectedUserId(record.id);
              setIsResetPasswordModalOpen(true);
            }}
          >
            Reset PW
          </Button>
          <Popconfirm
            title="Xóa tài khoản người dùng?"
            description="Lưu ý: Thao tác này sẽ xóa vĩnh viễn user."
            onConfirm={() => deleteUser(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = [
    { label: 'Tổng Người Dùng', value: users.length, color: '#3b82f6' },
    { label: 'Sinh Viên', value: users.filter((u) => u.role === 'student').length, color: '#10b981' },
    { label: 'Giảng Viên', value: users.filter((u) => u.role === 'teacher').length, color: '#8b5cf6' },
    { label: 'Đã Khóa', value: users.filter((u) => u.status === 'banned').length, color: '#ef4444' },
  ];

  return (
    <div className={styles.adminSection}>
      <h2 className={styles.sectionTitle}>Quản Lý Người Dùng</h2>

      {/* Stats */}
      <div className={styles.miniStats}>
        {stats.map((s, i) => (
          <div key={i} className={styles.miniStat}>
            <div>
              <div className={styles.miniStatValue} style={{ color: s.color }}>{s.value}</div>
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
            { label: 'Sinh Viên', value: 'student' },
            { label: 'Giảng Viên', value: 'teacher' },
          ]}
          style={{ width: 160 }}
        />
        <Button type="primary" danger onClick={() => setIsAddUserModalOpen(true)}>
          + Thêm Người Dùng
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        className={styles.adminTable}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        rowClassName={(record) => record.status === 'banned' ? styles.bannedRow : ''}
      />

      {/* Add User Modal */}
      <Modal
        title="Thêm Người Dùng Mới"
        open={isAddUserModalOpen}
        onCancel={() => {
          setIsAddUserModalOpen(false);
          addForm.resetFields();
        }}
        footer={null}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddUser}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input placeholder="example@student.ptit.edu.vn" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Mật khẩu từ 6 ký tự' }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" initialValue="student" rules={[{ required: true }]}>
            <Select options={[{ label: 'Sinh viên', value: 'student' }, { label: 'Giảng viên', value: 'teacher' }, { label: 'Quản trị viên', value: 'admin' }]} />
          </Form.Item>
          <Form.Item name="department" label="Khoa/Chuyên ngành" initialValue="CNTT">
            <Input placeholder="Công Nghệ Thông Tin" />
          </Form.Item>
          <Form.Item name="studentId" label="Mã Sinh viên/Giảng viên">
            <Input placeholder="B21DCCN000" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsAddUserModalOpen(false)}>Hủy</Button>
              <Button type="primary" danger htmlType="submit">Xác nhận</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Cấp Lại Mật Khẩu"
        open={isResetPasswordModalOpen}
        onCancel={() => {
          setIsResetPasswordModalOpen(false);
          resetForm.resetFields();
        }}
        footer={null}
      >
        <Form form={resetForm} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsResetPasswordModalOpen(false)}>Hủy</Button>
              <Button type="primary" danger htmlType="submit">Cập nhật</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
