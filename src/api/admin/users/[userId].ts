import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  const userId = req.query?.userId as string;

  if (req.method === 'PUT') {
    res.status(200).json({
      success: true,
      message: `Cập nhật user ${userId} — @todo DB`,
      data: req.body,
    });
    return;
  }

  if (req.method === 'DELETE') {
    res.status(200).json({
      success: true,
      message: `Xóa user ${userId} — @todo DB`,
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
