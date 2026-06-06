import type { User } from '@/server/models/User';
import { authUtils } from '@/utils/auth';

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
