import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { login } from '@/server/services/authService';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { email, password } = req.body ?? {};
    const result = await login({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đăng nhập thất bại';
    res.status(401).json({ success: false, message });
  }
}
