import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { UserEntity } from '@/server/models/entities';
import { hashPassword } from '@/server/models/User';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();
  const userId = req.query?.userId as string;

  if (req.method === 'GET') {
    try {
      const user = await UserEntity.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng', error: String(error) });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const user = await UserEntity.findByPk(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        return;
      }

      const { name, role, department, studentId, status, newPassword } = req.body ?? {};

      if (name !== undefined) user.name = name;
      if (role !== undefined) user.role = role;
      if (department !== undefined) user.department = department;
      if (studentId !== undefined) user.studentId = studentId;
      if (status !== undefined) user.status = status;
      
      if (newPassword) {
        user.password = hashPassword(newPassword);
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công!',
        data: user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi cập nhật người dùng', error: String(error) });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const user = await UserEntity.findByPk(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        return;
      }

      await user.destroy();

      res.status(200).json({
        success: true,
        message: `Đã xóa người dùng ${user.name} khỏi hệ thống.`
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xóa người dùng', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
