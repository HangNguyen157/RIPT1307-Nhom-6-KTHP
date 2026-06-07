import { initDb } from '@/server/db';
import { initModels, QuestionComment } from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { randomUUID } from 'crypto';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  await initDb();
  await initModels();

  try {
    const questionId = req.query?.id as string;
    const { authorId, content, parentId } = req.body ?? {};
    if (!questionId || !authorId || !content) {
      res.status(400).json({
        success: false,
        message: 'questionId, authorId và content là bắt buộc',
      });
      return;
    }

    const comment = await QuestionComment.create({
      id: randomUUID(),
      question_id: questionId,
      parent_id: parentId || null,
      author_id: authorId,
      content,
    } as any);

    res.status(201).json({ success: true, data: { id: comment.get('id') } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Thêm bình luận thất bại';
    res.status(500).json({ success: false, message });
  }
}
