import type { User, UserRole } from '../models/User';
import { verifyPassword } from '../models/User';
import { MOCK_USERS } from '../seed/users';

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

function createToken(userId: string): string {
  return `mock_token_${userId}`;
}

function stripPasswordFields(user: User): User {
  return user;
}

export function login(input: LoginInput): AuthResult {
  const { email, password } = input;
  const found = MOCK_USERS.find((u) => u.email === email);

  if (found && verifyPassword(password)) {
    return { user: stripPasswordFields(found), token: createToken(found.id) };
  }

  if (email && password.length >= 6) {
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: 'student',
      reputation: 10,
      posts: 0,
      answers: 0,
      votes: 0,
      followers: 0,
      following: 0,
      joinDate: new Date().toISOString().split('T')[0],
      badges: [],
      status: 'active',
    };
    return { user: newUser, token: createToken(newUser.id) };
  }

  throw new Error('Email hoặc mật khẩu không chính xác');
}

export function register(input: RegisterInput): AuthResult {
  const newUser: User = {
    id: Date.now().toString(),
    name: input.name,
    email: input.email,
    role: input.role,
    department: input.department,
    studentId: input.studentId,
    reputation: 10,
    posts: 0,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: new Date().toISOString().split('T')[0],
    badges: ['newcomer'],
    status: 'active',
  };
  return { user: newUser, token: createToken(newUser.id) };
}
