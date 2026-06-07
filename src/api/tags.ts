import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op, QueryTypes, col, fn } from 'sequelize';
import { initDatabase, sequelize } from '@/server/db';
import { QuestionEntity, TagEntity } from '@/server/models/entities';

/**
 * GET /api/tags — danh sách thẻ (count bài viết THẬT) + danh sách môn học
 * (gộp chung 1 endpoint vì Vercel Hobby giới hạn 12 serverless functions).
 */
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

      // Môn học kèm số bài thật (GROUP BY từ bảng Questions)
      const subjectRows = await QuestionEntity.findAll({
        attributes: ['subject', [fn('COUNT', col('id')), 'count']],
        where: {
          status: { [Op.ne]: 'hidden' },
          subject: { [Op.ne]: null },
        },
        group: ['subject'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true,
      });

      const subjects = (subjectRows as any[]).map((r) => ({
        name: r.subject,
        count: Number(r.count),
      }));

      res.status(200).json({ success: true, data: { list, subjects } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thẻ', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
