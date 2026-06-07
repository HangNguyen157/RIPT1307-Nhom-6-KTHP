import { initDatabase } from '@/server/db';
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
  // Handle Sequelize model instance
  const data = typeof q.get === 'function' ? q.get({ plain: true }) : q;
  
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author ? data.author.name : 'Unknown',
    authorId: data.authorId,
    authorRole: data.author ? data.author.role : 'sinhvien',
    authorRep: data.author ? data.author.reputation : 0,
    tags: data.questionTags ? data.questionTags.map((t: any) => t.name) : (data.Tags ? data.Tags.map((t: any) => t.name) : []),
    votes: data.votes,
    comments: data.commentsCount,
    views: data.views,
    timestamp: formatTime(data.createdAt),
    subject: data.subject,
    isSolved: !!data.isSolved,
    status: data.status,
    createdAt: data.createdAt,
  };
}

// Helper to clean filter values
const cleanFilter = (val: any) => {
  if (Array.isArray(val)) val = val[0];
  if (!val || typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed === 'all' || trimmed === '') return undefined;
  return trimmed;
};

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const queryParams = req.query || {};
      const { tag, q, sort, authorId, page, limit, subject, dept } = queryParams;

      // Pagination
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
      const offset = (pageNum - 1) * pageSize;

      const whereClause: any = { 
        status: { [Op.ne]: 'hidden' } 
      };

      const authorIdVal = cleanFilter(authorId);
      if (authorIdVal) {
        whereClause.authorId = authorIdVal;
      }

      // Cleaned filter values
      const subjectVal = cleanFilter(subject);
      const tagVal = cleanFilter(tag);
      const deptVal = cleanFilter(dept);
      const queryVal = cleanFilter(q);

      if (subjectVal) {
        whereClause.subject = { [Op.like]: `%${subjectVal}%` };
      }

      if (queryVal) {
        const searchTerms = queryVal.split(/\s+/).filter(Boolean);
        if (searchTerms.length > 0) {
          const conditions = searchTerms.map(term => ({
            [Op.or]: [
              { title: { [Op.like]: `%${term}%` } },
              { content: { [Op.like]: `%${term}%` } },
            ]
          }));
          whereClause[Op.and] = conditions;
        }
      }

      let orderClause: any = [['createdAt', 'DESC']];
      if (sort === 'votes') {
        orderClause = [['votes', 'DESC']];
      } else if (sort === 'views' || sort === 'hot') {
        orderClause = [['views', 'DESC']];
      }

      const authorInclude: any = {
        model: UserEntity,
        as: 'author',
        attributes: ['name', 'role', 'reputation', 'department'],
        required: false,
      };

      if (deptVal) {
        authorInclude.where = { department: { [Op.like]: `%${deptVal}%` } };
        authorInclude.required = true;
      }

      const tagInclude: any = {
        model: TagEntity,
        as: 'questionTags',
        through: { attributes: [] },
        required: false,
      };

      if (tagVal) {
        tagInclude.where = { name: { [Op.like]: tagVal } };
        tagInclude.required = true;
      }

      const { count, rows } = await QuestionEntity.findAndCountAll({
        where: whereClause,
        include: [
          authorInclude,
          tagInclude,
        ],
        order: orderClause,
        limit: pageSize,
        offset,
        distinct: true,
      });

      const list = rows.map(formatQuestion);
      
      res.status(200).json({
        success: true,
        data: {
          list,
          pagination: {
            page: pageNum,
            limit: pageSize,
            total: count,
            totalPages: Math.ceil(count / pageSize),
          },
        },
      });
    } catch (error) {
      console.error('[API Posts] Error:', error);
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
      const { title, content, subject, tags, authorId } = req.body ?? {};

      const validation = validateCreatePostInput({ title, content, tags });
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
        return;
      }

      if (!authorId) {
        res.status(400).json({
          success: false,
          message: 'Vui lòng đăng nhập để đăng bài',
        });
        return;
      }

      const user = await UserEntity.findByPk(authorId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        return;
      }

      const excerpt = content.substring(0, 180) + (content.length > 180 ? '...' : '');

      const newQuestion = await QuestionEntity.create({
        id: Date.now().toString(),
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

        for (const t of tagsInDb) {
          t.count += 1;
          await t.save();
        }
      }

      user.posts += 1;
      await user.save();

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
