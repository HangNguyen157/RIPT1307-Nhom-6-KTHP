import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { QuestionEntity, UserEntity, CommentEntity } from '@/server/models/entities';
import { formatTime } from '../index';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();
  const id = req.query?.id as string;

  if (req.method === 'GET') {
    try {
      const comments = await CommentEntity.findAll({
        where: { questionId: id, parentId: null },
        include: [
          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },
          {
            model: CommentEntity,
            as: 'replies',
            include: [{ model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] }]
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      const list = comments.map((c: any) => ({
        id: c.id,
        questionId: c.questionId,
        parentId: c.parentId,
        author: c.author ? c.author.name : 'Unknown',
        authorId: c.authorId,
        authorRole: c.author ? c.author.role : 'student',
        authorRep: c.author ? c.author.reputation : 0,
        avatar: c.author ? c.author.name.charAt(0) : 'U',
        timestamp: formatTime(c.createdAt),
        votes: c.votes,
        isBest: c.isBest,
        content: c.content,
        replies: c.replies ? c.replies.map((r: any) => ({
          id: r.id,
          author: r.author ? r.author.name : 'Unknown',
          authorId: r.authorId,
          timestamp: formatTime(r.createdAt),
          content: r.content,
          votes: r.votes
        })) : []
      }));

      res.status(200).json({ success: true, data: list });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách bình luận', error: String(error) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { content, authorId, parentId } = req.body ?? {};

      if (!content || !authorId) {
        res.status(400).json({ success: false, message: 'Thiếu nội dung bình luận hoặc tác giả' });
        return;
      }

      const question = await QuestionEntity.findByPk(id);
      if (!question) {
        res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
        return;
      }

      const user = await UserEntity.findByPk(authorId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Tác giả không tồn tại' });
        return;
      }

      const newComment = await CommentEntity.create({
        id: Date.now().toString(),
        questionId: id,
        parentId: parentId || null,
        authorId,
        votes: 0,
        isBest: false,
        content,
        createdAt: new Date()
      });

      question.commentsCount += 1;
      await question.save();

      user.answers += 1;
      await user.save();

      try {
        const { notifyNewReply } = await import('@/server/utils/email');
        if (parentId) {
          const parentComment = await CommentEntity.findByPk(parentId, {
            include: [{ model: UserEntity, as: 'author', attributes: ['email'] }]
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
        console.error('[Email] Lỗi gửi email thông báo bình luận mới:', err);
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
          replies: []
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi thêm bình luận', error: String(error) });
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

      const comment = await CommentEntity.findByPk(commentId);
      if (!comment) {
        res.status(404).json({ success: false, message: 'Bình luận không tồn tại' });
        return;
      }

      if (isBest) {
        await CommentEntity.update(
          { isBest: false },
          { where: { questionId: id } }
        );
      }

      comment.isBest = !!isBest;
      await comment.save();

      const question = await QuestionEntity.findByPk(id);
      if (question) {
        question.isSolved = !!isBest;
        await question.save();
      }

      res.status(200).json({ success: true, message: 'Cập nhật câu trả lời hay nhất thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi cập nhật bình luận', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}

