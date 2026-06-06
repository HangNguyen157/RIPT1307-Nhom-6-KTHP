import { MOCK_QUESTIONS } from '@/server/seed/questions';
import { MOCK_ADMIN_USERS } from '@/server/seed/users';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: {
        totalUsers: MOCK_ADMIN_USERS.length,
        totalPosts: MOCK_QUESTIONS.length,
        totalComments: MOCK_QUESTIONS.reduce((s, q) => s + q.comments, 0),
        activeUsers: MOCK_ADMIN_USERS.filter((u) => u.status !== 'banned')
          .length,
      },
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
