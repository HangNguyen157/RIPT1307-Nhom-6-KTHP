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

  // 1. Cấu hình ApiRoute cho Backend Serverless
  apiRoute: {
    platform: 'vercel',
  },

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
      name: 'Thông Báo',
      path: '/notifications',
      component: './Notifications',
    },
    {
      // Khu kiểm duyệt cho GIẢNG VIÊN (admin cũng vào được) —
      // page tự chặn bằng useAccess().canModerate (src/access.ts)
      name: 'Kiểm Duyệt',
      path: '/moderation',
      component: './Moderation',
      access: 'canModerate',
    },
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/register',
      component: './Register',
    },

    // 3. Cấu hình phân hệ Admin (Gộp lại thành cấu trúc lồng nhau)
    {
      path: '/admin',
      // Layout Admin — tự chặn user không phải admin bằng useAccess()
      // (quyền canSeeAdmin định nghĩa tập trung tại src/access.ts)
      component: './Admin',
      access: 'canSeeAdmin',
      routes: [
        {
          path: '/admin',
          redirect: '/admin/dashboard',
        },
        {
          name: 'Tổng quan',
          path: '/admin/dashboard',
          component: './Admin/Dashboard',
        },
        {
          name: 'Quản lý Bài viết',
          path: '/admin/posts',
          component: './Admin/Posts',
        },
        {
          name: 'Quản lý Thành viên',
          path: '/admin/users',
          component: './Admin/Users',
        },
        {
          name: 'Báo cáo Vi phạm',
          path: '/admin/reports',
          component: './Admin/Reports',
        },
      ],
    },
  ],
  npmClient: 'npm',
});
