import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

// Core models initialization based on Forum.sql

export const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      allowNull: false,
      defaultValue: 'student',
    },
    department: { type: DataTypes.STRING(255), allowNull: true },
    major: { type: DataTypes.STRING(255), allowNull: true },
    student_id: { type: DataTypes.STRING(100), allowNull: true },
    avatar: { type: DataTypes.STRING(255), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    reputation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    posts_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    answers_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    votes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    followers_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    following_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    badges: { type: DataTypes.JSON, allowNull: true },
    status: {
      type: DataTypes.ENUM('active', 'banned'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export const UserFollow = sequelize.define(
  'UserFollow',
  {
    follower_id: { type: DataTypes.STRING(36), primaryKey: true },
    following_id: { type: DataTypes.STRING(36), primaryKey: true },
  },
  { tableName: 'user_follows', timestamps: false },
);

export const Tag = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    color: { type: DataTypes.STRING(20), allowNull: true },
    category: {
      type: DataTypes.ENUM(
        'language',
        'framework',
        'subject',
        'database',
        'field',
        'tool',
        'concept',
      ),
      allowNull: false,
    },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'tags', timestamps: false },
);

export const Question = sequelize.define(
  'Question',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    title: { type: DataTypes.STRING(512), allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    author_id: { type: DataTypes.STRING(36), allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: true },
    is_solved: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    accepted_answer_id: { type: DataTypes.STRING(36), allowNull: true },
    status: {
      type: DataTypes.ENUM('active', 'reported', 'hidden'),
      allowNull: false,
      defaultValue: 'active',
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export const QuestionTag = sequelize.define(
  'QuestionTag',
  {
    question_id: { type: DataTypes.STRING(36), primaryKey: true },
    tag_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
  },
  {
    tableName: 'question_tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const Answer = sequelize.define(
  'Answer',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    question_id: { type: DataTypes.STRING(36), allowNull: false },
    author_id: { type: DataTypes.STRING(36), allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    is_accepted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export const QuestionComment = sequelize.define(
  'QuestionComment',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    question_id: { type: DataTypes.STRING(36), allowNull: false },
    parent_id: { type: DataTypes.STRING(36), allowNull: true },
    author_id: { type: DataTypes.STRING(36), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'question_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export const AnswerComment = sequelize.define(
  'AnswerComment',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    answer_id: { type: DataTypes.STRING(36), allowNull: false },
    parent_id: { type: DataTypes.STRING(36), allowNull: true },
    author_id: { type: DataTypes.STRING(36), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'answer_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'deleted_at',
  },
);

export const QuestionVote = sequelize.define(
  'QuestionVote',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    user_id: { type: DataTypes.STRING(36), allowNull: false },
    question_id: { type: DataTypes.STRING(36), allowNull: false },
    value: { type: DataTypes.TINYINT, allowNull: false },
  },
  {
    tableName: 'question_votes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const AnswerVote = sequelize.define(
  'AnswerVote',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    user_id: { type: DataTypes.STRING(36), allowNull: false },
    answer_id: { type: DataTypes.STRING(36), allowNull: false },
    value: { type: DataTypes.TINYINT, allowNull: false },
  },
  {
    tableName: 'answer_votes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const Bookmark = sequelize.define(
  'Bookmark',
  {
    user_id: { type: DataTypes.STRING(36), primaryKey: true },
    question_id: { type: DataTypes.STRING(36), primaryKey: true },
  },
  {
    tableName: 'bookmarks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    sender_id: { type: DataTypes.STRING(36), allowNull: true },
    type: {
      type: DataTypes.ENUM(
        'upvote_question',
        'upvote_answer',
        'new_answer',
        'new_comment',
        'accepted_answer',
        'mention',
      ),
      allowNull: false,
    },
    source_question_id: { type: DataTypes.STRING(36), allowNull: true },
    source_answer_id: { type: DataTypes.STRING(36), allowNull: true },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const NotificationRecipient = sequelize.define(
  'NotificationRecipient',
  {
    notification_id: { type: DataTypes.STRING(36), primaryKey: true },
    receiver_id: { type: DataTypes.STRING(36), primaryKey: true },
    is_read: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    read_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'notification_recipients', timestamps: false },
);

export const UserActivity = sequelize.define(
  'UserActivity',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.STRING(36), allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.STRING(512), allowNull: true },
    meta_data: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: 'user_activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const Report = sequelize.define(
  'Report',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    reporter_id: { type: DataTypes.STRING(36), allowNull: true },
    target_type: {
      type: DataTypes.ENUM(
        'question',
        'answer',
        'q_comment',
        'a_comment',
        'user',
      ),
      allowNull: false,
    },
    target_id: { type: DataTypes.STRING(36), allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

export const Attachment = sequelize.define(
  'Attachment',
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    target_type: {
      type: DataTypes.ENUM('question', 'answer'),
      allowNull: false,
    },
    target_id: { type: DataTypes.STRING(36), allowNull: false },
    file_url: { type: DataTypes.STRING(512), allowNull: false },
    file_type: { type: DataTypes.STRING(100), allowNull: true },
    file_size: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

// Associations
export function initModels() {
  // Kiểm tra nếu đã init associations rồi thì không làm lại nữa để tránh lỗi Hot Reload
  if (Question.associations.author) return;

  // Users
  User.hasMany(Question, { foreignKey: 'author_id' });
  Question.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

  User.hasMany(Answer, { foreignKey: 'author_id' });
  Answer.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

  // Question - Tag M:N
  Question.belongsToMany(Tag, {
    through: QuestionTag,
    foreignKey: 'question_id',
    otherKey: 'tag_id',
  });
  Tag.belongsToMany(Question, {
    through: QuestionTag,
    foreignKey: 'tag_id',
    otherKey: 'question_id',
  });

  // Question - Answer
  Question.hasMany(Answer, { foreignKey: 'question_id' });
  Answer.belongsTo(Question, { foreignKey: 'question_id' });

  // Comments
  Question.hasMany(QuestionComment, { foreignKey: 'question_id' });
  QuestionComment.belongsTo(Question, { foreignKey: 'question_id' });

  Answer.hasMany(AnswerComment, { foreignKey: 'answer_id' });
  AnswerComment.belongsTo(Answer, { foreignKey: 'answer_id' });

  // Votes
  User.hasMany(QuestionVote, { foreignKey: 'user_id' });
  QuestionVote.belongsTo(User, { foreignKey: 'user_id' });
  Question.hasMany(QuestionVote, { foreignKey: 'question_id' });
  QuestionVote.belongsTo(Question, { foreignKey: 'question_id' });

  User.hasMany(AnswerVote, { foreignKey: 'user_id' });
  AnswerVote.belongsTo(User, { foreignKey: 'user_id' });
  Answer.hasMany(AnswerVote, { foreignKey: 'answer_id' });
  AnswerVote.belongsTo(Answer, { foreignKey: 'answer_id' });

  // Bookmarks
  User.belongsToMany(Question, {
    through: Bookmark,
    foreignKey: 'user_id',
    otherKey: 'question_id',
    as: 'bookmarked_questions',
  });

  // Notifications
  Notification.hasMany(NotificationRecipient, {
    foreignKey: 'notification_id',
  });
  NotificationRecipient.belongsTo(Notification, {
    foreignKey: 'notification_id',
  });

  // Follows (self referential)
  User.belongsToMany(User, {
    through: UserFollow,
    as: 'Followers',
    foreignKey: 'following_id',
    otherKey: 'follower_id',
  });
  User.belongsToMany(User, {
    through: UserFollow,
    as: 'Following',
    foreignKey: 'follower_id',
    otherKey: 'following_id',
  });

  // Activities, Reports, Attachments
  User.hasMany(UserActivity, { foreignKey: 'user_id' });
  UserActivity.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Report, { foreignKey: 'reporter_id' });
  Report.belongsTo(User, { foreignKey: 'reporter_id' });
}

export default {
  sequelize,
  initModels,
  User,
  UserFollow,
  Tag,
  Question,
  QuestionTag,
  Answer,
  QuestionComment,
  AnswerComment,
  QuestionVote,
  AnswerVote,
  Bookmark,
  Notification,
  NotificationRecipient,
  UserActivity,
  Report,
  Attachment,
};
export * from './Comment';
export * from './Question';
export * from './Tag';
export * from './User';
export * from './Vote';
