import type { UserRole } from '@/server/models/User';
import { register } from '@/server/services/authService';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, password, role, department, studentId } =
      req.body ?? {};
    const result = register({
      name,
      email,
      password,
      role: (role as UserRole) || 'student',
      department,
      studentId,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đăng ký thất bại';
    res.status(400).json({ success: false, message });
  }
}
