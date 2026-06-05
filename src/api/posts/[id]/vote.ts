import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { initDatabase } from '@/server/db';
import { VoteEntity, QuestionEntity, CommentEntity, UserEntity } from '@/server/models/entities';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDatabase();
  const id = req.query?.id as string;

  if (req.method === 'POST') {
    try {
      const { targetType, targetId, userId, value } = req.body ?? {};

      if (!targetType || !userId || !value) {
        res.status(400).json({ success: false, message: 'Thiếu thông tin targetType, userId hoặc value' });
        return;
      }

      const voteTargetId = targetId || id;
      const voteValue = parseInt(value, 10) === 1 ? 1 : -1;

      let targetInstance: any = null;
      if (targetType === 'question') {
        targetInstance = await QuestionEntity.findByPk(voteTargetId);
      } else if (targetType === 'comment') {
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

      let finalVoteValue = targetInstance.votes;

      if (!existingVote) {
        await VoteEntity.create({
          id: Date.now().toString(),
          userId,
          targetId: voteTargetId,
          targetType,
          value: voteValue
        });

        targetInstance.votes += voteValue;
        await targetInstance.save();

        if (author) {
          author.reputation += voteValue * 10;
          await author.save();
        }

        finalVoteValue = targetInstance.votes;
      } else if (existingVote.value === voteValue) {
        await existingVote.destroy();

        targetInstance.votes -= voteValue;
        await targetInstance.save();

        if (author) {
          author.reputation -= voteValue * 10;
          await author.save();
        }

        finalVoteValue = targetInstance.votes;
      } else {
        existingVote.value = voteValue;
        await existingVote.save();

        const diff = voteValue * 2;
        targetInstance.votes += diff;
        await targetInstance.save();

        if (author) {
          author.reputation += diff * 10;
          await author.save();
        }

        finalVoteValue = targetInstance.votes;
      }

      res.status(200).json({
        success: true,
        message: 'Cập nhật vote thành công',
        data: { votes: finalVoteValue }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xử lý vote', error: String(error) });
    }
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
