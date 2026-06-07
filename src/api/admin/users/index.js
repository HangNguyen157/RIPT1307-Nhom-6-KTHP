import { initDatabase } from '@/server/db';
import { requireAuth } from '@/server/middlewares/auth';
import { UserEntity } from '@/server/models/entities';
import { hashPassword } from '@/server/models/User';

export default async function handler(req, res) {
  await initDatabase();

  // Check auth & role
  const auth = await requireAuth(req);
  if (!auth) {
    return res.status(401).json({
      success: false,
      message: 'Bạn cần đăng nhập để truy cập tính năng này',
    });
  }

  // Verify admin role from database
  const adminUser = await UserEntity.findByPk(auth.userId);
  if (!adminUser || adminUser.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tính năng của Admin',
    });
  }

  if (req.method === 'GET') {
    return handleGetUsers(req, res);
  } else if (req.method === 'POST') {
    return handleCreateUser(req, res);
  } else {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }
}

async function handleGetUsers(req, res) {
  try {
    const users = await UserEntity.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'status',
        'reputation',
        'posts',
        'answers',
        'joinDate',
        'avatar',
      ],
      order: [['joinDate', 'DESC']],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      reputation: user.reputation,
      posts: user.posts,
      answers: user.answers,
      joinDate: user.joinDate,
      avatar: user.avatar || user.name.charAt(0),
    }));

    res.status(200).json({
      success: true,
      data: {
        list: formattedUsers,
        total: formattedUsers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách người dùng',
      error: String(error),
    });
  }
}

async function handleCreateUser(req, res) {
  try {
    const { name, email, password, role, department, studentId } =
      req.body ?? {};

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: name, email, password, role',
      });
    }

    // Validate role
    if (!['sinhvien', 'giangvien', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ',
      });
    }

    // Check email exists
    const existingUser = await UserEntity.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await UserEntity.create({
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      department: department || 'CNTT',
      studentId: studentId || '',
      status: 'active',
      reputation: 10,
      posts: 0,
      answers: 0,
      votes: 0,
      followers: 0,
      following: 0,
      joinDate: new Date().toISOString(),
      badges: [],
    });

    res.status(201).json({
      success: true,
      message: 'Tạo người dùng mới thành công',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        reputation: newUser.reputation,
        joinDate: newUser.joinDate,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo người dùng',
      error: String(error),
    });
  }
}
