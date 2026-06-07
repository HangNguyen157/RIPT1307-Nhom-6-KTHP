import { initDatabase } from '@/server/db';
import { requireAuth, requireRole } from '@/server/middlewares/auth';
import {
  CommentEntity,
  QuestionEntity,
  TagEntity,
  UserEntity,
} from '@/server/models/entities';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { formatQuestion } from '../index';

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
      const question = await QuestionEntity.findOne({
        where: { id },
        include: [
          {
            model: UserEntity,
            as: 'author',
            attributes: ['name', 'role', 'reputation'],
          },
          { model: TagEntity, as: 'questionTags', through: { attributes: [] } },
        ],
      });

      if (!question) {
        res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy bài viết' });
        return;
      }

      // Tăng view atomic, tránh lost update khi nhiều người xem cùng lúc
      await question.increment('views');
      question.views += 1; // phản ánh giá trị mới trong response

      const formattedQuestion = formatQuestion(question);

      res.status(200).json({
        success: true,
        data: {
          question: formattedQuestion,
        },
      });
    } catch (error) {
      console.error('API Error Details:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy chi tiết bài viết',
        error: errorMsg,
      });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      // Kiểm tra id
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Thiếu ID bài viết',
        });
        return;
      }

      // Tìm bài viết
      const question = await QuestionEntity.findByPk(id);
      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết',
        });
        return;
      }

      // Chỉ người kiểm duyệt (admin/giảng viên) hoặc chính tác giả mới được xóa bài
      const auth = await requireAuth(req);
      const isModerator = requireRole(auth, ['admin', 'giangvien']);
      if (!auth || (!isModerator && auth.userId !== question.authorId)) {
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xóa bài viết này',
        });
        return;
      }

      // Xóa các comment của bài viết
      await CommentEntity.destroy({ where: { questionId: id } });

      // Xóa các tag liên kết
      await (question as any).setQuestionTags([]);

      // Xóa bài viết khỏi database
      await question.destroy();

      res.status(200).json({
        success: true,
        message: 'Đã xóa bài viết thành công',
      });
    } catch (error) {
      console.error('DELETE Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa bài viết',
        error: String(error),
      });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
