import { initDb, sequelize } from '@/server/db';
import {
  canModifyOwnOrAdmin,
  requireAuthUser,
} from '@/server/middlewares/auth';
import { Answer, initModels, User } from '@/server/models';
import { formatRelativeTime } from '@/server/utils/format';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  const answerId = req.query?.id as string;
  if (!answerId) {
    res
      .status(400)
      .json({ success: false, message: 'Thiếu id câu trả lời', data: null });
    return;
  }

  await initDb();
  initModels();

  if (req.method === 'GET') {
    try {
      const answer = await Answer.findByPk(answerId, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'role', 'reputation', 'avatar'],
          },
        ],
      });
      if (!answer) {
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy câu trả lời', data: null });
        return;
      }

      const author = answer.get('author') as any;
      res.status(200).json({
        success: true,
        message: 'OK',
        data: {
          id: answer.get('id'),
          questionId: answer.get('question_id'),
          content: answer.get('content'),
          isAccepted: Boolean(answer.get('is_accepted')),
          author: author
            ? {
                id: author.id,
                name: author.name,
                role: author.role,
                reputation: author.reputation,
              }
            : null,
          authorId: answer.get('author_id'),
          timestamp: formatRelativeTime(answer.get('created_at') as string),
          createdAt: answer.get('created_at'),
        },
      });
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi truy vấn';
      res.status(500).json({ success: false, message, data: null });
      return;
    }
  }

  if (req.method === 'PUT') {
    const auth = await requireAuthUser(req);
    if (!auth) {
      res
        .status(401)
        .json({ success: false, message: 'Vui lòng đăng nhập', data: null });
      return;
    }

    const { content } = req.body ?? {};
    if (!content?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Nội dung câu trả lời là bắt buộc',
        data: null,
      });
      return;
    }

    const t = await sequelize.transaction();
    try {
      const answer = await Answer.findByPk(answerId, { transaction: t });
      if (!answer) {
        await t.rollback();
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy câu trả lời', data: null });
        return;
      }

      if (!canModifyOwnOrAdmin(answer.get('author_id') as string, auth)) {
        await t.rollback();
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền sửa câu trả lời này',
          data: null,
        });
        return;
      }

      await answer.update({ content: content.trim() } as any, { transaction: t });
      await t.commit();
      res.status(200).json({
        success: true,
        message: 'Cập nhật câu trả lời thành công',
        data: { id: answerId },
      });
      return;
    } catch (err: unknown) {
      await t.rollback();
      const message =
        err instanceof Error ? err.message : 'Cập nhật câu trả lời thất bại';
      res.status(500).json({ success: false, message, data: null });
      return;
    }
  }

  if (req.method === 'DELETE') {
    const auth = await requireAuthUser(req);
    if (!auth) {
      res
        .status(401)
        .json({ success: false, message: 'Vui lòng đăng nhập', data: null });
      return;
    }

    const t = await sequelize.transaction();
    try {
      const answer = await Answer.findByPk(answerId, { transaction: t });
      if (!answer) {
        await t.rollback();
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy câu trả lời', data: null });
        return;
      }

      if (!canModifyOwnOrAdmin(answer.get('author_id') as string, auth)) {
        await t.rollback();
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xóa câu trả lời này',
          data: null,
        });
        return;
      }

      const authorId = answer.get('author_id') as string;
      await answer.destroy({ transaction: t });

      if (authorId) {
        await User.decrement('answers_count', {
          by: 1,
          where: { id: authorId },
          transaction: t,
        });
      }

      await t.commit();
      res.status(200).json({
        success: true,
        message: 'Đã xóa câu trả lời',
        data: { id: answerId },
      });
      return;
    } catch (err: unknown) {
      await t.rollback();
      const message =
        err instanceof Error ? err.message : 'Xóa câu trả lời thất bại';
      res.status(500).json({ success: false, message, data: null });
      return;
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed', data: null });
}
