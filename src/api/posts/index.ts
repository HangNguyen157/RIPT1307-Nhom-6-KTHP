import { initDatabase } from '@/server/db';
import { requireAuth } from '@/server/middlewares/auth';
import {
  QuestionEntity,
  TagEntity,
  UserEntity,
} from '@/server/models/entities';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op } from 'sequelize';
import { validateCreatePostInput } from '@/utils/validation';

export function formatTime(date: Date) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 0) return 'Vừa xong';
  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString('vi-VN');
}

export function formatQuestion(q: any) {
  return {
    id: q.id,
    title: q.title,
    excerpt: q.excerpt,
    content: q.content,
    author: q.author ? q.author.name : 'Unknown',
    authorId: q.authorId,
    authorRole: q.author ? q.author.role : 'sinhvien',
    authorRep: q.author ? q.author.reputation : 0,
    tags: q.questionTags ? q.questionTags.map((t: any) => t.name) : [],
    votes: q.votes,
    comments: q.commentsCount,
    views: q.views,
    timestamp: formatTime(q.createdAt),
    subject: q.subject,
    isSolved: q.isSolved,
    status: q.status,
    createdAt: q.createdAt,
  };
}

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const { tag, q, sort, authorId, page, limit, unanswered } = req.query ?? {};

      // Pagination
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
      const offset = (pageNum - 1) * pageSize;

      const whereClause: any = { status: { [Op.ne]: 'hidden' } };

      if (authorId) {
        whereClause.authorId = authorId;
      }

      // Lọc bài chưa được giải quyết (filter ở DB để phân trang đúng)
      if (unanswered === '1' || unanswered === 'true') {
        whereClause.isSolved = false;
      }

      if (typeof q === 'string' && q.trim()) {
        const keyword = `%${q.trim()}%`;
        whereClause[Op.or] = [
          { title: { [Op.like]: keyword } },
          { content: { [Op.like]: keyword } },
        ];
      }

      let orderClause: any = [['createdAt', 'DESC']];
      if (sort === 'votes') {
        orderClause = [['votes', 'DESC']];
      } else if (sort === 'views') {
        orderClause = [['views', 'DESC']];
      }

      const tagInclude: any = {
        model: TagEntity,
        as: 'questionTags',
        through: { attributes: [] },
      };

      if (typeof tag === 'string' && tag.trim()) {
        tagInclude.where = { name: tag.trim() };
      }

      const { count, rows } = await QuestionEntity.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: UserEntity,
            as: 'author',
            attributes: ['name', 'role', 'reputation'],
          },
          tagInclude,
        ],
        order: orderClause,
        limit: pageSize,
        offset,
      });

      const list = rows.map(formatQuestion);
      const total = count;
      const totalPages = Math.ceil(total / pageSize);

      res.status(200).json({
        success: true,
        data: {
          list,
          pagination: {
            page: pageNum,
            limit: pageSize,
            total,
            totalPages,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách bài viết',
        error: String(error),
      });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { title, content, subject, tags } = req.body ?? {};

      // Validate input
      const validation = validateCreatePostInput({ title, content, tags });
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
        return;
      }

      // Danh tính người đăng lấy từ JWT, không tin vào body
      const auth = await requireAuth(req);
      if (!auth) {
        res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập để đăng bài',
        });
        return;
      }
      const authorId = auth.userId;

      const user = await UserEntity.findByPk(authorId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        return;
      }

      const excerpt = content.substring(0, 180) + (content.length > 180 ? '...' : '');

      const newQuestion = await QuestionEntity.create({
        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        title: title.trim(),
        excerpt,
        content,
        authorId,
        votes: 0,
        commentsCount: 0,
        views: 0,
        subject,
        isSolved: false,
        status: 'active',
        createdAt: new Date(),
      });

      if (Array.isArray(tags) && tags.length > 0) {
        const tagsInDb = await TagEntity.findAll({ where: { name: tags } });
        await (newQuestion as any).setQuestionTags(tagsInDb);

        // Tăng count atomic, tránh lost update
        await Promise.all(tagsInDb.map((t) => t.increment('count')));
      }

      await user.increment('posts');

      try {
        const { notifyNewPost } = await import('@/server/utils/email');
        await notifyNewPost(newQuestion.id, user.email);
      } catch (err) {
        console.error('[Email] Lỗi gửi email thông báo bài viết mới:', err);
      }

      res.status(201).json({
        success: true,
        message: 'Đăng bài viết thành công!',
        data: { id: newQuestion.id },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo bài viết',
        error: String(error),
      });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
