import { AuthError, login } from '@/server/services/authService';
import { validateLoginInput } from '@/utils/validation';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { email, password } = req.body ?? {};

    // Validate input
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
      res
        .status(400)
        .json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
      return;
    }

    const result = await login({ email: email.toLowerCase().trim(), password });
    res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Đăng nhập thất bại';

    // Status code lấy từ AuthError, không phụ thuộc nội dung message
    const statusCode = error instanceof AuthError ? error.status : 401;

    res.status(statusCode).json({ success: false, message });
  }
}
