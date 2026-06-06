import {
  getCommentsByQuestionId,
  getQuestionById,
  MOCK_QUESTIONS,
} from '@/server/seed/questions';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  const id = req.query?.id as string;

  if (req.method === 'GET') {
    const question = getQuestionById(id);
    if (!question) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết' });
      return;
    }
    const comments = getCommentsByQuestionId(id);
    res.status(200).json({ success: true, data: { question, comments } });
    return;
  }

  if (req.method === 'DELETE') {
    const exists = MOCK_QUESTIONS.some((q) => q.id === id);
    if (!exists) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết' });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: 'Đã xóa bài viết — @todo cascade DB' });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
