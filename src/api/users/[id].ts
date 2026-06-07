import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { UserEntity } from '@/server/models/entities';

/**
 * GET /api/users/:id — thông tin hồ sơ công khai của một user.
 * Chỉ trả về các field an toàn (không password, không email quản trị nội bộ).
 */
export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  let id = req.query?.id as string;
  if (!id && req.url) {
    const match = req.url.match(/\/api\/users\/([^/?]+)/);
    id = match ? match[1] : '';
  }

  if (!id) {
    res.status(400).json({ success: false, message: 'Thiếu ID người dùng' });
    return;
  }

  try {
    const user = await UserEntity.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'department',
        'major',
        'studentId',
        'avatar',
        'bio',
        'reputation',
        'posts',
        'answers',
        'votes',
        'followers',
        'following',
        'joinDate',
        'badges',
        'status',
      ],
    });

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: 'Người dùng không tồn tại' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin người dùng',
      error: String(error),
    });
  }
}
