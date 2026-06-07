import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { AuthError, register } from '@/server/services/authService';
import { validateRegisterInput } from '@/utils/validation';
import type { UserRole } from '@/server/models/User';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, password, role, department, studentId } = req.body ?? {};

    // Validate input
    const validation = validateRegisterInput({ name, email, password, role });
    if (!validation.isValid) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: validation.errors });
      return;
    }

    const result = await register({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: (role as UserRole) || 'sinhvien',
      department,
      studentId: studentId || '',
    });
    res.status(201).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đăng ký thất bại';
    const statusCode = error instanceof AuthError ? error.status : 400;
    res.status(statusCode).json({ success: false, message });
  }
}
