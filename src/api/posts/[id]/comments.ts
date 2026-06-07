import { initDatabase } from '@/server/db';
import { requireAuth, requireRole } from '@/server/middlewares/auth';
import {
  CommentEntity,
  QuestionEntity,
  UserEntity,
} from '@/server/models/entities';
import { notifyNewReply } from '@/server/utils/email';
import { validateCommentInput } from '@/utils/validation';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { formatTime } from '../index';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();

  // Extract id from query (UmiJS passes dynamic segments as query params)
  let id = req.query?.id as string;

  // If not in query, try to extract from URL path
  if (!id && req.url) {
    const match = req.url.match(/\/api\/posts\/([^/?]+)/);
    id = match ? match[1] : undefined;
  }

  if (req.method === 'GET') {
    try {
      const comments = await CommentEntity.findAll({
        where: { questionId: id, parentId: null },
        include: [
          {
            model: UserEntity,
            as: 'author',
            attributes: ['name', 'role', 'reputation'],
          },
          {
            model: CommentEntity,
            as: 'replies',
            include: [
              {
                model: UserEntity,
                as: 'author',
                attributes: ['name', 'role', 'reputation'],
              },
            ],
          },
        ],
        order: [['createdAt', 'ASC']],
      });

      const list = comments.map((c: any) => ({
        id: c.id,
        questionId: c.questionId,
        parentId: c.parentId,
        author: c.author ? c.author.name : 'Unknown',
        authorId: c.authorId,
        authorRole: c.author ? c.author.role : 'sinhvien',
        authorRep: c.author ? c.author.reputation : 0,
        avatar: c.author ? c.author.name.charAt(0) : 'U',
        timestamp: formatTime(c.createdAt),
        votes: c.votes,
        isBest: c.isBest,
        content: c.content,
        replies: c.replies
          ? c.replies.map((r: any) => ({
              id: r.id,
              author: r.author ? r.author.name : 'Unknown',
              authorId: r.authorId,
              timestamp: formatTime(r.createdAt),
              content: r.content,
              votes: r.votes,
            }))
          : [],
      }));

      res.status(200).json({ success: true, data: list });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách bình luận',
        error: String(error),
      });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { content, parentId } = req.body ?? {};

      // Validate input
      const validation = validateCommentInput({ content });
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
        return;
      }

      // Danh tính người bình luận lấy từ JWT, không tin vào body
      const auth = await requireAuth(req);
      if (!auth) {
        res
          .status(401)
          .json({ success: false, message: 'Vui lòng đăng nhập để bình luận' });
        return;
      }
      const authorId = auth.userId;

      const question = await QuestionEntity.findByPk(id);
      if (!question) {
        res
          .status(404)
          .json({ success: false, message: 'Bài viết không tồn tại' });
        return;
      }

      const user = await UserEntity.findByPk(authorId);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'Tác giả không tồn tại' });
        return;
      }

      const newComment = await CommentEntity.create({
        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        questionId: id,
        parentId: parentId || null,
        authorId,
        votes: 0,
        isBest: false,
        content: content.trim(),
        createdAt: new Date(),
      });

      // Tăng đếm atomic, tránh lost update
      await question.increment('commentsCount');
      await user.increment('answers');

      try {
        if (parentId) {
          const parentComment = await CommentEntity.findByPk(parentId, {
            include: [
              { model: UserEntity, as: 'author', attributes: ['email'] },
            ],
          });
          if (parentComment && parentComment.author) {
            await notifyNewReply(id, parentComment.author.email);
          }
        } else {
          const questionAuthor = await UserEntity.findByPk(question.authorId);
          if (questionAuthor) {
            await notifyNewReply(id, questionAuthor.email);
          }
        }
      } catch (err) {
        console.error('[Email] Lỗi gửi email thông báo:', err);
      }

      res.status(201).json({
        success: true,
        message: 'Thêm bình luận thành công',
        data: {
          id: newComment.id,
          author: user.name,
          authorId: user.id,
          authorRole: user.role,
          authorRep: user.reputation,
          avatar: user.name.charAt(0),
          timestamp: 'Vừa xong',
          votes: 0,
          isBest: false,
          content: newComment.content,
          replies: [],
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi thêm bình luận',
        error: String(error),
      });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { commentId, isBest } = req.body ?? {};
      if (!commentId) {
        res.status(400).json({ success: false, message: 'Thiếu commentId' });
        return;
      }

      const question = await QuestionEntity.findByPk(id);
      if (!question) {
        res
          .status(404)
          .json({ success: false, message: 'Bài viết không tồn tại' });
        return;
      }

      // Tác giả bài viết hoặc người kiểm duyệt (admin/giảng viên)
      // được chọn câu trả lời hay nhất
      const auth = await requireAuth(req);
      const isModerator = requireRole(auth, ['admin', 'giangvien']);
      if (!auth || (!isModerator && auth.userId !== question.authorId)) {
        res.status(403).json({
          success: false,
          message:
            'Chỉ tác giả bài viết hoặc giảng viên/quản trị viên mới được chọn câu trả lời hay nhất',
        });
        return;
      }

      const comment = await CommentEntity.findByPk(commentId);
      if (!comment || comment.questionId !== id) {
        res
          .status(404)
          .json({ success: false, message: 'Bình luận không thuộc bài viết này' });
        return;
      }

      if (isBest) {
        await CommentEntity.update(
          { isBest: false },
          { where: { questionId: id } },
        );
      }

      comment.isBest = !!isBest;
      await comment.save();

      // Tính lại isSolved dựa trên việc còn câu trả lời hay nhất nào không
      const bestCount = await CommentEntity.count({
        where: { questionId: id, isBest: true },
      });
      question.isSolved = bestCount > 0;
      await question.save();

      res.status(200).json({
        success: true,
        message: 'Cập nhật câu trả lời hay nhất thành công',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi cập nhật bình luận',
        error: String(error),
      });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
