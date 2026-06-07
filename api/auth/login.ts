import { initDb } from '@/server/db';
import { initModels, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import bcrypt from 'bcryptjs';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  await initDb();
  await initModels();

  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    const hash = (user.get('password_hash') as string) || '';
    const ok = hash ? bcrypt.compareSync(password, hash) : false;
    if (!ok) {
      res
        .status(401)
        .json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    const payload = {
      user: {
        id: user.get('id'),
        name: user.get('name'),
        email: user.get('email'),
        role: user.get('role'),
      },
      token: `db_token_${user.get('id')}`,
    };

    res.status(200).json({ success: true, data: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Đăng nhập thất bại';
    res.status(500).json({ success: false, message });
  }
}
