import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { QuestionEntity, UserEntity, TagEntity } from '@/server/models/entities';
import { Op } from 'sequelize';

export function formatTime(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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
    authorRole: q.author ? q.author.role : 'student',
    authorRep: q.author ? q.author.reputation : 0,
    tags: q.questionTags ? q.questionTags.map((t: any) => t.name) : [],
    votes: q.votes,
    comments: q.commentsCount,
    views: q.views,
    timestamp: formatTime(q.createdAt),
    subject: q.subject,
    isSolved: q.isSolved,
    status: q.status,
    createdAt: q.createdAt
  };
}

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  if (req.method === 'GET') {
    try {
      const { tag, q, sort, authorId } = req.query ?? {};
      
      const whereClause: any = { status: { [Op.ne]: 'hidden' } };

      if (authorId) {
        whereClause.authorId = authorId;
      }

      if (typeof q === 'string' && q.trim()) {
        const keyword = `%${q.trim()}%`;
        whereClause[Op.or] = [
          { title: { [Op.like]: keyword } },
          { content: { [Op.like]: keyword } }
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
        through: { attributes: [] }
      };

      if (typeof tag === 'string' && tag.trim()) {
        tagInclude.where = { name: tag.trim() };
      }

      const questions = await QuestionEntity.findAll({
        where: whereClause,
        include: [
          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },
          tagInclude
        ],
        order: orderClause
      });

      const list = questions.map(formatQuestion);

      res.status(200).json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách bài viết', error: String(error) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { title, content, subject, tags, authorId } = req.body ?? {};
      
      if (!title || !content || !authorId) {
        res.status(400).json({ success: false, message: 'Thiếu thông tin tiêu đề, nội dung hoặc người đăng' });
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
        title,
        excerpt,
        content,
        authorId,
        votes: 0,
        commentsCount: 0,
        views: 0,
        subject,
        isSolved: false,
        status: 'active',
        createdAt: new Date()
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
        data: { id: newQuestion.id }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi tạo bài viết', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
