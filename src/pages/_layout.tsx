import {
  CommentOutlined,
  EditOutlined,
  HomeOutlined,
  MenuOutlined,
  TagsOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button, Drawer, Layout } from 'antd';
import { useState } from 'react';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import styles from '@/layouts/index.less';
import '@/styles/variables.less';

const { Content } = Layout;

const FULL_WIDTH_PAGES = ['/login', '/register'];

export default function AppLayout() {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isFullWidth = FULL_WIDTH_PAGES.includes(location.pathname);

  // Phân hệ /admin có layout quản trị riêng (src/pages/Admin/index.tsx) —
  // không bọc Header/Sidebar của user để tách bạch giao diện theo vai trò
  if (location.pathname.startsWith('/admin')) {
    return <Outlet />;
  }

  return (
    <div className={styles.appWrapper}>
      <Header />

      <Layout className={styles.mainLayout}>
        {!isFullWidth && (
          <>
            <aside className={styles.desktopSidebar}>
              <Sidebar />
            </aside>

            <Button
              className={styles.mobileSidebarToggle}
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              type="primary"
              danger
            />

            <Drawer
              placement="left"
              open={mobileDrawerOpen}
              onClose={() => setMobileDrawerOpen(false)}
              width={280}
              className={styles.mobileDrawer}
              styles={{ body: { padding: 0 } }}
            >
              <Sidebar onClose={() => setMobileDrawerOpen(false)} />
            </Drawer>
          </>
        )}

        <Content
          className={`${styles.content} ${isFullWidth ? styles.fullWidth : ''}`}
        >
          <Outlet />
        </Content>
      </Layout>

      <nav className={styles.mobileBottomNav}>
        <button
          type="button"
          className={styles.navItem}
          onClick={() => history.push('/home')}
        >
          <HomeOutlined />
          <span>Trang Chủ</span>
        </button>

        <button
          type="button"
          className={styles.navItem}
          onClick={() => history.push('/forum')}
        >
          <CommentOutlined />
          <span>Diễn Đàn</span>
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${styles.navItemCenter}`}
          onClick={() => history.push('/post/new')}
        >
          <EditOutlined />
          <span>Đăng</span>
        </button>

        <button
          type="button"
          className={styles.navItem}
          onClick={() => history.push('/tags')}
        >
          <TagsOutlined />
          <span>Thẻ</span>
        </button>

        <button
          type="button"
          className={styles.navItem}
          onClick={() => history.push('/leaderboard')}
        >
          <TrophyOutlined />
          <span>Xếp Hạng</span>
        </button>
      </nav>
    </div>
  );
}
