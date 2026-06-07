import jwt from 'jsonwebtoken';
import { initDatabase } from '../db';
import { UserEntity } from '../models/entities';
import type { User, UserRole } from '../models/User';
import { hashPassword, verifyPassword } from '../models/User';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  studentId?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

/** Lỗi nghiệp vụ auth kèm HTTP status — tránh phải so chuỗi message ở API layer */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRATION = '7d';

export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  await initDatabase();
  const { email, password } = input;

  const found = await UserEntity.findOne({ where: { email } });

  if (found) {
    const checkVerify = await verifyPassword(password, found.password);

    if (found.status === 'banned') {
      throw new AuthError(
        'Tài khoản của bạn đã bị khóa bởi quản trị viên',
        403,
      );
    }

    if (checkVerify) {
      // Map về interface User để trả về client
      const userObj: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        department: found.department,
        major: found.major,
        studentId: found.studentId,
        avatar: found.avatar,
        bio: found.bio,
        reputation: found.reputation,
        posts: found.posts,
        answers: found.answers,
        votes: found.votes,
        followers: found.followers,
        following: found.following,
        joinDate: found.joinDate,
        badges: found.badges,
        status: found.status,
      };
      return { user: userObj, token: createToken(found.id) };
    }
  }

  throw new AuthError('Email hoặc mật khẩu không chính xác', 401);
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  await initDatabase();

  // Kiểm tra email tồn tại
  const exist = await UserEntity.findOne({ where: { email: input.email } });
  if (exist) {
    throw new AuthError('Email này đã được đăng ký sử dụng', 409);
  }

  const hashedPassword = await hashPassword(input.password);

  const newUser = await UserEntity.create({
    id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: input.role,
    department: input.department || 'CNTT',
    studentId: input.studentId || '',
    reputation: 10,
    posts: 0,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: new Date().toISOString().split('T')[0],
    badges: ['newcomer'],
    status: 'active',
  });

  const userObj: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    department: newUser.department,
    major: newUser.major,
    studentId: newUser.studentId,
    avatar: newUser.avatar,
    bio: newUser.bio,
    reputation: newUser.reputation,
    posts: newUser.posts,
    answers: newUser.answers,
    votes: newUser.votes,
    followers: newUser.followers,
    following: newUser.following,
    joinDate: newUser.joinDate,
    badges: newUser.badges,
    status: newUser.status,
  };

  return { user: userObj, token: createToken(newUser.id) };
}
