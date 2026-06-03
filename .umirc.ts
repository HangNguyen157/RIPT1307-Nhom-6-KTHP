import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: '#dc2626',
        colorLink: '#dc2626',
        colorLinkHover: '#b91c1c',
        borderRadius: 8,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Trang Chủ',
      path: '/home',
      component: './Home',
    },
    {
      name: 'Diễn Đàn',
      path: '/forum',
      component: './Forum',
    },
    {
      name: 'Tìm Kiếm',
      path: '/search',
      component: './Search',
    },
    {
      name: 'Thẻ',
      path: '/tags',
      component: './Tags',
    },
    {
      name: 'Bảng Xếp Hạng',
      path: '/leaderboard',
      component: './Leaderboard',
    },
    {
      name: 'Chi Tiết Bài Viết',
      path: '/post/:id',
      component: './PostDetail',
    },
    {
      name: 'Tạo Bài Viết',
      path: '/post/new',
      component: './CreatePost',
    },
    {
      name: 'Hồ Sơ',
      path: '/profile/:id',
      component: './Profile',
    },
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/register',
      component: './Register',
    },
    {
      path: '/admin',
      component: './Admin',
    },
    {
      path: '/admin/dashboard',
      component: './Admin/Dashboard',
    },
    {
      path: '/admin/posts',
      component: './Admin/Posts',
    },
    {
      path: '/admin/users',
      component: './Admin/Users',
    },
    {
      path: '/admin/reports',
      component: './Admin/Reports',
    },
    {
      path: '/access',
      component: './Access',
    },
    {
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'npm',
  utoopack: {},
});
