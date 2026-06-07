import { initDb } from '@/server/db';
import { requireAuth } from '@/server/middlewares/auth';
import { initModels, QuestionVote } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { randomUUID } from 'crypto';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const questionId = req.query?.id as string;
  const { value } = req.body ?? {};

  if (!questionId || (value !== 1 && value !== -1)) {
    res
      .status(400)
      .json({ success: false, message: 'value phải là 1 hoặc -1' });
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

    const existing = await QuestionVote.findOne({
      where: { question_id: questionId, user_id: auth.userId },
    });

    if (existing) {
      if (Number(existing.get('value')) === value) {
        await existing.destroy();
        res.status(200).json({ success: true, data: { value: 0 } });
        return;
      }
      existing.set('value', value);
      await existing.save();
      res.status(200).json({ success: true, data: { value } });
      return;
    }

    await QuestionVote.create({
      id: randomUUID(),
      question_id: questionId,
      user_id: auth.userId,
      value,
    } as any);

    res.status(201).json({ success: true, data: { value } });
  } catch (err: unknown) {
    console.error('🚨 LỖI TẠI FILE VOTE BÀI VIẾT (POST):', err);
    const message = err instanceof Error ? err.message : 'Bỏ phiếu thất bại';
    res.status(500).json({ success: false, message });
  }
}
