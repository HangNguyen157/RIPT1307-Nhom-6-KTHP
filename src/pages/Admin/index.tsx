import { isAdmin } from '@/server/models/User';
import { authUtils } from '@/utils/auth';
import {
  BarChartOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Outlet, history, useLocation } from '@umijs/max';
import { Button, Layout, Menu, message } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

const { Sider, Content } = Layout;

export default function Admin() {
  const location = useLocation();

  // Kiểm tra quyền ngay khi render — user thường sẽ không thấy
  // bất kỳ nội dung admin nào (kể cả chớp màn hình)
  const user = authUtils.getCurrentUser();
  const allowed = !!user && isAdmin(user);

  useEffect(() => {
    if (!allowed) {
      message.warning('Bạn không có quyền truy cập khu vực quản trị');
      history.replace('/login');
    }
  }, [allowed]);

  if (!allowed) {
    return null;
  }

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
      icon: <TeamOutlined />,
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
        style={{ background: '#fff', borderRight: '1px solid #e5e7eb' }}
      >
        <div className={styles.logo}>
          <span>EduForum</span>
          <div
            style={{
              fontSize: 11,
              color: 'rgb(255, 255, 255)',
              marginTop: 2,
              marginLeft: 20,
            }}
          >
            Admin Panel
          </div>
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: '#ffffff', border: 'none' }}
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
            Về Trang Chủ
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
