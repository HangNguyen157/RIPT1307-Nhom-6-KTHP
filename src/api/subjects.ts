import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op, col, fn } from 'sequelize';
import { initDatabase } from '@/server/db';
import { QuestionEntity } from '@/server/models/entities';

/**
 * GET /api/subjects — danh sách môn học kèm số bài viết thật (GROUP BY từ DB).
 */
export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const rows = await QuestionEntity.findAll({
      attributes: ['subject', [fn('COUNT', col('id')), 'count']],
      where: {
        status: { [Op.ne]: 'hidden' },
        subject: { [Op.ne]: null },
      },
      group: ['subject'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true,
    });

    const list = (rows as any[]).map((r) => ({
      name: r.subject,
      count: Number(r.count),
    }));

    res.status(200).json({ success: true, data: { list } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách môn học',
      error: String(error),
    });
  }
}
