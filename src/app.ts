import type { User } from '@/server/models/User';
import { authUtils } from '@/utils/auth';
import type { RequestConfig } from '@umijs/max';

/**
 * Cấu hình request toàn cục: tự động gắn JWT vào header Authorization
 * cho mọi request gửi tới /api/* (backend dùng token này để xác thực).
 */
export const request: RequestConfig = {
  requestInterceptors: [
    (config: any) => {
      const token = typeof window !== 'undefined' ? authUtils.getToken() : null;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
};

export async function getInitialState(): Promise<{
  name: string;
  currentUser: User | null;
}> {
  const currentUser =
    typeof window !== 'undefined' ? authUtils.getCurrentUser() : null;

  return {
    name: currentUser?.name ?? 'EduForum',
    currentUser,
  };
}
