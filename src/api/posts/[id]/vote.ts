import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op } from 'sequelize';
import { initDatabase } from '@/server/db';
import { requireAuth } from '@/server/middlewares/auth';
import { VoteEntity, QuestionEntity, CommentEntity, UserEntity } from '@/server/models/entities';

/** Cộng/trừ reputation, không cho âm. Không cộng khi tự vote bài của mình. */
async function addReputation(author: any, voterId: string, delta: number) {
  if (!author || author.id === voterId) return;
  const newRep = Math.max(0, (author.reputation || 0) + delta);
  await author.update({ reputation: newRep });
}

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();
  let id = req.query?.id as string;

  // If not in query, try to extract from URL path
  if (!id && req.url) {
    const match = req.url.match(/\/api\/posts\/([^/?]+)/);
    id = match ? match[1] : undefined;
  }

  if (req.method === 'GET') {
    try {
      // Lấy danh sách comment của bài để lọc vote ngay trong query
      const comments = await CommentEntity.findAll({
        where: { questionId: id },
        attributes: ['id'],
      });
      const commentIds = comments.map((c) => c.id);

      // Vote của chính bài viết + vote của các comment thuộc bài viết
      const postVotes = await VoteEntity.findAll({
        where: {
          [Op.or]: [
            { targetId: id, targetType: 'question' },
            ...(commentIds.length
              ? [{ targetType: 'comment', targetId: { [Op.in]: commentIds } }]
              : []),
          ],
        },
      });

      res.status(200).json({
        success: true,
        data: postVotes.map((v: any) => ({
          userId: v.userId,
          targetId: v.targetId,
          targetType: v.targetType,
          value: v.value,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy dữ liệu vote',
        error: String(error),
      });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { targetType, targetId, value } = req.body ?? {};

      // Danh tính người vote lấy từ JWT, không tin vào body
      const auth = await requireAuth(req);
      if (!auth) {
        res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để vote' });
        return;
      }
      const userId = auth.userId;

      if (!['question', 'comment'].includes(targetType)) {
        res.status(400).json({ success: false, message: 'targetType phải là question hoặc comment' });
        return;
      }

      const parsedValue = parseInt(value, 10);
      if (parsedValue !== 1 && parsedValue !== -1) {
        res.status(400).json({ success: false, message: 'value phải là 1 hoặc -1' });
        return;
      }

      const voteTargetId = targetId || id;
      const voteValue = parsedValue;

      let targetInstance: any = null;
      if (targetType === 'question') {
        targetInstance = await QuestionEntity.findByPk(voteTargetId);
      } else {
        targetInstance = await CommentEntity.findByPk(voteTargetId);
      }

      if (!targetInstance) {
        res.status(404).json({ success: false, message: 'Đối tượng được vote không tồn tại' });
        return;
      }

      const author = await UserEntity.findByPk(targetInstance.authorId);

      const existingVote = await VoteEntity.findOne({
        where: { userId, targetId: voteTargetId, targetType }
      });

      if (!existingVote) {
        // Vote mới
        await VoteEntity.create({
          id: `${Date.now()}_${userId}`,
          userId,
          targetId: voteTargetId,
          targetType,
          value: voteValue
        });
        await targetInstance.increment('votes', { by: voteValue });
        await addReputation(author, userId, voteValue * 10);
      } else if (existingVote.value === voteValue) {
        // Vote lại cùng chiều → hủy vote
        await existingVote.destroy();
        await targetInstance.increment('votes', { by: -voteValue });
        await addReputation(author, userId, -voteValue * 10);
      } else {
        // Đổi chiều vote
        existingVote.value = voteValue;
        await existingVote.save();
        const diff = voteValue * 2;
        await targetInstance.increment('votes', { by: diff });
        await addReputation(author, userId, diff * 10);
      }

      await targetInstance.reload();

      res.status(200).json({
        success: true,
        message: 'Cập nhật vote thành công',
        data: { votes: targetInstance.votes }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xử lý vote', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
