// Mock Authentication System using localStorage
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
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
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@ptit.edu.vn',
    role: 'admin',
    department: 'Ban Quản Trị',
    reputation: 9999,
    posts: 150,
    answers: 320,
    votes: 1250,
    followers: 500,
    following: 50,
    joinDate: '2023-01-01',
    badges: ['admin', 'top-contributor', 'helpful'],
  },
  {
    id: '2',
    name: 'Trần Thị Hương',
    email: 'huong@student.ptit.edu.vn',
    role: 'student',
    department: 'Công Nghệ Thông Tin',
    major: 'Lập Trình Web',
    studentId: 'B21DCCN123',
    bio: 'Sinh viên năm 3 ngành CNTT, đam mê Web Development và AI',
    reputation: 1250,
    posts: 28,
    answers: 45,
    votes: 320,
    followers: 89,
    following: 34,
    joinDate: '2024-09-01',
    badges: ['first-question', 'helpful', '100-votes'],
  },
  {
    id: '3',
    name: 'PGS.TS Lê Minh Đức',
    email: 'duc.lm@ptit.edu.vn',
    role: 'teacher',
    department: 'Khoa CNTT',
    major: 'Khoa học máy tính',
    bio: 'Giảng viên môn CTDL, Giải Thuật, AI. Có 15 năm kinh nghiệm giảng dạy.',
    reputation: 5430,
    posts: 85,
    answers: 210,
    votes: 870,
    followers: 342,
    following: 15,
    joinDate: '2023-06-15',
    badges: ['teacher', 'expert', 'top-contributor', 'advisor'],
  },
];

const STORAGE_KEY = 'forum_current_user';
const AUTH_KEY = 'forum_auth_token';

export const authUtils = {
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo: any password works for mock users
        const user = MOCK_USERS.find((u) => u.email === email);
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_KEY, `mock_token_${user.id}`);
          resolve(user);
        } else if (email && password.length >= 6) {
          // Create a new user for demo
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
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          localStorage.setItem(AUTH_KEY, `mock_token_${newUser.id}`);
          resolve(newUser);
        } else {
          reject(new Error('Email hoặc mật khẩu không chính xác'));
        }
      }, 800);
    });
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  },

  register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    department?: string;
    studentId?: string;
  }): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          role: data.role as any,
          department: data.department,
          studentId: data.studentId,
          reputation: 10,
          posts: 0,
          answers: 0,
          votes: 0,
          followers: 0,
          following: 0,
          joinDate: new Date().toISOString().split('T')[0],
          badges: ['newcomer'],
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(AUTH_KEY, `mock_token_${newUser.id}`);
        resolve(newUser);
      }, 1000);
    });
  },

  getDemoCredentials() {
    return MOCK_USERS.map((u) => ({
      email: u.email,
      role: u.role,
      name: u.name,
    }));
  },
};
