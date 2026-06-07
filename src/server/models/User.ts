import bcrypt from 'bcryptjs';

export type UserRole = 'sinhvien' | 'giangvien' | 'admin';

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

/** Giảng viên và admin có quyền kiểm duyệt nội dung (xóa bài, chọn câu trả lời hay nhất). */
export function canModerate(
  user: Pick<User, 'role'> | null | undefined,
): boolean {
  return user?.role === 'admin' || user?.role === 'giangvien';
}

export async function hashPassword(plain: string): Promise<string> {
  // Sử dụng bcryptjs đúng cách: truyền rounds trực tiếp
  // bcryptjs sẽ tự động tạo salt và hash
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash?: string,
): Promise<boolean> {
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch (error) {
    console.error('[Password Verify] Lỗi so sánh mật khẩu:', error);
    return false;
  }
}
