import { initDb, sequelize } from '@/server/db';
import { requireAuthUser } from '@/server/middlewares/auth';
import { Answer, initModels, Question } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'PATCH') {
    res.status(405).json({ success: false, message: 'Method not allowed', data: null });
    return;
  }

  const answerId = req.query?.id as string;
  if (!answerId) {
    res
      .status(400)
      .json({ success: false, message: 'Thiếu id câu trả lời', data: null });
    return;
  }

  const auth = await requireAuthUser(req);
  if (!auth) {
    res
      .status(401)
      .json({ success: false, message: 'Vui lòng đăng nhập', data: null });
    return;
  }

  await initDb();
  initModels();

  const t = await sequelize.transaction();
  try {
    const answer = await Answer.findByPk(answerId, { transaction: t });
    if (!answer) {
      await t.rollback();
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy câu trả lời', data: null });
      return;
    }

    const questionId = answer.get('question_id') as string;
    const question = await Question.findByPk(questionId, { transaction: t });
    if (!question) {
      await t.rollback();
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết', data: null });
      return;
    }

    const questionAuthorId = question.get('author_id') as string;
    if (questionAuthorId !== auth.userId && auth.role !== 'admin') {
      await t.rollback();
      res.status(403).json({
        success: false,
        message: 'Chỉ người đặt câu hỏi mới có thể chọn câu trả lời hay nhất',
        data: null,
      });
      return;
    }

    await Answer.update(
      { is_accepted: 0 },
      { where: { question_id: questionId }, transaction: t },
    );

    answer.set('is_accepted', 1);
    await answer.save({ transaction: t });

    question.set('is_solved', 1);
    question.set('accepted_answer_id', answerId);
    await question.save({ transaction: t });

    await t.commit();
    res.status(200).json({
      success: true,
      message: 'Đã chọn câu trả lời hay nhất',
      data: { id: answerId },
    });
  } catch (err: unknown) {
    await t.rollback();
    const message =
      err instanceof Error ? err.message : 'Chọn câu trả lời thất bại';
    res.status(500).json({ success: false, message, data: null });
  }
}
