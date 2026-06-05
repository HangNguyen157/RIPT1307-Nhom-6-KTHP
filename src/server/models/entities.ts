import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class UserEntity extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password?: string;
  public role!: 'student' | 'teacher' | 'admin';
  public department?: string;
  public major?: string;
  public studentId?: string;
  public avatar?: string;
  public bio?: string;
  public reputation!: number;
  public posts!: number;
  public answers!: number;
  public votes!: number;
  public followers!: number;
  public following!: number;
  public joinDate!: string;
  public badges!: string[];
  public status!: 'active' | 'banned';

  // Associations
  public questions?: QuestionEntity[];
  public comments?: CommentEntity[];
}

UserEntity.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM('student', 'teacher', 'admin'), defaultValue: 'student' },
  department: { type: DataTypes.STRING, allowNull: true },
  major: { type: DataTypes.STRING, allowNull: true },
  studentId: { type: DataTypes.STRING, allowNull: true },
  avatar: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  reputation: { type: DataTypes.INTEGER, defaultValue: 10 },
  posts: { type: DataTypes.INTEGER, defaultValue: 0 },
  answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  votes: { type: DataTypes.INTEGER, defaultValue: 0 },
  followers: { type: DataTypes.INTEGER, defaultValue: 0 },
  following: { type: DataTypes.INTEGER, defaultValue: 0 },
  joinDate: { type: DataTypes.STRING, allowNull: false },
  badges: { 
    type: DataTypes.TEXT, 
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('badges') as any;
      try {
        return rawValue ? JSON.parse(rawValue) : [];
      } catch {
        return [];
      }
    },
    set(val: string[]) {
      this.setDataValue('badges', JSON.stringify(val) as any);
    }
  },
  status: { type: DataTypes.ENUM('active', 'banned'), defaultValue: 'active' }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: false
});

export class TagEntity extends Model {
  public name!: string;
  public count!: number;
  public color!: string;
  public category!: string;
  public desc!: string;

  // Associations
  public taggedQuestions?: QuestionEntity[];
}

TagEntity.init({
  name: { type: DataTypes.STRING, primaryKey: true },
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
  color: { type: DataTypes.STRING, allowNull: false, defaultValue: '#3b82f6' },
  category: { type: DataTypes.STRING, allowNull: false },
  desc: { type: DataTypes.TEXT, allowNull: true }
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'Tags',
  timestamps: false
});

export class QuestionEntity extends Model {
  public id!: string;
  public title!: string;
  public excerpt!: string;
  public content!: string;
  public authorId!: string;
  public votes!: number;
  public commentsCount!: number;
  public views!: number;
  public subject?: string;
  public isSolved!: boolean;
  public status!: 'active' | 'reported' | 'hidden';
  public createdAt!: Date;

  // Associations
  public author?: UserEntity;
  public questionTags?: TagEntity[];
  public questionComments?: CommentEntity[];
}

QuestionEntity.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.STRING, allowNull: false },
  votes: { type: DataTypes.INTEGER, defaultValue: 0 },
  commentsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  subject: { type: DataTypes.STRING, allowNull: true },
  isSolved: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('active', 'reported', 'hidden'), defaultValue: 'active' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Question',
  tableName: 'Questions',
  timestamps: true,
  updatedAt: false
});

export class CommentEntity extends Model {
  public id!: string;
  public questionId!: string;
  public parentId?: string | null;
  public authorId!: string;
  public votes!: number;
  public isBest!: boolean;
  public content!: string;
  public createdAt!: Date;

  // Associations
  public author?: UserEntity;
  public replies?: CommentEntity[];
  public parent?: CommentEntity;
}

CommentEntity.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  questionId: { type: DataTypes.STRING, allowNull: false },
  parentId: { type: DataTypes.STRING, allowNull: true },
  authorId: { type: DataTypes.STRING, allowNull: false },
  votes: { type: DataTypes.INTEGER, defaultValue: 0 },
  isBest: { type: DataTypes.BOOLEAN, defaultValue: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'Comments',
  timestamps: true,
  updatedAt: false
});

export class VoteEntity extends Model {
  public id!: string;
  public userId!: string;
  public targetId!: string;
  public targetType!: 'question' | 'comment';
  public value!: number;
}

VoteEntity.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  targetId: { type: DataTypes.STRING, allowNull: false },
  targetType: { type: DataTypes.ENUM('question', 'comment'), allowNull: false },
  value: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'Vote',
  tableName: 'Votes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'targetId', 'targetType']
    }
  ]
});

// Associations
UserEntity.hasMany(QuestionEntity, { foreignKey: 'authorId', as: 'questions' });
QuestionEntity.belongsTo(UserEntity, { foreignKey: 'authorId', as: 'author' });

UserEntity.hasMany(CommentEntity, { foreignKey: 'authorId', as: 'comments' });
CommentEntity.belongsTo(UserEntity, { foreignKey: 'authorId', as: 'author' });

QuestionEntity.hasMany(CommentEntity, { foreignKey: 'questionId', as: 'questionComments' });
CommentEntity.belongsTo(QuestionEntity, { foreignKey: 'questionId' });

CommentEntity.hasMany(CommentEntity, { foreignKey: 'parentId', as: 'replies' });
CommentEntity.belongsTo(CommentEntity, { foreignKey: 'parentId', as: 'parent' });

QuestionEntity.belongsToMany(TagEntity, { through: 'QuestionTags', foreignKey: 'questionId', as: 'questionTags' });
TagEntity.belongsToMany(QuestionEntity, { through: 'QuestionTags', foreignKey: 'tagName', as: 'taggedQuestions' });
