/**
 * @deprecated Dùng src/api/auth/login.ts và src/api/auth/register.ts trực tiếp.
 * File này giữ lại để tương thích import cũ — không dùng mock data.
 */
import { initDb } from '../db';
import { initModels, User } from '../models';
import type { User as UserType } from '../models/User';
import bcrypt from 'bcryptjs';

export interface AuthResult {
  user: UserType;
  token: string;
}

function stripPasswordFields(user: any): UserType {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    major: user.major,
    studentId: user.student_id ?? user.studentId,
    avatar: user.avatar,
    bio: user.bio,
    reputation: user.reputation ?? 0,
    posts: user.posts_count ?? user.posts ?? 0,
    answers: user.answers_count ?? user.answers ?? 0,
    votes: user.votes_count ?? user.votes ?? 0,
    followers: user.followers_count ?? user.followers ?? 0,
    following: user.following_count ?? user.following ?? 0,
    joinDate: user.created_at ?? user.joinDate ?? '',
    badges: Array.isArray(user.badges) ? user.badges : [],
    status: user.status,
  };
}

function createToken(userId: string): string {
  return `db_token_${userId}`;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult | null> {
  await initDb();
  initModels();

  const found = await User.findOne({ where: { email } });
  if (!found) return null;

  const hash = (found.get('password_hash') as string) || '';
  const ok = hash ? bcrypt.compareSync(password, hash) : false;
  if (!ok) return null;

  return {
    user: stripPasswordFields(found.get({ plain: true })),
    token: createToken(found.get('id') as string),
  };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  studentId?: string;
}): Promise<AuthResult | null> {
  await initDb();
  initModels();

  const exists = await User.findOne({ where: { email: data.email } });
  if (exists) return null;

  const { randomUUID } = await import('crypto');
  const hashed = bcrypt.hashSync(data.password, 10);
  const newUser = await User.create({
    id: randomUUID(),
    name: data.name,
    email: data.email,
    password_hash: hashed,
    role: data.role || 'student',
    department: data.department || null,
    student_id: data.studentId || null,
  } as any);

  return {
    user: stripPasswordFields(newUser.get({ plain: true })),
    token: createToken(newUser.get('id') as string),
  };
}
