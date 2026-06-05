import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { TagEntity } from '@/server/models/entities';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const tags = await TagEntity.findAll({
        order: [['count', 'DESC']]
      });
      res.status(200).json({ success: true, data: { list: tags } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thẻ', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}

