import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'POST') {
    res.status(201).json({
      success: true,
      message: 'Thêm bình luận — @todo lưu DB và gửi email',
      data: { id: Date.now().toString() },
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
