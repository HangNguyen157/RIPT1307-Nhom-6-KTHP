import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { UserEntity } from '@/server/models/entities';
import { hashPassword } from '@/server/models/User';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const users = await UserEntity.findAll({
        order: [['joinDate', 'DESC']]
      });
      res.status(200).json({ success: true, data: { list: users } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách người dùng', error: String(error) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, email, password, role, department, studentId } = req.body ?? {};

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (tên, email, mật khẩu)' });
        return;
      }

      const exist = await UserEntity.findOne({ where: { email } });
      if (exist) {
        res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        return;
      }

      const newUser = await UserEntity.create({
        id: Date.now().toString(),
        name,
        email,
        password: hashPassword(password),
        role: role || 'student',
        department: department || 'CNTT',
        studentId: studentId || '',
        reputation: 10,
        posts: 0,
        answers: 0,
        votes: 0,
        followers: 0,
        following: 0,
        joinDate: new Date().toISOString().split('T')[0],
        badges: ['newcomer'],
        status: 'active'
      });

      res.status(201).json({
        success: true,
        message: 'Thêm người dùng thành công!',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi thêm người dùng', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
