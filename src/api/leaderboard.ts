import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { UserEntity } from '@/server/models/entities';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const users = await UserEntity.findAll({
        attributes: { exclude: ['password'] },
        where: { status: 'active' },
        order: [['reputation', 'DESC']],
        limit: 50
      });

      const formatted = users.map((u: any) => {
        const data = u.toJSON();
        return {
          ...data,
          dept: u.department || '',
          joined: u.joinDate ? u.joinDate.substring(0, 4) : ''
        };
      });

      res.status(200).json({ success: true, data: { list: formatted } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy bảng xếp hạng', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
