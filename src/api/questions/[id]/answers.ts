import { initDb } from '@/server/db';
import { requireAuth } from '@/server/middlewares/auth';
import { Answer, initModels, Question, User } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { randomUUID } from 'crypto';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const questionId = req.query?.id as string;
  const { content } = req.body ?? {};

  if (!questionId || !content?.trim()) {
    res
      .status(400)
      .json({ success: false, message: 'Nội dung câu trả lời là bắt buộc' });
    return;
  }

  const auth = requireAuth(req);
  if (!auth) {
    res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
    return;
  }

  try {
    await initDb();
    initModels();

    const question = await Question.findByPk(questionId);
    if (!question) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết' });
      return;
    }

    const answer = await Answer.create({
      id: randomUUID(),
      question_id: questionId,
      author_id: auth.userId,
      content: content.trim(),
    } as any);

    await User.increment('answers_count', { where: { id: auth.userId } });

    res.status(201).json({ success: true, data: { id: answer.get('id') } });
  } catch (err: unknown) {
    console.error('🚨 LỖI TẠI FILE ĐĂNG CÂU TRẢ LỜI (POST):', err);
    const message =
      err instanceof Error ? err.message : 'Đăng câu trả lời thất bại';
    res.status(500).json({ success: false, message });
  }
}
