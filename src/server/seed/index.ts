import {
  CommentEntity,
  QuestionEntity,
  TagEntity,
  UserEntity,
} from '../models/entities';
import { hashPassword } from '../models/User';
import { MOCK_COMMENTS_BY_QUESTION, MOCK_QUESTIONS } from './questions';
import { MOCK_TAGS } from './tags';
import { MOCK_ADMIN_USERS } from './users';

export { MOCK_COMMENTS_BY_QUESTION, MOCK_QUESTIONS } from './questions';
export { MOCK_TAGS, TAG_CATEGORIES } from './tags';
export { MOCK_ADMIN_USERS, MOCK_USERS } from './users';

export async function seedDatabase() {
  try {
    // 1. Đồng bộ cấu trúc bảng
    await UserEntity.sequelize?.sync({});
    console.log('[Database] Đồng bộ các bảng thành công.');

    // 2. Seed Users
    const userCount = await UserEntity.count();
    if (userCount === 0) {
      console.log('[Database] Bảng Users trống, bắt đầu seed dữ liệu mẫu...');
      for (const u of MOCK_ADMIN_USERS) {
        await UserEntity.create({
          id: u.id,
          name: u.name,
          email: u.email,
          password: await hashPassword('12345678'), // Mật khẩu mặc định cho tất cả user
          role: u.role,
          department: u.department || 'Công Nghệ Thông Tin',
          major: u.major || '',
          studentId: u.studentId || '',
          avatar: u.avatar || u.name.charAt(0),
          bio: u.bio || '',
          reputation: u.reputation,
          posts: u.posts,
          answers: u.answers,
          votes: u.votes,
          followers: u.followers,
          following: u.following,
          joinDate: u.joinDate || new Date().toISOString().split('T')[0],
          badges: u.badges || [],
          status: u.status || 'active',
        });
      }
      console.log('[Database] Seed bảng Users thành công.');
    }

    // 3. Seed Tags
    console.log('[Database] Đang kiểm tra dữ liệu Tags...');
    for (const t of MOCK_TAGS) {
      const [tag, created] = await TagEntity.findOrCreate({
        where: { name: t.name },
        defaults: {
          count: t.count,
          color: t.color,
          category: t.category,
          desc: t.desc,
        },
      });
      if (created) {
        console.log(`[Database] Đã tạo tag mới: ${t.name}`);
      }
    }
    console.log('[Database] Hoàn tất seed bảng Tags.');

    // 4. Seed Questions
    const questionCount = await QuestionEntity.count();
    if (questionCount === 0) {
      console.log('[Database] Bảng Questions trống, bắt đầu seed...');
      for (const q of MOCK_QUESTIONS) {
        const question = await QuestionEntity.create({
          id: q.id,
          title: q.title,
          excerpt: q.excerpt,
          content: q.content || q.excerpt,
          authorId: q.authorId || '2',
          votes: q.votes,
          commentsCount: q.comments,
          views: q.views,
          subject: q.subject,
          isSolved: q.isSolved || false,
          status: q.status || 'active',
          createdAt: q.createdAt
            ? new Date(q.createdAt.split('/').reverse().join('-'))
            : new Date(),
        });

        // Liên kết các tag
        if (q.tags && q.tags.length > 0) {
          const tagsInDb = await TagEntity.findAll({ where: { name: q.tags } });
          await (question as any).setQuestionTags(tagsInDb);
        }
      }
      console.log('[Database] Seed bảng Questions thành công.');
    }

    // 5. Seed Comments
    const commentCount = await CommentEntity.count();
    if (commentCount === 0) {
      console.log('[Database] Bảng Comments trống, bắt đầu seed...');
      for (const qId of Object.keys(MOCK_COMMENTS_BY_QUESTION)) {
        const comments = MOCK_COMMENTS_BY_QUESTION[qId];
        for (const c of comments) {
          const parentComment = await CommentEntity.create({
            id: c.id,
            questionId: qId,
            parentId: null,
            authorId: c.authorId || '2',
            votes: c.votes,
            isBest: c.isBest || false,
            content: c.content,
            createdAt: new Date(),
          });

          // Seed replies
          if (c.replies && c.replies.length > 0) {
            for (const r of c.replies) {
              await CommentEntity.create({
                id: r.id,
                questionId: qId,
                parentId: parentComment.id,
                authorId: r.authorId || '4',
                votes: r.votes,
                isBest: false,
                content: r.content,
                createdAt: new Date(),
              });
            }
          }
        }
      }
      console.log('[Database] Seed bảng Comments thành công.');
    }
  } catch (error) {
    console.error('[Database] Lỗi trong quá trình seed database:', error);
  }
}
