import { initDb } from '@/server/db';
import { initModels, Question, QuestionComment, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  await initDb();
  initModels();

  try {
    const [totalUsers, totalPosts, totalComments, activeUsers] =
      await Promise.all([
        User.count(),
        Question.count(),
        QuestionComment.count(),
        User.count({ where: { status: 'active' } }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalComments,
        activeUsers,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Lỗi lấy bảng điều khiển';
    res.status(500).json({ success: false, message });
  }
}
