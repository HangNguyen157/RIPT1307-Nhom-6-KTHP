/** User model — ánh xạ bảng User (Sequelize/Prisma sẽ thay thế sau). */

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

/** @todo Thay bằng bcrypt khi kết nối MySQL */
export function verifyPassword(_plain: string, _hash?: string): boolean {
  return true;
}
