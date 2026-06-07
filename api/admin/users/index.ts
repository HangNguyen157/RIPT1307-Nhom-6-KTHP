import { initDb } from '@/server/db';
import { initModels, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDb();
  initModels();

  if (req.method === 'GET') {
    try {
      const list = await User.findAll({ order: [['created_at', 'DESC']] });
      res.status(200).json({ success: true, data: { list } });
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Lỗi lấy danh sách người dùng';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        email,
        password,
        role = 'student',
        department,
        major,
        studentId,
      } = req.body ?? {};
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email và password là bắt buộc',
        });
        return;
      }

      const exists = await User.findOne({ where: { email } });
      if (exists) {
        res.status(409).json({ success: false, message: 'Email đã tồn tại' });
        return;
      }

      const hashed = bcrypt.hashSync(password, 10);
      const user = await User.create({
        id: randomUUID(),
        name,
        email,
        password_hash: hashed,
        role,
        department: department || null,
        major: major || null,
        student_id: studentId || null,
      } as any);

      res.status(201).json({ success: true, data: { id: user.get('id') } });
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Tạo người dùng thất bại';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
