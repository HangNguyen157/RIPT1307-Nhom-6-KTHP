import { MOCK_TAGS } from '@/server/seed/tags';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ success: true, data: { list: MOCK_TAGS } });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
