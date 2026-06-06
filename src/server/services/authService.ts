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

  //  BLOCK LOG DEBUG
  console.log('=========================================');
  console.log('LOG DEBUG ĐĂNG NHẬP :');
  console.log('--> Email client gửi lên:', `"${email}"`);
  // console.log('--> Mật khẩu thô client gửi lên:', `"${password}"`);
  console.log('--> Tìm thấy User trong DB không?:', found ? 'CÓ' : 'KHÔNG');

  if (found) {
    //  console.log('--> Chuỗi Hash mật khẩu lấy từ DB:', `"${found.password}"`);
    const checkVerify = await verifyPassword(password, found.password);
    console.log('--> Kết quả hàm verifyPassword trả về:', checkVerify);
    console.log('=========================================');

    if (found.status === 'banned') {
      throw new Error('Tài khoản của bạn đã bị khóa bởi quản trị viên');
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
  } else {
    console.log('KHÔNG TÌM THẤY USER NÀO CÓ EMAIL NÀY TRONG DB!');
    console.log('=========================================');
  }

  throw new Error('Email hoặc mật khẩu không chính xác');
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  await initDatabase();

  // Kiểm tra email tồn tại
  const exist = await UserEntity.findOne({ where: { email: input.email } });
  if (exist) {
    throw new Error('Email này đã được đăng ký sử dụng');
  }

  const hashedPassword = await hashPassword(input.password);

  const newUser = await UserEntity.create({
    id: Date.now().toString(),
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
