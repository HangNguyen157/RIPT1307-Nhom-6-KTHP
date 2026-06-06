import { MOCK_USERS } from '@/server/seed/users';

export function getDemoCredentials() {
  return MOCK_USERS.map((u) => ({
    email: u.email,
    role: u.role,
    name: u.name,
  }));
}
