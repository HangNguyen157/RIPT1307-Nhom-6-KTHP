import { initDb } from '@/server/db';
import { initModels, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  await initDb();
  initModels();

  try {
    const {
      name,
      email,
      password,
      role = 'student',
      department,
      studentId,
    } = req.body ?? {};
    if (!email || !password || !name) {
      res
        .status(400)
        .json({
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
    const newUser = await User.create({
      id: randomUUID(),
      name,
      email,
      password_hash: hashed,
      role,
      department: department || null,
      student_id: studentId || null,
    } as any);

    const result = {
      user: {
        id: newUser.get('id'),
        name: newUser.get('name'),
        email: newUser.get('email'),
        role: newUser.get('role'),
      },
      token: `db_token_${newUser.get('id')}`,
    };

    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Đăng ký thất bại';
    res.status(500).json({ success: false, message });
  }
}
