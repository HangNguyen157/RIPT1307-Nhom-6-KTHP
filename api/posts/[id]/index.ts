import { initDb, sequelize } from '@/server/db';
import {
  canModifyOwnOrAdmin,
  requireAuthUser,
} from '@/server/middlewares/auth';
import {
  initModels,
  Question,
  QuestionComment,
  Tag,
  User,
} from '@/server/models';
import {
  deleteQuestion,
  logSequelizeError,
  QuestionServiceError,
  syncQuestionTags,
} from '@/server/services/questionService';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  const id = req.query?.id as string;
  if (!id) {
    res
      .status(400)
      .json({ success: false, message: 'Thiếu id bài viết', data: null });
    return;
  }

  await initDb();
  await initModels();

  if (req.method === 'GET') {
    try {
      const question = await Question.findOne({
        where: { id, status: 'active' },
        include: [
          { model: User, as: 'author', attributes: ['id', 'name', 'role'] },
          { model: Tag, through: { attributes: [] } },
        ],
      });
      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết',
          data: null,
        });
        return;
      }

      const comments = await QuestionComment.findAll({
        where: { question_id: id },
        order: [['created_at', 'ASC']],
      });

      res.status(200).json({
        success: true,
        message: 'OK',
        data: { question, comments },
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

    const t = await sequelize.transaction();
    try {
      const found = await Question.findByPk(id, { transaction: t });
      if (!found) {
        await t.rollback();
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết',
          data: null,
        });
        return;
      }

      if (!canModifyOwnOrAdmin(found.get('author_id') as string, auth)) {
        await t.rollback();
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền sửa bài viết này',
          data: null,
        });
        return;
      }

      const { title, excerpt, content, subject, tags } = req.body ?? {};
      await found.update(
        {
          ...(title?.trim() ? { title: title.trim() } : {}),
          ...(excerpt?.trim() ? { excerpt: excerpt.trim() } : {}),
          ...(content !== undefined
            ? { content: content?.trim() || null }
            : {}),
          ...(subject !== undefined ? { subject: subject || null } : {}),
        } as any,
        { transaction: t },
      );

      if (Array.isArray(tags)) {
        await syncQuestionTags(id, tags, t);
      }

      await t.commit();
      res.status(200).json({
        success: true,
        message: 'Cập nhật bài viết thành công',
        data: { id },
      });
      return;
    } catch (err: unknown) {
      await t.rollback();
      logSequelizeError('PUT /api/posts/:id', err);
      const message =
        err instanceof Error ? err.message : 'Cập nhật bài viết thất bại';
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

    try {
      await deleteQuestion(id, auth);
      res.status(200).json({
        success: true,
        message: 'Xóa bài viết thành công',
        data: { id },
      });
      return;
    } catch (err: unknown) {
      if (err instanceof QuestionServiceError) {
        res
          .status(err.status)
          .json({ success: false, message: err.message, data: null });
        return;
      }
      logSequelizeError('DELETE /api/posts/:id', err);
      const message =
        err instanceof Error ? err.message : 'Xóa bài viết thất bại';
      res.status(500).json({ success: false, message, data: null });
      return;
    }
  }

  res
    .status(405)
    .json({ success: false, message: 'Method not allowed', data: null });
}
