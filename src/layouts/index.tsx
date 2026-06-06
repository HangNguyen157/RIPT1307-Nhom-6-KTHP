<<<<<<< HEAD
import { MenuOutlined } from '@ant-design/icons';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button, Drawer, Layout } from 'antd';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import '@/styles/variables.less';
import styles from './index.less';

const { Content } = Layout;

// Pages không hiện sidebar
const FULL_WIDTH_PAGES = ['/login', '/register'];

export default function MainLayout() {
  const location = useLocation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('forum_theme') as 'light' | 'dark') || 'light';
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('forum_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Chỉ check exact path
  const isFullWidth = FULL_WIDTH_PAGES.includes(location.pathname);

  return (
    <div
      className={`${styles.appWrapper} ${
        theme === 'dark' ? styles.darkMode : ''
      }`}
      data-theme={theme}
    >
      {/* HEADER */}
      <Header onToggleTheme={toggleTheme} theme={theme} />

      <Layout className={styles.mainLayout}>
        {/* SIDEBAR */}
        {!isFullWidth && (
          <>
            {/* Desktop Sidebar */}
            <aside className={styles.desktopSidebar}>
              <Sidebar />
            </aside>

            {/* Mobile Button */}
            <Button
              className={styles.mobileSidebarToggle}
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              type="primary"
              danger
            />

            {/* Mobile Drawer */}
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

        {/* PAGE CONTENT */}
        <Content
          className={`${styles.content} ${isFullWidth ? styles.fullWidth : ''}`}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* MOBILE NAV */}
      <nav className={styles.mobileBottomNav}>
        <button
          className={styles.navItem}
          onClick={() => history.push('/home')}
        >
          <span>🏠</span>
          <span>Trang Chủ</span>
        </button>

        <button
          className={styles.navItem}
          onClick={() => history.push('/forum')}
        >
          <span>💬</span>
          <span>Diễn Đàn</span>
        </button>

        <button
          className={`${styles.navItem} ${styles.navItemCenter}`}
          onClick={() => history.push('/post/new')}
        >
          <span>✏️</span>
          <span>Đăng</span>
        </button>

        <button
          className={styles.navItem}
          onClick={() => history.push('/tags')}
        >
          <span>🏷️</span>
          <span>Thẻ</span>
        </button>

        <button
          className={styles.navItem}
          onClick={() => history.push('/leaderboard')}
        >
          <span>🏆</span>
          <span>Xếp Hạng</span>
        </button>
      </nav>
    </div>
  );
}
=======
/** Layout toàn cục — re-export từ pages/_layout.tsx */
export { default } from '../pages/_layout';
>>>>>>> Phanh
