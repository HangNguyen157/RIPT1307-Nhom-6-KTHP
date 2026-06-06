import type { User } from '@/server/models/User';

export default (initialState: { currentUser?: User | null }) => {
  const canSeeAdmin = initialState?.currentUser?.role === 'admin';
  return {
    canSeeAdmin,
  };
};
