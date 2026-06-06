import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'POST') {
    const { value } = req.body ?? {};
    res.status(200).json({
      success: true,
      message: 'Vote — @todo logic đổi chiều/hủy vote',
      data: { value },
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
