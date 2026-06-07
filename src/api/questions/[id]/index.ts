import { initDb } from '@/server/db';
import {
  Answer,
  AnswerComment,
  AnswerVote,
  initModels,
  Question,
  QuestionVote,
  Tag,
  User,
} from '@/server/models';
import { formatRelativeTime } from '@/server/utils/format';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';
import { Op } from 'sequelize';

async function sumVotes(
  model: typeof QuestionVote | typeof AnswerVote,
  field: string,
  id: string,
): Promise<number> {
  try {
    const votes = await model.findAll({ where: { [field]: id } });
    return votes.reduce((sum, v) => sum + (Number(v.get('value')) || 0), 0);
  } catch (error) {
    console.error(`❌ Lỗi khi tính sumVotes cho ${field}:`, error);
    return 0;
  }
}

export default async function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  // BƯỚC SỬA LỖI: Lấy id một cách thông minh và an toàn hơn
  // Thử lấy 'id' từ req.query, nếu không có thử tìm trong các tham số bổ sung của UmiJS
  const id = (req.query?.id ||
    (req as any).params?.id ||
    req.query?.questionId) as string;

  // KIỂM TRA: Nếu không có id hoặc id bị undefined, chặn lại luôn và báo lỗi 400 thay vì sập 500
  if (!id || id === 'undefined' || id === 'null') {
    console.error(
      '⚠️ CẢNH BÁO: Frontend gọi API lấy chi tiết bài viết nhưng không truyền ID hợp lệ.',
    );
    res.status(400).json({
      success: false,
      message: 'ID bài viết không hợp lệ hoặc không được cung cấp',
    });
    return;
  }

  try {
    await initDb();
    initModels();

    if (!Question || !User || !Tag) {
      throw new Error(
        'Một trong các Model (Question, User, Tag) chưa được định nghĩa đúng.',
      );
    }

    // Lúc này 'id' chắc chắn đã có giá trị chuỗi, không sợ bị sập lỗi 'undefined' nữa
    const record = await Question.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role', 'reputation', 'avatar'],
          required: false,
        },
        {
          model: Tag,
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!record) {
      res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy bài viết' });
      return;
    }

    const author = record.get('author') as any;

    // Xử lý an toàn nếu Tags bị lỗi undefined
    const rawTags = (record.get('Tags') || record.get('tags') || []) as any[];
    const tags = rawTags.map((tag) => ({
      id: tag.id ?? tag.get?.('id'),
      name: tag.name ?? tag.get?.('name'),
      slug: tag.slug ?? tag.get?.('slug'),
      color: tag.color ?? tag.get?.('color'),
    }));

    const votes = await sumVotes(QuestionVote, 'question_id', id);

    const authHeader = req.headers?.authorization as string | undefined;
    let userVote = 0;
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const match = /^(?:mock_token_|db_token_)(.+)$/.exec(token);
      if (match) {
        try {
          const existing = await QuestionVote.findOne({
            where: { question_id: id, user_id: match[1] },
          });
          userVote = existing ? Number(existing.get('value')) : 0;
        } catch (e) {
          console.error('❌ Lỗi user vote:', e);
        }
      }
    }

    const answerRecords = await Answer.findAll({
      where: { question_id: id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role', 'reputation', 'avatar'],
          required: false,
        },
      ],
      order: [
        ['is_accepted', 'DESC'],
        ['created_at', 'ASC'],
      ],
    });

    const answerIds = answerRecords.map((a) => a.get('id') as string);
    const answerComments =
      answerIds.length > 0
        ? await AnswerComment.findAll({
            where: { answer_id: { [Op.in]: answerIds }, parent_id: null },
            order: [['created_at', 'ASC']],
          })
        : [];

    const commentAuthorIds = [
      ...new Set(
        answerComments.map((c) => c.get('author_id') as string).filter(Boolean),
      ),
    ];
    const commentAuthors =
      commentAuthorIds.length > 0
        ? await User.findAll({
            where: { id: { [Op.in]: commentAuthorIds } },
            attributes: ['id', 'name'],
          })
        : [];
    const authorMap = new Map(
      commentAuthors.map((u) => [
        u.get('id') as string,
        u.get('name') as string,
      ]),
    );

    const commentsByAnswer = new Map<string, any[]>();
    for (const comment of answerComments) {
      const answerId = comment.get('answer_id') as string;
      const list = commentsByAnswer.get(answerId) || [];
      const authorId = comment.get('author_id') as string;

      const safeTime = (time: any) => {
        try {
          return time ? formatRelativeTime(time) : 'Vừa xong';
        } catch {
          return 'Vừa xong';
        }
      };

      list.push({
        id: comment.get('id'),
        author: authorMap.get(authorId) || 'Ẩn danh',
        authorId,
        timestamp: safeTime(comment.get('created_at')),
        content: comment.get('content'),
        votes: 0,
      });
      commentsByAnswer.set(answerId, list);
    }

    const answers = await Promise.all(
      answerRecords.map(async (answer) => {
        const answerAuthor = answer.get('author') as any;
        const answerId = answer.get('id') as string;
        const answerVotes = await sumVotes(AnswerVote, 'answer_id', answerId);
        const authorName = answerAuthor?.name || 'Ẩn danh';

        const safeTime = (time: any) => {
          try {
            return time ? formatRelativeTime(time) : 'Vừa xong';
          } catch {
            return 'Vừa xong';
          }
        };

        return {
          id: answerId,
          author: authorName,
          authorId: answerAuthor?.id || answer.get('author_id'),
          authorRole: answerAuthor?.role || 'student',
          authorRep: answerAuthor?.reputation ?? 0,
          avatar: authorName.charAt(0),
          timestamp: safeTime(answer.get('created_at')),
          votes: answerVotes,
          isBest: Boolean(answer.get('is_accepted')),
          content: answer.get('content'),
          replies: commentsByAnswer.get(answerId) || [],
        };
      }),
    );

    const safeQuestionTime = () => {
      try {
        return record.get('created_at')
          ? formatRelativeTime(record.get('created_at') as string)
          : 'Vừa xong';
      } catch {
        return 'Vừa xong';
      }
    };

    const question = {
      id: record.get('id'),
      title: record.get('title'),
      excerpt: record.get('excerpt'),
      content: record.get('content') || record.get('excerpt'),
      author: author?.name || 'Ẩn danh',
      authorId: author?.id || record.get('author_id'),
      authorRole: author?.role || 'student',
      authorRep: author?.reputation ?? 0,
      timestamp: safeQuestionTime(),
      tags,
      subject: record.get('subject') || '',
      votes,
      views: 0,
      isSolved: Boolean(record.get('is_solved')),
      userVote,
    };

    res.status(200).json({ success: true, data: { question, answers } });
  } catch (err: unknown) {
    // 🔥 Dòng này in lỗi thật ra terminal để bạn xử lý triệt để cấu trúc DB
    console.error('🚨 LỖI TẠI FILE LẤY CHI TIẾT BÀI VIẾT (GET):', err);
    const message = err instanceof Error ? err.message : 'Lỗi truy vấn';
    res.status(500).json({ success: false, message });
  }
}
