import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { requireAdminAuth } from '@/server/middlewares/auth';
import { UserEntity, QuestionEntity, CommentEntity } from '@/server/models/entities';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  // Chỉ admin được xem số liệu dashboard
  const admin = await requireAdminAuth(req);
  if (!admin) {
    res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tính năng của Admin',
    });
    return;
  }

  if (req.method === 'GET') {
    try {
      const totalUsers = await UserEntity.count();
      const totalPosts = await QuestionEntity.count();
      const totalComments = await CommentEntity.count();
      const activeUsers = await UserEntity.count({ where: { status: 'active' } });

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalPosts,
          totalComments,
          activeUsers
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy số liệu thống kê dashboard', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
