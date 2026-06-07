import { initDb } from '@/server/db';
import { initModels, Tag } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDb();
  await initModels();

  if (req.method === 'GET') {
    try {
      const list = await Tag.findAll({ order: [['name', 'ASC']], raw: true });
      res.status(200).json({ success: true, data: { list } });
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi lấy tags';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
