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
  if (!adminUser || adminUser.role.toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tính năng của Admin',
    });
  }

  // Extract userId from URL path - optimize for UmiJS dynamic routes
  const userId = req.query?.userId || req.params?.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'ID người dùng không hợp lệ',
    });
  }

  if (req.method === 'PUT') {
    return handleUpdateUser(req, res, userId);
  } else if (req.method === 'PATCH') {
    return handleResetPassword(req, res, userId);
  } else if (req.method === 'DELETE') {
    return handleDeleteUser(req, res, userId);
  } else {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }
}

async function handleUpdateUser(req, res, userId) {
  try {
    const { name, role, status } = req.body ?? {};

    // Find user
    const user = await UserEntity.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Update allowed fields
    if (name) {
      user.name = name.trim();
    }

    if (role && ['sinhvien', 'giangvien', 'admin'].includes(role)) {
      user.role = role;
    }

    // Update status (khóa/mở khóa tài khoản)
    if (status && ['active', 'banned'].includes(status)) {
      user.status = status;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin người dùng thành công',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        reputation: user.reputation,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật người dùng',
      error: String(error),
    });
  }
}

async function handleResetPassword(req, res, userId) {
  try {
    const { newPassword } = req.body ?? {};

    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải ít nhất 6 ký tự',
      });
    }

    // Find user
    const user = await UserEntity.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Hash and update password
    const hashedPassword = await hashPassword(newPassword.trim());
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cấp lại mật khẩu thành công',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cấp lại mật khẩu',
      error: String(error),
    });
  }
}

async function handleDeleteUser(req, res, userId) {
  try {
    // Prevent admin from deleting themselves
    const auth = await requireAuth(req);
    if (auth && auth.userId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể xóa chính mình',
      });
    }

    // Find and delete user
    const user = await UserEntity.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Delete with cascade
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công',
      data: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa người dùng',
      error: String(error),
    });
  }
}
