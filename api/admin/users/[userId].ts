import { initDb } from '@/server/db';
import { initModels, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  const userId = (req.query?.userId ||
    req.params?.userId ||
    req.query?.id) as string;
  await initDb();
  await initModels();

  if (!userId) {
    res.status(400).json({ success: false, message: 'userId là bắt buộc' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy người dùng' });
        return;
      }

      let badges = user.get('badges');
      if (typeof badges === 'string') {
        try {
          badges = JSON.parse(badges);
        } catch {
          badges = [];
        }
      }
      if (!Array.isArray(badges)) {
        badges = [];
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.get('id'),
          name: user.get('name'),
          email: user.get('email'),
          role: user.get('role'),
          department: user.get('department'),
          major: user.get('major'),
          studentId: user.get('student_id'),
          avatar: user.get('avatar'),
          bio: user.get('bio'),
          reputation: user.get('reputation') ?? 0,
          posts: user.get('posts_count') ?? 0,
          answers: user.get('answers_count') ?? 0,
          votes: user.get('votes_count') ?? 0,
          followers: user.get('followers_count') ?? 0,
          following: user.get('following_count') ?? 0,
          badges,
          createdAt: user.get('created_at'),
        },
      });
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Lỗi lấy thông tin người dùng';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, role, department, major, studentId, status } =
        req.body ?? {};
      const user = await User.findByPk(userId);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy user' });
        return;
      }
      await user.update({
        name: name ?? user.get('name'),
        email: email ?? user.get('email'),
        role: role ?? user.get('role'),
        department: department ?? user.get('department'),
        major: major ?? user.get('major'),
        student_id: studentId ?? user.get('student_id'),
        status: status ?? user.get('status'),
      } as any);
      res.status(200).json({ success: true, data: user });
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Cập nhật user thất bại';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy user' });
        return;
      }
      await user.destroy();
      res.status(200).json({ success: true, message: 'Đã xóa user' });
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Xóa user thất bại';
      res.status(500).json({ success: false, message });
      return;
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
