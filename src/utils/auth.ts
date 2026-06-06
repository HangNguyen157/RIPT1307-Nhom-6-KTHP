/**
 * Client auth — lưu JWT token và user profile trong localStorage.
 * Gọi API Routes tại /api/auth/* (logic nằm ở src/server + src/api).
 */
import { getDemoCredentials as getDemoAccounts } from '@/constants/demoAccounts';
import type { User } from '@/server/models/User';
import { request } from '@umijs/max';

export type { User };

const STORAGE_KEY = 'forum_current_user';
const AUTH_KEY = 'forum_auth_token';

interface AuthApiResponse {
  success: boolean;
  data?: { user: User; token: string };
  message?: string;
}

function persistSession(user: User, token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_KEY, token);
}

export const authUtils = {
  async login(email: string, password: string): Promise<User> {
    const res = await request<AuthApiResponse>('/api/auth/login', {
      method: 'POST',
      data: { email, password },
      skipErrorHandler: true,
    });

    if (!res?.success || !res.data) {
      throw new Error(res?.message || 'Đăng nhập thất bại');
    }

    persistSession(res.data.user, res.data.token);
    return res.data.user;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    department?: string;
    studentId?: string;
  }): Promise<User> {
    const res = await request<AuthApiResponse>('/api/auth/register', {
      method: 'POST',
      data,
      skipErrorHandler: true,
    });

    if (!res?.success || !res.data) {
      throw new Error(res?.message || 'Đăng ký thất bại');
    }

    persistSession(res.data.user, res.data.token);
    return res.data.user;
  },

  getDemoCredentials() {
<<<<<<< HEAD
    return MOCK_USERS.map((u) => ({
      email: u.email,
      role: u.role,
      name: u.name,
    }));
=======
    return getDemoAccounts();
>>>>>>> Phanh
  },
};
