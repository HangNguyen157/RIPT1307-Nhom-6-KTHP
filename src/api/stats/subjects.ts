import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { QuestionEntity } from '@/server/models/entities';
import { Sequelize } from 'sequelize';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const stats = await QuestionEntity.findAll({
        attributes: [
          'subject',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['subject'],
        where: { 
          subject: { [Sequelize.Op.ne]: null },
          status: { [Sequelize.Op.ne]: 'hidden' }
        },
        raw: true // Ensure we get plain objects
      });

      // Sequelize count might return as a string in some dialects, cast to number
      const list = stats.map((s: any) => ({
        subject: s.subject,
        count: parseInt(s.count, 10) || 0
      }));

      res.status(200).json({ success: true, data: { list } });
    } catch (error) {
      console.error('[API Stats Subjects] Error:', error);
      res.status(500).json({ success: false, message: 'Lỗi lấy thống kê môn học', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
