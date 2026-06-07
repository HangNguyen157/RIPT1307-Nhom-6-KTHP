import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { QueryTypes } from 'sequelize';
import { initDatabase, sequelize } from '@/server/db';
import { TagEntity } from '@/server/models/entities';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const tags = await TagEntity.findAll({ raw: true });

      // Đếm số bài viết THẬT theo từng tag từ bảng nối (không dùng cột count seed sẵn)
      const rows = (await sequelize.query(
        'SELECT tagName, COUNT(*) AS cnt FROM QuestionTags GROUP BY tagName',
        { type: QueryTypes.SELECT },
      )) as { tagName: string; cnt: number }[];

      const countMap: Record<string, number> = {};
      for (const r of rows) {
        countMap[r.tagName] = Number(r.cnt);
      }

      const list = (tags as any[])
        .map((t) => ({ ...t, count: countMap[t.name] || 0 }))
        .sort((a, b) => b.count - a.count);

      res.status(200).json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thẻ', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
