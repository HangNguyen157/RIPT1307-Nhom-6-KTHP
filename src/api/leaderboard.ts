import { initDb } from '@/server/db';
import {
  Answer,
  AnswerVote,
  initModels,
  Question,
  QuestionVote,
  User,
} from '@/server/models';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  await initDb();
  await initModels();

  if (req.method === 'GET') {
    try {
      // Fetch all active users
      const users = await User.findAll({
        where: { status: 'active' },
        raw: true,
        attributes: ['id', 'name', 'role', 'department', 'created_at'],
      });

      if (!users.length) {
        res.status(200).json({ success: true, data: { list: [] } });
        return;
      }

      // For each user, calculate posts, answers, and votes
      const leaderboardData = await Promise.all(
        users.map(async (user) => {
          // Count posts (questions)
          const postsCount = await Question.count({
            where: { author_id: user.id },
          });

          // Count answers
          const answersCount = await Answer.count({
            where: { author_id: user.id },
          });

          // Count votes received on questions (get question_ids first)
          const userQuestions = await Question.findAll({
            where: { author_id: user.id },
            attributes: ['id'],
            raw: true,
          });
          const questionIds = userQuestions.map((q) => q.id);
          const questionVotes = questionIds.length
            ? await QuestionVote.count({
                where: { question_id: questionIds },
              })
            : 0;

          // Count votes received on answers (get answer_ids first)
          const userAnswers = await Answer.findAll({
            where: { author_id: user.id },
            attributes: ['id'],
            raw: true,
          });
          const answerIds = userAnswers.map((a) => a.id);
          const answerVotes = answerIds.length
            ? await AnswerVote.count({
                where: { answer_id: answerIds },
              })
            : 0;

          const totalVotes = questionVotes + answerVotes;
          const reputation = user.reputation || 0;

          // Calculate rank score: reputation (weight 1) + answers (weight 2) + posts (weight 1) + votes (weight 0.5)
          const rankScore =
            reputation * 1 +
            answersCount * 2 +
            postsCount * 1 +
            totalVotes * 0.5;

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            dept: user.department || 'N/A',
            joined: new Date(user.created_at).getFullYear().toString(),
            rep: reputation,
            posts: postsCount,
            answers: answersCount,
            votes: totalVotes,
            rankScore,
          };
        }),
      );

      // Sort by rankScore descending
      leaderboardData.sort((a, b) => b.rankScore - a.rankScore);

      res.status(200).json({ success: true, data: { list: leaderboardData } });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Lỗi lấy leaderboard';
      console.error('Leaderboard error:', err);
      res.status(500).json({ success: false, message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
