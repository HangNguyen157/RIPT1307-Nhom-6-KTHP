import { initDb } from '@/server/db';
import { requireAuthUser } from '@/server/middlewares/auth';
import { initModels, Question, Tag, User } from '@/server/models';
import {
  createQuestion,
  logSequelizeError,
  syncQuestionTags,
} from '@/server/services/questionService';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op } from 'sequelize';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDb();
  initModels();

  if (req.method === 'GET') {
    try {
      const { tag, q, authorId } = req.query ?? {};
      const where: any = { status: 'active' };
      if (typeof authorId === 'string' && authorId.trim()) {
        where.author_id = authorId;
      }
      if (typeof q === 'string' && q.trim()) {
        const like = `%${q}%`;
        where[Op.or] = [
          { title: { [Op.like]: like } },
          { excerpt: { [Op.like]: like } },
        ];
      }

      const include: any = [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
      ];

      if (typeof tag === 'string' && tag.trim()) {
        include.push({
          model: Tag,
          where: { name: tag },
          through: { attributes: [] },
        });
      } else {
        include.push({ model: Tag, through: { attributes: [] } });
      }

      const list = await Question.findAll({
        where,
        include,
        order: [['created_at', 'DESC']],
        limit: 100,
      });

      const data = list.map((q) => ({
        id: q.get('id'),
        title: q.get('title'),
        excerpt: q.get('excerpt'),
        content: q.get('content'),
        subject: q.get('subject'),
        is_solved: q.get('is_solved'),
        status: q.get('status'),
        author: (q.get('author') as any) || null,
        tags: (q.get('Tags') as any) || [],
        created_at: q.get('created_at'),
      }));

      res.status(200).json({ success: true, message: 'OK', data: { list: data } });
    } catch (err: unknown) {
      logSequelizeError('GET /api/posts', err);
      const message = err instanceof Error ? err.message : 'Lỗi truy vấn';
      res.status(500).json({ success: false, message, data: null });
    }
    return;
  }

  if (req.method === 'POST') {
    const auth = await requireAuthUser(req);
    if (!auth) {
      res
        .status(401)
        .json({ success: false, message: 'Vui lòng đăng nhập', data: null });
      return;
    }

    const { title, excerpt, content, subject, tags } = req.body ?? {};
    if (!title?.trim() || !excerpt?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Tiêu đề và tóm tắt là bắt buộc',
        data: null,
      });
      return;
    }

    try {
      const id = await createQuestion({
        title,
        excerpt,
        content,
        subject,
        tags: Array.isArray(tags) ? tags : [],
        authorId: auth.userId,
      });

      res
        .status(201)
        .json({ success: true, message: 'Tạo câu hỏi thành công', data: { id } });
    } catch (err: unknown) {
      logSequelizeError('POST /api/posts', err);
      const message =
        err instanceof Error ? err.message : 'Tạo bài viết thất bại';
      res.status(500).json({ success: false, message, data: null });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed', data: null });
}
