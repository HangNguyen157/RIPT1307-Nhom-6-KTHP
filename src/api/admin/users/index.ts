import { MOCK_ADMIN_USERS } from '@/server/seed/users';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ success: true, data: { list: MOCK_ADMIN_USERS } });
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({
      success: true,
      message: 'Thêm người dùng — @todo lưu DB',
      data: { id: Date.now().toString() },
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
