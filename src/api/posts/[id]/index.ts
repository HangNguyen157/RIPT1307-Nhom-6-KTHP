import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { QuestionEntity, UserEntity, TagEntity, CommentEntity } from '@/server/models/entities';
import { formatQuestion } from '../index';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();
  const id = req.query?.id as string;

  if (req.method === 'GET') {
    try {
      const question = await QuestionEntity.findOne({
        where: { id },
        include: [
          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },
          { model: TagEntity, as: 'questionTags', through: { attributes: [] } }
        ]
      });

      if (!question) {
        res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        return;
      }

      question.views += 1;
      await question.save();

      const formattedQuestion = formatQuestion(question);

      res.status(200).json({ 
        success: true, 
        data: { 
          question: formattedQuestion 
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết bài viết', error: String(error) });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const question = await QuestionEntity.findByPk(id);
      if (!question) {
        res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        return;
      }

      await (question as any).setQuestionTags([]);
      await CommentEntity.destroy({ where: { questionId: id } });
      await question.destroy();

      res.status(200).json({ success: true, message: 'Đã xóa bài viết thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xóa bài viết', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
