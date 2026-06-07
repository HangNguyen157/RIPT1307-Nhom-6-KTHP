import { sequelize } from '../db';
import {
  Answer,
  AnswerComment,
  AnswerVote,
  Bookmark,
  initModels,
  Question,
  QuestionComment,
  QuestionTag,
  QuestionVote,
  Tag,
  User,
} from '../models';
import { randomUUID } from 'crypto';
import type { Transaction } from 'sequelize';
import type { AuthContext } from '../middlewares/auth';
import { canModifyOwnOrAdmin } from '../middlewares/auth';

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function logSequelizeError(step: string, err: unknown): void {
  console.error(`[questionService] FAILED at step: ${step}`);
  if (err instanceof Error) {
    console.error('message:', err.message);
    console.error('stack:', err.stack);
  }
  const anyErr = err as {
    parent?: unknown;
    original?: unknown;
    sql?: string;
    fields?: unknown;
    errors?: unknown;
  };
  if (anyErr?.parent) console.error('parent:', anyErr.parent);
  if (anyErr?.original) console.error('original:', anyErr.original);
  if (anyErr?.sql) console.error('sql:', anyErr.sql);
  if (anyErr?.fields) console.error('fields:', anyErr.fields);
  if (anyErr?.errors) console.error('validation errors:', anyErr.errors);
}

export async function resolveTagIds(
  tagNames: string[],
  transaction: Transaction,
): Promise<number[]> {
  const uniqueNames = [
    ...new Set(tagNames.map((n) => n?.trim()).filter(Boolean) as string[]),
  ];
  const tagIds: number[] = [];

  for (const name of uniqueNames) {
    const [tag, created] = await Tag.findOrCreate({
      where: { name },
      defaults: {
        name,
        slug: slugify(name) || `tag-${Date.now()}`,
        category: 'concept',
        color: null,
        description: null,
      } as any,
      transaction,
    });

    const tagId = Number(tag.get('id'));
    if (!Number.isFinite(tagId)) {
      throw new Error(
        `Tag "${name}" không có id hợp lệ (created=${created}, raw=${JSON.stringify(tag.get({ plain: true }))})`,
      );
    }
    tagIds.push(tagId);
  }

  return tagIds;
}

export async function syncQuestionTags(
  questionId: string,
  tagNames: string[],
  transaction: Transaction,
): Promise<void> {
  await QuestionTag.destroy({
    where: { question_id: questionId },
    transaction,
  });

  if (!tagNames.length) return;

  const tagIds = await resolveTagIds(tagNames, transaction);
  if (!tagIds.length) return;

  const rows = tagIds.map((tag_id) => ({
    question_id: questionId,
    tag_id,
  }));

  console.log('[questionService] syncQuestionTags bulkCreate rows:', rows);

  await QuestionTag.bulkCreate(rows as any, {
    transaction,
    ignoreDuplicates: true,
  });
}

export interface CreateQuestionInput {
  title: string;
  excerpt: string;
  content?: string;
  subject?: string | null;
  tags?: string[];
  authorId: string;
}

export async function createQuestion(input: CreateQuestionInput): Promise<string> {
  initModels();

  const t = await sequelize.transaction();
  let step = 'start';

  try {
    step = 'create question';
    const id = randomUUID();
    await Question.create(
      {
        id,
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        content: input.content?.trim() || input.excerpt.trim(),
        subject: input.subject || null,
        author_id: input.authorId,
        status: 'active',
      } as any,
      { transaction: t },
    );

    if (Array.isArray(input.tags) && input.tags.length) {
      step = 'sync question_tags';
      await syncQuestionTags(id, input.tags, t);
    }

    step = 'increment posts_count';
    await User.increment('posts_count', {
      by: 1,
      where: { id: input.authorId },
      transaction: t,
    });

    step = 'commit';
    await t.commit();
    return id;
  } catch (err) {
    logSequelizeError(step, err);
    await t.rollback();
    throw err;
  }
}

export class QuestionServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function deleteQuestion(
  questionId: string,
  auth: AuthContext,
): Promise<void> {
  initModels();

  // 1. Khai báo biến t ở ngoài try nhưng không gán chạy ngay, đề phòng lỗi khởi tạo
  let t: any = null; 
  let step = 'initialize transaction';

  try {
    // Chỉ bắt đầu transaction bên trong block try
    t = await sequelize.transaction();

    step = 'find question';
    const found = await Question.findByPk(questionId, { transaction: t });
    if (!found) {
      throw new QuestionServiceError('Không tìm thấy bài viết', 404);
    }

    if (!canModifyOwnOrAdmin(found.get('author_id') as string, auth)) {
      throw new QuestionServiceError(
        'Bạn không có quyền xóa bài viết này',
        403,
      );
    }

    const authorId = found.get('author_id') as string;

    step = 'delete question_tags';
    await QuestionTag.destroy({ where: { question_id: questionId }, transaction: t });

    step = 'delete question_votes';
    await QuestionVote.destroy({ where: { question_id: questionId }, transaction: t });

    step = 'delete question_comments';
    await QuestionComment.destroy({ where: { question_id: questionId }, transaction: t });

    step = 'delete bookmarks';
    await Bookmark.destroy({ where: { question_id: questionId }, transaction: t });

    step = 'load answers';
    // TỐI ƯU: Thêm raw: true để Sequelize không phải build object Model nặng nề, giúp tăng tốc query
    const answers = await Answer.findAll({
      where: { question_id: questionId },
      attributes: ['id'],
      raw: true, 
      transaction: t,
    });
    const answerIds = answers.map((a: any) => a.id);

    if (answerIds.length) {
      step = 'delete answer_votes';
      await AnswerVote.destroy({ where: { answer_id: answerIds }, transaction: t });

      step = 'delete answer_comments';
      await AnswerComment.destroy({ where: { answer_id: answerIds }, transaction: t });

      step = 'delete answers';
      await Answer.destroy({ where: { question_id: questionId }, transaction: t });
    }

    step = 'delete question';
    await found.destroy({ transaction: t });

    if (authorId) {
      step = 'decrement posts_count';
      await User.decrement('posts_count', {
        by: 1,
        where: { id: authorId },
        transaction: t,
      });
    }

    step = 'commit';
    await t.commit();
  } catch (err) {
    // 2. SỬA LỖI QUAN TRỌNG: Chỉ rollback khi và chỉ khi transaction đã được khởi tạo (t khác null)
    if (t) {
      try {
        await t.rollback();
      } catch (rollbackErr) {
        logSequelizeError('rollback failed', rollbackErr);
      }
    }
    logSequelizeError(step, err);
    throw err;
  }
}