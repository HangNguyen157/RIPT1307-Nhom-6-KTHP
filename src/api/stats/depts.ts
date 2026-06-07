import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { QuestionEntity, UserEntity } from '@/server/models/entities';
import { Sequelize } from 'sequelize';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const stats = await QuestionEntity.findAll({
        attributes: [
          [Sequelize.col('author.department'), 'dept'],
          [Sequelize.fn('COUNT', Sequelize.col('Question.id')), 'count']
        ],
        include: [{
          model: UserEntity,
          as: 'author',
          attributes: [],
          where: { department: { [Sequelize.Op.ne]: null } }
        }],
        group: ['author.department'],
        raw: true
      });

      const list = stats.map((s: any) => ({
        name: s.dept,
        count: parseInt(s.count, 10) || 0
      }));

      res.status(200).json({ success: true, data: { list } });
    } catch (error) {
      console.error('[API Stats Depts] Error:', error);
      res.status(500).json({ success: false, message: 'Lỗi lấy thống kê chuyên ngành', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
