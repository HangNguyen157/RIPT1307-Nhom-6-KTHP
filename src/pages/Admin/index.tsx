<<<<<<< HEAD
=======
import { isAdmin } from '@/server/models/User';
>>>>>>> Phanh
import { authUtils } from '@/utils/auth';
import {
  BarChartOutlined,
  FileTextOutlined,
  LogoutOutlined,
<<<<<<< HEAD
  UsersOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Outlet, history, useLocation } from '@umijs/max';
import { Button, Layout, Menu } from 'antd';
=======
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Outlet, history, useLocation } from '@umijs/max';
import { Button, Layout, Menu, message } from 'antd';
import { useEffect } from 'react';
>>>>>>> Phanh
import styles from './index.less';

const { Sider, Content } = Layout;

export default function Admin() {
  const location = useLocation();

  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (!user || !isAdmin(user)) {
      message.warning('Bạn không có quyền truy cập khu vực quản trị');
      history.replace('/login');
    }
  }, []);

  const handleLogout = () => {
    authUtils.logout();
    history.push('/home');
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
      onClick: () => history.push('/admin/dashboard'),
    },
    {
      key: '/admin/posts',
      icon: <FileTextOutlined />,
      label: 'Quản Lý Bài Viết',
      onClick: () => history.push('/admin/posts'),
    },
    {
      key: '/admin/users',
<<<<<<< HEAD
      icon: <UsersOutlined />,
=======
      icon: <UserOutlined />,
>>>>>>> Phanh
      label: 'Quản Lý Người Dùng',
      onClick: () => history.push('/admin/users'),
    },
    {
      key: '/admin/reports',
      icon: <WarningOutlined />,
      label: 'Báo Cáo Vi Phạm',
      onClick: () => history.push('/admin/reports'),
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        width={250}
        style={{
          background: '#0f0606',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className={styles.logo}>
          <span>📚 EduForum</span>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 2,
            }}
          >
            Admin Panel
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: '#0f0606', border: 'none' }}
          items={menuItems}
        />

        <div
          style={{
            padding: 16,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Button
            type="primary"
            danger
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Thoát Admin
          </Button>
          <Button
            block
            style={{ marginTop: 8 }}
            onClick={() => history.push('/home')}
          >
            🏠 Về Trang Chủ
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
