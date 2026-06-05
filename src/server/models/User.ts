import crypto from 'crypto';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  major?: string;
  studentId?: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  posts: number;
  answers: number;
  votes: number;
  followers: number;
  following: number;
  joinDate: string;
  badges: string[];
  status?: 'active' | 'banned';
}

export function isAdmin(user: Pick<User, 'role'> | null | undefined): boolean {
  return user?.role === 'admin';
}

export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}

export function verifyPassword(plain: string, hash?: string): boolean {
  if (!hash) return false;
  return hashPassword(plain) === hash;
}
