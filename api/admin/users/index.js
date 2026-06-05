"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/models/entities.ts
var import_sequelize, UserEntity, TagEntity, QuestionEntity, CommentEntity, VoteEntity;
var init_entities = __esm({
  "src/server/models/entities.ts"() {
    "use strict";
    import_sequelize = require("sequelize");
    init_db();
    UserEntity = class extends import_sequelize.Model {
      id;
      name;
      email;
      password;
      role;
      department;
      major;
      studentId;
      avatar;
      bio;
      reputation;
      posts;
      answers;
      votes;
      followers;
      following;
      joinDate;
      badges;
      status;
      // Associations
      questions;
      comments;
    };
    UserEntity.init({
      id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
      name: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      email: { type: import_sequelize.DataTypes.STRING, allowNull: false, unique: true },
      password: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      role: { type: import_sequelize.DataTypes.ENUM("student", "teacher", "admin"), defaultValue: "student" },
      department: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      major: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      studentId: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      avatar: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      bio: { type: import_sequelize.DataTypes.TEXT, allowNull: true },
      reputation: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 10 },
      posts: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      answers: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      votes: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      followers: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      following: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      joinDate: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      badges: {
        type: import_sequelize.DataTypes.TEXT,
        defaultValue: "[]",
        get() {
          const rawValue = this.getDataValue("badges");
          try {
            return rawValue ? JSON.parse(rawValue) : [];
          } catch {
            return [];
          }
        },
        set(val) {
          this.setDataValue("badges", JSON.stringify(val));
        }
      },
      status: { type: import_sequelize.DataTypes.ENUM("active", "banned"), defaultValue: "active" }
    }, {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false
    });
    TagEntity = class extends import_sequelize.Model {
      name;
      count;
      color;
      category;
      desc;
      // Associations
      taggedQuestions;
    };
    TagEntity.init({
      name: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
      count: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      color: { type: import_sequelize.DataTypes.STRING, allowNull: false, defaultValue: "#3b82f6" },
      category: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      desc: { type: import_sequelize.DataTypes.TEXT, allowNull: true }
    }, {
      sequelize,
      modelName: "Tag",
      tableName: "Tags",
      timestamps: false
    });
    QuestionEntity = class extends import_sequelize.Model {
      id;
      title;
      excerpt;
      content;
      authorId;
      votes;
      commentsCount;
      views;
      subject;
      isSolved;
      status;
      createdAt;
      // Associations
      author;
      questionTags;
      questionComments;
    };
    QuestionEntity.init({
      id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
      title: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      excerpt: { type: import_sequelize.DataTypes.TEXT, allowNull: false },
      content: { type: import_sequelize.DataTypes.TEXT, allowNull: false },
      authorId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      votes: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      commentsCount: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      views: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      subject: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      isSolved: { type: import_sequelize.DataTypes.BOOLEAN, defaultValue: false },
      status: { type: import_sequelize.DataTypes.ENUM("active", "reported", "hidden"), defaultValue: "active" },
      createdAt: { type: import_sequelize.DataTypes.DATE, defaultValue: import_sequelize.DataTypes.NOW }
    }, {
      sequelize,
      modelName: "Question",
      tableName: "Questions",
      timestamps: true,
      updatedAt: false
    });
    CommentEntity = class extends import_sequelize.Model {
      id;
      questionId;
      parentId;
      authorId;
      votes;
      isBest;
      content;
      createdAt;
      // Associations
      author;
      replies;
      parent;
    };
    CommentEntity.init({
      id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
      questionId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      parentId: { type: import_sequelize.DataTypes.STRING, allowNull: true },
      authorId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      votes: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
      isBest: { type: import_sequelize.DataTypes.BOOLEAN, defaultValue: false },
      content: { type: import_sequelize.DataTypes.TEXT, allowNull: false },
      createdAt: { type: import_sequelize.DataTypes.DATE, defaultValue: import_sequelize.DataTypes.NOW }
    }, {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
      timestamps: true,
      updatedAt: false
    });
    VoteEntity = class extends import_sequelize.Model {
      id;
      userId;
      targetId;
      targetType;
      value;
    };
    VoteEntity.init({
      id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
      userId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      targetId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
      targetType: { type: import_sequelize.DataTypes.ENUM("question", "comment"), allowNull: false },
      value: { type: import_sequelize.DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: "Vote",
      tableName: "Votes",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["userId", "targetId", "targetType"]
        }
      ]
    });
    UserEntity.hasMany(QuestionEntity, { foreignKey: "authorId", as: "questions" });
    QuestionEntity.belongsTo(UserEntity, { foreignKey: "authorId", as: "author" });
    UserEntity.hasMany(CommentEntity, { foreignKey: "authorId", as: "comments" });
    CommentEntity.belongsTo(UserEntity, { foreignKey: "authorId", as: "author" });
    QuestionEntity.hasMany(CommentEntity, { foreignKey: "questionId", as: "questionComments" });
    CommentEntity.belongsTo(QuestionEntity, { foreignKey: "questionId" });
    CommentEntity.hasMany(CommentEntity, { foreignKey: "parentId", as: "replies" });
    CommentEntity.belongsTo(CommentEntity, { foreignKey: "parentId", as: "parent" });
    QuestionEntity.belongsToMany(TagEntity, { through: "QuestionTags", foreignKey: "questionId", as: "questionTags" });
    TagEntity.belongsToMany(QuestionEntity, { through: "QuestionTags", foreignKey: "tagName", as: "taggedQuestions" });
  }
});

// src/server/models/User.ts
function hashPassword(plain) {
  return import_crypto.default.createHash("sha256").update(plain).digest("hex");
}
var import_crypto;
var init_User = __esm({
  "src/server/models/User.ts"() {
    "use strict";
    import_crypto = __toESM(require("crypto"));
  }
});

// src/server/seed/users.ts
var MOCK_USERS, MOCK_ADMIN_USERS;
var init_users = __esm({
  "src/server/seed/users.ts"() {
    "use strict";
    MOCK_USERS = [
      {
        id: "1",
        name: "Nguy\u1EC5n V\u0103n Admin",
        email: "admin@ptit.edu.vn",
        role: "admin",
        department: "Ban Qu\u1EA3n Tr\u1ECB",
        reputation: 9999,
        posts: 150,
        answers: 320,
        votes: 1250,
        followers: 500,
        following: 50,
        joinDate: "2023-01-01",
        badges: ["admin", "top-contributor", "helpful"],
        status: "active"
      },
      {
        id: "2",
        name: "Tr\u1EA7n Th\u1ECB H\u01B0\u01A1ng",
        email: "huong@student.ptit.edu.vn",
        role: "student",
        department: "C\xF4ng Ngh\u1EC7 Th\xF4ng Tin",
        major: "L\u1EADp Tr\xECnh Web",
        studentId: "B21DCCN123",
        bio: "Sinh vi\xEAn n\u0103m 3 ng\xE0nh CNTT, \u0111am m\xEA Web Development v\xE0 AI",
        reputation: 1250,
        posts: 28,
        answers: 45,
        votes: 320,
        followers: 89,
        following: 34,
        joinDate: "2024-09-01",
        badges: ["first-question", "helpful", "100-votes"],
        status: "active"
      },
      {
        id: "3",
        name: "PGS.TS L\xEA Minh \u0110\u1EE9c",
        email: "duc.lm@ptit.edu.vn",
        role: "teacher",
        department: "Khoa CNTT",
        major: "Khoa h\u1ECDc m\xE1y t\xEDnh",
        bio: "Gi\u1EA3ng vi\xEAn m\xF4n CTDL, Gi\u1EA3i Thu\u1EADt, AI. C\xF3 15 n\u0103m kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y.",
        reputation: 5430,
        posts: 85,
        answers: 210,
        votes: 870,
        followers: 342,
        following: 15,
        joinDate: "2023-06-15",
        badges: ["teacher", "expert", "top-contributor", "advisor"],
        status: "active"
      }
    ];
    MOCK_ADMIN_USERS = [
      ...MOCK_USERS,
      {
        id: "4",
        name: "Ho\xE0ng V\u0103n B\xECnh",
        email: "binh@student.ptit.edu.vn",
        role: "student",
        reputation: 980,
        posts: 35,
        answers: 0,
        votes: 0,
        followers: 0,
        following: 0,
        joinDate: "20/09/2024",
        badges: [],
        status: "banned"
      },
      {
        id: "5",
        name: "Nguy\u1EC5n Minh Ch\xE2u",
        email: "chau@ptit.edu.vn",
        role: "teacher",
        reputation: 870,
        posts: 42,
        answers: 0,
        votes: 0,
        followers: 0,
        following: 0,
        joinDate: "01/08/2023",
        badges: [],
        status: "active"
      },
      {
        id: "6",
        name: "Ph\u1EA1m Th\u1ECB Lan",
        email: "lan@student.ptit.edu.vn",
        role: "student",
        reputation: 320,
        posts: 8,
        answers: 0,
        votes: 0,
        followers: 0,
        following: 0,
        joinDate: "05/10/2024",
        badges: [],
        status: "active"
      }
    ];
  }
});

// src/server/seed/tags.ts
var MOCK_TAGS, TAG_CATEGORIES;
var init_tags = __esm({
  "src/server/seed/tags.ts"() {
    "use strict";
    MOCK_TAGS = [
      { name: "Java", count: 245, color: "#f97316", category: "language", desc: "Ng\xF4n ng\u1EEF l\u1EADp tr\xECnh h\u01B0\u1EDBng \u0111\u1ED1i t\u01B0\u1EE3ng ph\u1ED5 bi\u1EBFn" },
      { name: "JavaScript", count: 198, color: "#eab308", category: "language", desc: "Ng\xF4n ng\u1EEF scripting cho web development" },
      { name: "Python", count: 176, color: "#3b82f6", category: "language", desc: "Ng\xF4n ng\u1EEF \u0111a n\u0103ng d\xF9ng trong AI/ML, web, data" },
      { name: "React", count: 165, color: "#06b6d4", category: "framework", desc: "Th\u01B0 vi\u1EC7n JavaScript \u0111\u1EC3 x\xE2y d\u1EF1ng UI" },
      { name: "TypeScript", count: 142, color: "#2563eb", category: "language", desc: "JavaScript v\u1EDBi static typing" },
      { name: "Node.js", count: 128, color: "#10b981", category: "framework", desc: "Runtime JavaScript ph\xEDa server" },
      { name: "SQL", count: 112, color: "#8b5cf6", category: "database", desc: "Ng\xF4n ng\u1EEF truy v\u1EA5n c\u01A1 s\u1EDF d\u1EEF li\u1EC7u quan h\u1EC7" },
      { name: "OOP", count: 98, color: "#f97316", category: "concept", desc: "M\xF4 h\xECnh l\u1EADp tr\xECnh h\u01B0\u1EDBng \u0111\u1ED1i t\u01B0\u1EE3ng" },
      { name: "AI/ML", count: 87, color: "#ec4899", category: "field", desc: "Tr\xED tu\u1EC7 nh\xE2n t\u1EA1o v\xE0 Machine Learning" },
      { name: "Git", count: 85, color: "#6b7280", category: "tool", desc: "H\u1EC7 th\u1ED1ng qu\u1EA3n l\xFD phi\xEAn b\u1EA3n ph\xE2n t\xE1n" },
      { name: "C\u1EA5u Tr\xFAc D\u1EEF Li\u1EC7u", count: 76, color: "#14b8a6", category: "subject", desc: "M\xF4n h\u1ECDc v\u1EC1 t\u1ED5 ch\u1EE9c v\xE0 qu\u1EA3n l\xFD d\u1EEF li\u1EC7u" },
      { name: "Thu\u1EADt To\xE1n", count: 72, color: "#14b8a6", category: "subject", desc: "C\xE1c ph\u01B0\u01A1ng ph\xE1p gi\u1EA3i quy\u1EBFt b\xE0i to\xE1n" },
      { name: "Database", count: 65, color: "#8b5cf6", category: "database", desc: "Thi\u1EBFt k\u1EBF v\xE0 qu\u1EA3n tr\u1ECB c\u01A1 s\u1EDF d\u1EEF li\u1EC7u" },
      { name: "Web Development", count: 63, color: "#0ea5e9", category: "field", desc: "Ph\xE1t tri\u1EC3n \u1EE9ng d\u1EE5ng web" },
      { name: "Docker", count: 54, color: "#2563eb", category: "tool", desc: "N\u1EC1n t\u1EA3ng containerization" },
      { name: "C++", count: 48, color: "#7c3aed", category: "language", desc: "Ng\xF4n ng\u1EEF l\u1EADp tr\xECnh h\u1EC7 th\u1ED1ng" },
      { name: "M\u1EA1ng M\xE1y T\xEDnh", count: 45, color: "#0891b2", category: "subject", desc: "M\xF4n h\u1ECDc v\u1EC1 m\u1EA1ng v\xE0 giao th\u1EE9c" },
      { name: "Linux", count: 43, color: "#374151", category: "tool", desc: "H\u1EC7 \u0111i\u1EC1u h\xE0nh m\xE3 ngu\u1ED3n m\u1EDF" },
      { name: "Spring Boot", count: 38, color: "#15803d", category: "framework", desc: "Framework Java cho backend" },
      { name: "MongoDB", count: 35, color: "#15803d", category: "database", desc: "C\u01A1 s\u1EDF d\u1EEF li\u1EC7u NoSQL" }
    ];
    TAG_CATEGORIES = [
      { key: "all", label: "T\u1EA5t C\u1EA3" },
      { key: "language", label: "Ng\xF4n Ng\u1EEF" },
      { key: "framework", label: "Framework" },
      { key: "subject", label: "M\xF4n H\u1ECDc" },
      { key: "database", label: "Database" },
      { key: "field", label: "L\u0129nh V\u1EF1c" },
      { key: "tool", label: "C\xF4ng C\u1EE5" },
      { key: "concept", label: "Kh\xE1i Ni\u1EC7m" }
    ];
  }
});

// src/server/seed/questions.ts
var MOCK_QUESTIONS, MOCK_COMMENTS_BY_QUESTION;
var init_questions = __esm({
  "src/server/seed/questions.ts"() {
    "use strict";
    MOCK_QUESTIONS = [
      {
        id: "1",
        title: "Gi\u1EA3i th\xEDch OOP trong Java: Class, Object, Inheritance v\xE0 Polymorphism",
        excerpt: "OOP l\xE0 n\u1EC1n t\u1EA3ng c\u1EE7a Java. Trong b\xE0i vi\u1EBFt n\xE0y, t\xF4i s\u1EBD gi\u1EA3i th\xEDch chi ti\u1EBFt v\u1EC1 c\xE1c kh\xE1i ni\u1EC7m c\u1ED1t l\xF5i nh\u01B0 Class, Object, Inheritance v\xE0 c\xE1ch s\u1EED d\u1EE5ng trong th\u1EF1c t\u1EBF...",
        author: "Nguy\u1EC5n V\u0103n A",
        authorId: "2",
        authorRole: "student",
        tags: ["Java", "OOP", "L\u1EADp Tr\xECnh"],
        votes: 45,
        comments: 12,
        views: 523,
        timestamp: "2 gi\u1EDD tr\u01B0\u1EDBc",
        subject: "L\u1EADp Tr\xECnh C\u01A1 B\u1EA3n",
        isSolved: true,
        status: "active",
        createdAt: "09/05/2026"
      },
      {
        id: "2",
        title: "React Hooks: useState, useEffect, useContext - H\u01B0\u1EDBng d\u1EABn to\xE0n di\u1EC7n",
        excerpt: "React Hooks l\xE0 m\u1ED9t c\xE1ch m\u1EDBi \u0111\u1EC3 vi\u1EBFt components trong React. B\xE0i vi\u1EBFt n\xE0y s\u1EBD h\u01B0\u1EDBng d\u1EABn b\u1EA1n c\xE1ch s\u1EED d\u1EE5ng c\xE1c hooks ph\u1ED5 bi\u1EBFn nh\u1EA5t trong d\u1EF1 \xE1n th\u1EF1c t\u1EBF...",
        author: "Tr\u1EA7n Th\u1ECB B",
        tags: ["React", "JavaScript", "Web Development"],
        votes: 67,
        comments: 23,
        views: 892,
        timestamp: "5 gi\u1EDD tr\u01B0\u1EDBc",
        subject: "Web Development",
        isSolved: false,
        status: "active",
        createdAt: "08/05/2026"
      },
      {
        id: "3",
        title: "C\u1EA5u tr\xFAc d\u1EEF li\u1EC7u: Stack v\xE0 Queue - C\xE0i \u0111\u1EB7t v\xE0 \u1EE9ng d\u1EE5ng th\u1EF1c t\u1EBF",
        excerpt: "Stack v\xE0 Queue l\xE0 hai c\u1EA5u tr\xFAc d\u1EEF li\u1EC7u quan tr\u1ECDng. H\xF4m nay ch\xFAng ta s\u1EBD t\xECm hi\u1EC3u v\u1EC1 c\xE1ch th\u1EF1c hi\u1EC7n, \u1EE9ng d\u1EE5ng trong th\u1EF1c t\u1EBF v\xE0 so s\xE1nh v\u1EDBi c\xE1c CTDL kh\xE1c...",
        author: "L\xEA V\u0103n C",
        tags: ["C\u1EA5u Tr\xFAc D\u1EEF Li\u1EC7u", "Thu\u1EADt To\xE1n", "Java"],
        votes: 34,
        comments: 8,
        views: 421,
        timestamp: "1 ng\xE0y tr\u01B0\u1EDBc",
        subject: "C\u1EA5u Tr\xFAc D\u1EEF Li\u1EC7u",
        isSolved: true,
        status: "active",
        createdAt: "06/05/2026"
      },
      {
        id: "4",
        title: "SQL: JOIN, Subquery, v\xE0 Optimization - T\u1ED1i \u01B0u truy v\u1EA5n database",
        excerpt: "JOIN l\xE0 m\u1ED9t trong nh\u1EEFng kh\xE1i ni\u1EC7m quan tr\u1ECDng nh\u1EA5t trong SQL. B\xE0i vi\u1EBFt n\xE0y s\u1EBD gi\xE1o d\u1EA1y b\u1EA1n c\xE1ch d\xF9ng c\xE1c lo\u1EA1i JOIN, subquery v\xE0 t\u1ED1i \u01B0u performance...",
        author: "Ph\u1EA1m Minh D",
        tags: ["SQL", "Database", "Optimization"],
        votes: 56,
        comments: 15,
        views: 734,
        timestamp: "2 ng\xE0y tr\u01B0\u1EDBc",
        subject: "C\u01A1 S\u1EDF D\u1EEF Li\u1EC7u",
        isSolved: false,
        status: "active",
        createdAt: "07/05/2026"
      },
      {
        id: "5",
        title: "Git & GitHub: Qu\u1EA3n l\xFD phi\xEAn b\u1EA3n hi\u1EC7u qu\u1EA3 cho team l\u1EDBn",
        excerpt: "Git l\xE0 c\xF4ng c\u1EE5 kh\xF4ng th\u1EC3 thi\u1EBFu trong ph\xE1t tri\u1EC3n ph\u1EA7n m\u1EC1m. H\xE3y h\u1ECDc c\xE1ch s\u1EED d\u1EE5ng Git v\xE0 GitHub trong m\xF4i tr\u01B0\u1EDDng team...",
        author: "Ho\xE0ng Anh E",
        tags: ["Git", "GitHub", "DevOps"],
        votes: 78,
        comments: 31,
        views: 1023,
        timestamp: "3 ng\xE0y tr\u01B0\u1EDBc",
        isSolved: true,
        status: "active",
        createdAt: "05/05/2026"
      },
      {
        id: "6",
        title: "Python: List Comprehension, Lambda v\xE0 Functional Programming",
        excerpt: "Python c\xF3 nh\u1EEFng t\xEDnh n\u0103ng r\u1EA5t ti\u1EC7n l\u1EE3i \u0111\u1EC3 vi\u1EBFt code ng\u1EAFn g\u1ECDn. H\xF4m nay t\xF4i s\u1EBD chia s\u1EBB c\xE1c k\u1EF9 thu\u1EADt n\xE2ng cao...",
        author: "\u0110\u1EB7ng Tu\u1EA5n F",
        tags: ["Python", "L\u1EADp Tr\xECnh", "Functional"],
        votes: 42,
        comments: 11,
        views: 356,
        timestamp: "4 ng\xE0y tr\u01B0\u1EDBc",
        isSolved: false,
        status: "active",
        createdAt: "04/05/2026"
      }
    ];
    MOCK_COMMENTS_BY_QUESTION = {
      "1": [
        {
          id: "1",
          questionId: "1",
          author: "PGS.TS L\xEA Minh \u0110\u1EE9c",
          authorId: "3",
          authorRole: "teacher",
          authorRep: 5430,
          avatar: "L",
          timestamp: "1 gi\u1EDD tr\u01B0\u1EDBc",
          votes: 28,
          isBest: true,
          content: `\u0110\xE2y l\xE0 m\u1ED9t c\xE2u h\u1ECFi r\u1EA5t hay v\u1EC1 OOP! \u0110\u1EC3 hi\u1EC3u r\xF5 h\u01A1n, m\xECnh s\u1EBD gi\u1EA3i th\xEDch t\u1EEBng kh\xE1i ni\u1EC7m:

**Class** l\xE0 b\u1EA3n thi\u1EBFt k\u1EBF (blueprint) \u2013 gi\u1ED1ng nh\u01B0 b\u1EA3n v\u1EBD k\u1EF9 thu\u1EADt c\u1EE7a m\u1ED9t chi\u1EBFc xe.
**Object** l\xE0 th\u1EF1c th\u1EC3 c\u1EE5 th\u1EC3 \u2013 chi\u1EBFc xe th\u1EADt \u0111\u01B0\u1EE3c t\u1EA1o ra t\u1EEB b\u1EA3n v\u1EBD \u0111\xF3.

\`\`\`java
// Class = B\u1EA3n thi\u1EBFt k\u1EBF
class Student {
    String name;
    int age;
    
    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    void study() {
        System.out.println(name + " \u0111ang h\u1ECDc...");
    }
}

// Object = Th\u1EF1c th\u1EC3
Student s1 = new Student("An", 20);
Student s2 = new Student("B\xECnh", 21);
s1.study(); // An \u0111ang h\u1ECDc...
\`\`\`

V\u1EC1 **Inheritance**, \u0111\xE2y l\xE0 c\u01A1 ch\u1EBF quan tr\u1ECDng nh\u1EA5t trong OOP. Con k\u1EBF th\u1EEBa t\u1EA5t c\u1EA3 t\u1EEB cha.`,
          replies: [
            {
              id: "r1",
              author: "Tr\u1EA7n V\u0103n B",
              authorId: "4",
              timestamp: "45 ph\xFAt tr\u01B0\u1EDBc",
              content: "C\u1EA3m \u01A1n th\u1EA7y! Ph\u1EA7n v\u1EC1 polymorphism th\u1EA7y c\xF3 th\u1EC3 gi\u1EA3i th\xEDch th\xEAm kh\xF4ng \u1EA1?",
              votes: 3
            }
          ]
        },
        {
          id: "2",
          questionId: "1",
          author: "Tr\u1EA7n Th\u1ECB H\u01B0\u01A1ng",
          authorId: "2",
          authorRole: "student",
          authorRep: 1250,
          avatar: "T",
          timestamp: "30 ph\xFAt tr\u01B0\u1EDBc",
          votes: 12,
          isBest: false,
          content: `B\u1ED5 sung th\xEAm v\u1EC1 **Encapsulation** (\u0110\xF3ng g\xF3i) - c\u0169ng l\xE0 m\u1ED9t tr\u1EE5 c\u1ED9t quan tr\u1ECDng c\u1EE7a OOP:

\`\`\`java
public class BankAccount {
    private double balance; // \u1EA8n d\u1EEF li\u1EC7u
    
    public double getBalance() { // Getter
        return balance;
    }
    
    public void deposit(double amount) { // Setter v\u1EDBi validation
        if (amount > 0) balance += amount;
    }
}
\`\`\`

Encapsulation gi\xFAp b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u v\xE0 gi\u1EA3m s\u1EF1 ph\u1EE5 thu\u1ED9c gi\u1EEFa c\xE1c module.`,
          replies: []
        }
      ]
    };
  }
});

// src/server/seed/index.ts
var seed_exports = {};
__export(seed_exports, {
  MOCK_ADMIN_USERS: () => MOCK_ADMIN_USERS,
  MOCK_COMMENTS_BY_QUESTION: () => MOCK_COMMENTS_BY_QUESTION,
  MOCK_QUESTIONS: () => MOCK_QUESTIONS,
  MOCK_TAGS: () => MOCK_TAGS,
  MOCK_USERS: () => MOCK_USERS,
  TAG_CATEGORIES: () => TAG_CATEGORIES,
  seedDatabase: () => seedDatabase
});
async function seedDatabase() {
  try {
    await UserEntity.sequelize?.sync({ alter: true });
    console.log("[Database] \u0110\u1ED3ng b\u1ED9 c\xE1c b\u1EA3ng th\xE0nh c\xF4ng.");
    const userCount = await UserEntity.count();
    if (userCount === 0) {
      console.log("[Database] B\u1EA3ng Users tr\u1ED1ng, b\u1EAFt \u0111\u1EA7u seed d\u1EEF li\u1EC7u m\u1EABu...");
      for (const u of MOCK_ADMIN_USERS) {
        await UserEntity.create({
          id: u.id,
          name: u.name,
          email: u.email,
          password: hashPassword("password123"),
          // Mật khẩu mặc định cho tất cả user
          role: u.role,
          department: u.department || "C\xF4ng Ngh\u1EC7 Th\xF4ng Tin",
          major: u.major || "",
          studentId: u.studentId || "",
          avatar: u.avatar || u.name.charAt(0),
          bio: u.bio || "",
          reputation: u.reputation,
          posts: u.posts,
          answers: u.answers,
          votes: u.votes,
          followers: u.followers,
          following: u.following,
          joinDate: u.joinDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          badges: u.badges || [],
          status: u.status || "active"
        });
      }
      console.log("[Database] Seed b\u1EA3ng Users th\xE0nh c\xF4ng.");
    }
    const tagCount = await TagEntity.count();
    if (tagCount === 0) {
      console.log("[Database] B\u1EA3ng Tags tr\u1ED1ng, b\u1EAFt \u0111\u1EA7u seed...");
      for (const t of MOCK_TAGS) {
        await TagEntity.create({
          name: t.name,
          count: t.count,
          color: t.color,
          category: t.category,
          desc: t.desc
        });
      }
      console.log("[Database] Seed b\u1EA3ng Tags th\xE0nh c\xF4ng.");
    }
    const questionCount = await QuestionEntity.count();
    if (questionCount === 0) {
      console.log("[Database] B\u1EA3ng Questions tr\u1ED1ng, b\u1EAFt \u0111\u1EA7u seed...");
      for (const q of MOCK_QUESTIONS) {
        const question = await QuestionEntity.create({
          id: q.id,
          title: q.title,
          excerpt: q.excerpt,
          content: q.content || q.excerpt,
          authorId: q.authorId || "2",
          votes: q.votes,
          commentsCount: q.comments,
          views: q.views,
          subject: q.subject,
          isSolved: q.isSolved || false,
          status: q.status || "active",
          createdAt: q.createdAt ? new Date(q.createdAt.split("/").reverse().join("-")) : /* @__PURE__ */ new Date()
        });
        if (q.tags && q.tags.length > 0) {
          const tagsInDb = await TagEntity.findAll({ where: { name: q.tags } });
          await question.setQuestionTags(tagsInDb);
        }
      }
      console.log("[Database] Seed b\u1EA3ng Questions th\xE0nh c\xF4ng.");
    }
    const commentCount = await CommentEntity.count();
    if (commentCount === 0) {
      console.log("[Database] B\u1EA3ng Comments tr\u1ED1ng, b\u1EAFt \u0111\u1EA7u seed...");
      for (const qId of Object.keys(MOCK_COMMENTS_BY_QUESTION)) {
        const comments = MOCK_COMMENTS_BY_QUESTION[qId];
        for (const c of comments) {
          const parentComment = await CommentEntity.create({
            id: c.id,
            questionId: qId,
            parentId: null,
            authorId: c.authorId || "2",
            votes: c.votes,
            isBest: c.isBest || false,
            content: c.content,
            createdAt: /* @__PURE__ */ new Date()
          });
          if (c.replies && c.replies.length > 0) {
            for (const r of c.replies) {
              await CommentEntity.create({
                id: r.id,
                questionId: qId,
                parentId: parentComment.id,
                authorId: r.authorId || "4",
                votes: r.votes,
                isBest: false,
                content: r.content,
                createdAt: /* @__PURE__ */ new Date()
              });
            }
          }
        }
      }
      console.log("[Database] Seed b\u1EA3ng Comments th\xE0nh c\xF4ng.");
    }
  } catch (error) {
    console.error("[Database] L\u1ED7i trong qu\xE1 tr\xECnh seed database:", error);
  }
}
var init_seed = __esm({
  "src/server/seed/index.ts"() {
    "use strict";
    init_entities();
    init_User();
    init_users();
    init_tags();
    init_questions();
    init_users();
    init_questions();
    init_tags();
  }
});

// src/server/db.ts
async function initDatabase() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    console.log("[Database] K\u1EBFt n\u1ED1i MySQL th\xE0nh c\xF4ng.");
    const { seedDatabase: seedDatabase2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
    await seedDatabase2();
    isInitialized = true;
  } catch (error) {
    console.error(
      "[Database] Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i t\u1EDBi c\u01A1 s\u1EDF d\u1EEF li\u1EC7u MySQL. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i d\u1ECBch v\u1EE5 MySQL local v\xE0 \u0111\u1EA3m b\u1EA3o \u0111\xE3 t\u1EA1o database `edu_forum`. Error:",
      error
    );
  }
}
var import_sequelize2, dbName, dbUser, dbPassword, dbHost, dbPort, sequelize, isInitialized;
var init_db = __esm({
  "src/server/db.ts"() {
    "use strict";
    import_sequelize2 = require("sequelize");
    dbName = process.env.DB_NAME || "edu_forum";
    dbUser = process.env.DB_USER || "root";
    dbPassword = process.env.DB_PASSWORD || "2542006";
    dbHost = process.env.DB_HOST || "localhost";
    dbPort = parseInt(process.env.DB_PORT || "3307", 10);
    console.log(
      `[Database] \u0110ang k\u1EBFt n\u1ED1i t\u1EDBi MySQL: host=${dbHost}, port=${dbPort}, database=${dbName}, user=${dbUser}`
    );
    sequelize = new import_sequelize2.Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 3e4,
        idle: 1e4
      }
    });
    isInitialized = false;
  }
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js
var require_utils = __commonJS({
  "node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var utils_exports = {};
    __export2(utils_exports, {
      esbuildIgnorePathPrefixPlugin: () => esbuildIgnorePathPrefixPlugin,
      matchApiRoute: () => matchApiRoute2
    });
    module2.exports = __toCommonJS2(utils_exports);
    function esbuildIgnorePathPrefixPlugin() {
      return {
        name: "ignore-path-prefix",
        setup(build) {
          build.onResolve({ filter: /^@fs/ }, (args) => ({
            path: args.path.replace(/^@fs/, "")
          }));
        }
      };
    }
    function matchApiRoute2(apiRoutes2, path) {
      if (path.startsWith("/")) path = path.substring(1);
      if (path.startsWith("api/")) path = path.substring(4);
      const pathSegments = path.split("/").filter((p) => p !== "");
      if (pathSegments.length === 0 || pathSegments.length === 1 && pathSegments[0] === "api") {
        const route2 = apiRoutes2.find((r) => r.path === "/");
        if (route2) return { route: route2, params: {} };
        else return void 0;
      }
      const params = {};
      const route = apiRoutes2.find((route2) => {
        const routePathSegments = route2.path.split("/").filter((p) => p !== "");
        if (routePathSegments.length !== pathSegments.length) return false;
        for (let i = 0; i < routePathSegments.length; i++) {
          const routePathSegment = routePathSegments[i];
          if (routePathSegment.match(/^\[.*]$/)) {
            params[routePathSegment.substring(1, routePathSegment.length - 1)] = pathSegments[i];
            if (i == routePathSegments.length - 1) return true;
            continue;
          }
          if (routePathSegment !== pathSegments[i]) return false;
          if (i == routePathSegments.length - 1) return true;
        }
      });
      if (route) return { route, params };
    }
  }
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js
var require_request = __commonJS({
  "node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var request_exports = {};
    __export2(request_exports, {
      default: () => request_default,
      parseMultipart: () => parseMultipart,
      parseUrlEncoded: () => parseUrlEncoded
    });
    module2.exports = __toCommonJS2(request_exports);
    var import_utils = require_utils();
    var UmiApiRequest3 = class {
      _req;
      _params = {};
      constructor(req, apiRoutes2) {
        this._req = req;
        const m = (0, import_utils.matchApiRoute)(apiRoutes2, this.pathName || "");
        if (m) this._params = m.params;
      }
      get params() {
        return this._params;
      }
      _body = null;
      get body() {
        return this._body;
      }
      get headers() {
        return this._req.headers;
      }
      get method() {
        return this._req.method;
      }
      get query() {
        var _a, _b;
        return ((_b = (_a = this._req.url) == null ? void 0 : _a.split("?")[1]) == null ? void 0 : _b.split("&").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          const k = acc[key];
          if (k) {
            if (k instanceof Array) {
              k.push(value);
            } else {
              acc[key] = [k, value];
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {})) || {};
      }
      get cookies() {
        var _a;
        return (_a = this._req.headers.cookie) == null ? void 0 : _a.split(";").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          acc[key.trim()] = value;
          return acc;
        }, {});
      }
      get url() {
        return this._req.url;
      }
      get pathName() {
        var _a;
        return (_a = this._req.url) == null ? void 0 : _a.split("?")[0];
      }
      readBody() {
        if (this._req.headers["content-length"] === "0") {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          let body = [];
          this._req.on("data", (chunk) => {
            body.push(chunk);
          });
          this._req.on("end", () => {
            var _a, _b;
            const bodyBuffer = Buffer.concat(body);
            switch ((_a = this._req.headers["content-type"]) == null ? void 0 : _a.split(";")[0]) {
              case "application/json":
                try {
                  this._body = JSON.parse(bodyBuffer.toString());
                } catch (e) {
                  this._body = body;
                }
                break;
              case "multipart/form-data":
                const boundary = (_b = this.headers["content-type"]) == null ? void 0 : _b.split("boundary=")[1];
                if (!boundary) {
                  this._body = body;
                  break;
                }
                this._body = parseMultipart(bodyBuffer, boundary);
                break;
              case "application/x-www-form-urlencoded":
                this._body = parseUrlEncoded(bodyBuffer.toString());
                break;
              default:
                this._body = body;
                break;
            }
            resolve();
          });
          this._req.on("error", reject);
        });
      }
    };
    function parseMultipart(body, boundary) {
      const hexBoundary = Buffer.from(`--${boundary}`, "utf-8").toString("hex");
      return body.toString("hex").split(hexBoundary).reduce((acc, cur) => {
        var _a, _b;
        const [hexMeta, hexValue] = cur.split(
          Buffer.from("\r\n\r\n").toString("hex")
        );
        const meta = Buffer.from(hexMeta, "hex").toString("utf-8");
        const name = (_a = meta.split('name="')[1]) == null ? void 0 : _a.split('"')[0];
        if (!name) return acc;
        const fileName = (_b = meta.split('filename="')[1]) == null ? void 0 : _b.split('"')[0];
        if (fileName) {
          const fileBufferBeforeTrim = Buffer.from(hexValue, "hex");
          const fileBuffer = fileBufferBeforeTrim.slice(
            0,
            fileBufferBeforeTrim.byteLength - 2
          );
          const contentType = meta.split("Content-Type: ")[1];
          acc[name] = {
            fileName,
            data: fileBuffer,
            contentType
          };
          return acc;
        }
        const valueBufferBeforeTrim = Buffer.from(hexValue, "hex");
        const valueBuffer = valueBufferBeforeTrim.slice(
          0,
          valueBufferBeforeTrim.byteLength - 2
        );
        acc[name] = valueBuffer.toString("utf-8");
        return acc;
      }, {});
    }
    function parseUrlEncoded(body) {
      return body.split("&").reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
    }
    var request_default = UmiApiRequest3;
  }
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js
var require_response = __commonJS({
  "node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var response_exports = {};
    __export2(response_exports, {
      default: () => response_default
    });
    module2.exports = __toCommonJS2(response_exports);
    var UmiApiResponse3 = class {
      _res;
      constructor(res) {
        this._res = res;
      }
      status(statusCode) {
        this._res.statusCode = statusCode;
        return this;
      }
      header(key, value) {
        this._res.setHeader(key, value);
        return this;
      }
      setCookie(key, value) {
        this._res.setHeader("Set-Cookie", `${key}=${value}; path=/`);
        return this;
      }
      end(data) {
        this._res.end(data);
        return this;
      }
      text(data) {
        this._res.setHeader("Content-Type", "text/plain; charset=utf-8");
        this._res.end(data);
        return this;
      }
      html(data) {
        this._res.setHeader("Content-Type", "text/html; charset=utf-8");
        this._res.end(data);
        return this;
      }
      json(data) {
        this._res.setHeader("Content-Type", "application/json");
        this._res.end(JSON.stringify(data));
        return this;
      }
    };
    var response_default = UmiApiResponse3;
  }
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js
var require_apiRoute = __commonJS({
  "node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js"(exports2, module2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var apiRoute_exports = {};
    __export2(apiRoute_exports, {
      UmiApiRequest: () => import_request.default,
      UmiApiResponse: () => import_response.default,
      matchApiRoute: () => import_utils.matchApiRoute
    });
    module2.exports = __toCommonJS2(apiRoute_exports);
    var import_request = __toESM2(require_request());
    var import_response = __toESM2(require_response());
    var import_utils = require_utils();
  }
});

// src/.umi-production/api/admin/users/index.ts
var users_exports = {};
__export(users_exports, {
  default: () => users_default
});
module.exports = __toCommonJS(users_exports);

// src/.umi-production/api/_middlewares.ts
var middlewares_default = async (req, res, next) => {
  next();
};

// src/api/admin/users/index.ts
init_db();
init_entities();
init_User();
async function handler(req, res) {
  await initDatabase();
  if (req.method === "GET") {
    try {
      const users = await UserEntity.findAll({
        order: [["joinDate", "DESC"]]
      });
      res.status(200).json({ success: true, data: { list: users } });
    } catch (error) {
      res.status(500).json({ success: false, message: "L\u1ED7i l\u1EA5y danh s\xE1ch ng\u01B0\u1EDDi d\xF9ng", error: String(error) });
    }
    return;
  }
  if (req.method === "POST") {
    try {
      const { name, email, password, role, department, studentId } = req.body ?? {};
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c (t\xEAn, email, m\u1EADt kh\u1EA9u)" });
        return;
      }
      const exist = await UserEntity.findOne({ where: { email } });
      if (exist) {
        res.status(400).json({ success: false, message: "Email \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng" });
        return;
      }
      const newUser = await UserEntity.create({
        id: Date.now().toString(),
        name,
        email,
        password: hashPassword(password),
        role: role || "student",
        department: department || "CNTT",
        studentId: studentId || "",
        reputation: 10,
        posts: 0,
        answers: 0,
        votes: 0,
        followers: 0,
        following: 0,
        joinDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        badges: ["newcomer"],
        status: "active"
      });
      res.status(201).json({
        success: true,
        message: "Th\xEAm ng\u01B0\u1EDDi d\xF9ng th\xE0nh c\xF4ng!",
        data: newUser
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "L\u1ED7i th\xEAm ng\u01B0\u1EDDi d\xF9ng", error: String(error) });
    }
    return;
  }
  res.status(405).json({ success: false, message: "Method not allowed" });
}

// src/.umi-production/api/admin/users/index.ts
var import_apiRoute = __toESM(require_apiRoute());
var apiRoutes = [{ "path": "admin/users/[userId]", "id": "admin/users/[userId]", "file": "admin/users/[userId].ts", "absPath": "/admin/users/[userId]", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { UserEntity } from '@/server/models/entities';\nimport { hashPassword } from '@/server/models/User';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n  const userId = req.query?.userId as string;\n\n  if (req.method === 'GET') {\n    try {\n      const user = await UserEntity.findByPk(userId, {\n        attributes: { exclude: ['password'] }\n      });\n      if (!user) {\n        res.status(404).json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n      res.status(200).json({ success: true, data: user });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'PUT') {\n    try {\n      const user = await UserEntity.findByPk(userId);\n      if (!user) {\n        res.status(404).json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      const { name, role, department, studentId, status, newPassword } = req.body ?? {};\n\n      if (name !== undefined) user.name = name;\n      if (role !== undefined) user.role = role;\n      if (department !== undefined) user.department = department;\n      if (studentId !== undefined) user.studentId = studentId;\n      if (status !== undefined) user.status = status;\n      \n      if (newPassword) {\n        user.password = hashPassword(newPassword);\n      }\n\n      await user.save();\n\n      res.status(200).json({\n        success: true,\n        message: 'C\u1EADp nh\u1EADt th\xF4ng tin th\xE0nh c\xF4ng!',\n        data: user\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i c\u1EADp nh\u1EADt ng\u01B0\u1EDDi d\xF9ng', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'DELETE') {\n    try {\n      const user = await UserEntity.findByPk(userId);\n      if (!user) {\n        res.status(404).json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      await user.destroy();\n\n      res.status(200).json({\n        success: true,\n        message: `\u0110\xE3 x\xF3a ng\u01B0\u1EDDi d\xF9ng ${user.name} kh\u1ECFi h\u1EC7 th\u1ED1ng.`\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i x\xF3a ng\u01B0\u1EDDi d\xF9ng', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "posts/[id]/comments", "id": "posts/[id]/comments", "file": "posts/[id]/comments.ts", "absPath": "/posts/[id]/comments", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { QuestionEntity, UserEntity, CommentEntity } from '@/server/models/entities';\nimport { formatTime } from '../index';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n  const id = req.query?.id as string;\n\n  if (req.method === 'GET') {\n    try {\n      const comments = await CommentEntity.findAll({\n        where: { questionId: id, parentId: null },\n        include: [\n          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },\n          {\n            model: CommentEntity,\n            as: 'replies',\n            include: [{ model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] }]\n          }\n        ],\n        order: [['createdAt', 'ASC']]\n      });\n\n      const list = comments.map((c: any) => ({\n        id: c.id,\n        questionId: c.questionId,\n        parentId: c.parentId,\n        author: c.author ? c.author.name : 'Unknown',\n        authorId: c.authorId,\n        authorRole: c.author ? c.author.role : 'student',\n        authorRep: c.author ? c.author.reputation : 0,\n        avatar: c.author ? c.author.name.charAt(0) : 'U',\n        timestamp: formatTime(c.createdAt),\n        votes: c.votes,\n        isBest: c.isBest,\n        content: c.content,\n        replies: c.replies ? c.replies.map((r: any) => ({\n          id: r.id,\n          author: r.author ? r.author.name : 'Unknown',\n          authorId: r.authorId,\n          timestamp: formatTime(r.createdAt),\n          content: r.content,\n          votes: r.votes\n        })) : []\n      }));\n\n      res.status(200).json({ success: true, data: list });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y danh s\xE1ch b\xECnh lu\u1EADn', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'POST') {\n    try {\n      const { content, authorId, parentId } = req.body ?? {};\n\n      if (!content || !authorId) {\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu n\u1ED9i dung b\xECnh lu\u1EADn ho\u1EB7c t\xE1c gi\u1EA3' });\n        return;\n      }\n\n      const question = await QuestionEntity.findByPk(id);\n      if (!question) {\n        res.status(404).json({ success: false, message: 'B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      const user = await UserEntity.findByPk(authorId);\n      if (!user) {\n        res.status(404).json({ success: false, message: 'T\xE1c gi\u1EA3 kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      const newComment = await CommentEntity.create({\n        id: Date.now().toString(),\n        questionId: id,\n        parentId: parentId || null,\n        authorId,\n        votes: 0,\n        isBest: false,\n        content,\n        createdAt: new Date()\n      });\n\n      question.commentsCount += 1;\n      await question.save();\n\n      user.answers += 1;\n      await user.save();\n\n      try {\n        const { notifyNewReply } = await import('@/server/utils/email');\n        if (parentId) {\n          const parentComment = await CommentEntity.findByPk(parentId, {\n            include: [{ model: UserEntity, as: 'author', attributes: ['email'] }]\n          });\n          if (parentComment && parentComment.author) {\n            await notifyNewReply(id, parentComment.author.email);\n          }\n        } else {\n          const questionAuthor = await UserEntity.findByPk(question.authorId);\n          if (questionAuthor) {\n            await notifyNewReply(id, questionAuthor.email);\n          }\n        }\n      } catch (err) {\n        console.error('[Email] L\u1ED7i g\u1EEDi email th\xF4ng b\xE1o b\xECnh lu\u1EADn m\u1EDBi:', err);\n      }\n\n      res.status(201).json({\n        success: true,\n        message: 'Th\xEAm b\xECnh lu\u1EADn th\xE0nh c\xF4ng',\n        data: {\n          id: newComment.id,\n          author: user.name,\n          authorId: user.id,\n          authorRole: user.role,\n          authorRep: user.reputation,\n          avatar: user.name.charAt(0),\n          timestamp: 'V\u1EEBa xong',\n          votes: 0,\n          isBest: false,\n          content: newComment.content,\n          replies: []\n        }\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i th\xEAm b\xECnh lu\u1EADn', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'PUT') {\n    try {\n      const { commentId, isBest } = req.body ?? {};\n      if (!commentId) {\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu commentId' });\n        return;\n      }\n\n      const comment = await CommentEntity.findByPk(commentId);\n      if (!comment) {\n        res.status(404).json({ success: false, message: 'B\xECnh lu\u1EADn kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      if (isBest) {\n        await CommentEntity.update(\n          { isBest: false },\n          { where: { questionId: id } }\n        );\n      }\n\n      comment.isBest = !!isBest;\n      await comment.save();\n\n      const question = await QuestionEntity.findByPk(id);\n      if (question) {\n        question.isSolved = !!isBest;\n        await question.save();\n      }\n\n      res.status(200).json({ success: true, message: 'C\u1EADp nh\u1EADt c\xE2u tr\u1EA3 l\u1EDDi hay nh\u1EA5t th\xE0nh c\xF4ng' });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i c\u1EADp nh\u1EADt b\xECnh lu\u1EADn', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n\n" }, { "path": "admin/users", "id": "admin/users/index", "file": "admin/users/index.ts", "absPath": "/admin/users", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { UserEntity } from '@/server/models/entities';\nimport { hashPassword } from '@/server/models/User';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n\n  if (req.method === 'GET') {\n    try {\n      const users = await UserEntity.findAll({\n        order: [['joinDate', 'DESC']]\n      });\n      res.status(200).json({ success: true, data: { list: users } });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y danh s\xE1ch ng\u01B0\u1EDDi d\xF9ng', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'POST') {\n    try {\n      const { name, email, password, role, department, studentId } = req.body ?? {};\n\n      if (!name || !email || !password) {\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c (t\xEAn, email, m\u1EADt kh\u1EA9u)' });\n        return;\n      }\n\n      const exist = await UserEntity.findOne({ where: { email } });\n      if (exist) {\n        res.status(400).json({ success: false, message: 'Email \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng' });\n        return;\n      }\n\n      const newUser = await UserEntity.create({\n        id: Date.now().toString(),\n        name,\n        email,\n        password: hashPassword(password),\n        role: role || 'student',\n        department: department || 'CNTT',\n        studentId: studentId || '',\n        reputation: 10,\n        posts: 0,\n        answers: 0,\n        votes: 0,\n        followers: 0,\n        following: 0,\n        joinDate: new Date().toISOString().split('T')[0],\n        badges: ['newcomer'],\n        status: 'active'\n      });\n\n      res.status(201).json({\n        success: true,\n        message: 'Th\xEAm ng\u01B0\u1EDDi d\xF9ng th\xE0nh c\xF4ng!',\n        data: newUser\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i th\xEAm ng\u01B0\u1EDDi d\xF9ng', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "posts/[id]", "id": "posts/[id]/index", "file": "posts/[id]/index.ts", "absPath": "/posts/[id]", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { QuestionEntity, UserEntity, TagEntity, CommentEntity } from '@/server/models/entities';\nimport { formatQuestion } from '../index';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n  const id = req.query?.id as string;\n\n  if (req.method === 'GET') {\n    try {\n      const question = await QuestionEntity.findOne({\n        where: { id },\n        include: [\n          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },\n          { model: TagEntity, as: 'questionTags', through: { attributes: [] } }\n        ]\n      });\n\n      if (!question) {\n        res.status(404).json({ success: false, message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt' });\n        return;\n      }\n\n      question.views += 1;\n      await question.save();\n\n      const formattedQuestion = formatQuestion(question);\n\n      res.status(200).json({ \n        success: true, \n        data: { \n          question: formattedQuestion \n        } \n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y chi ti\u1EBFt b\xE0i vi\u1EBFt', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'DELETE') {\n    try {\n      const question = await QuestionEntity.findByPk(id);\n      if (!question) {\n        res.status(404).json({ success: false, message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt' });\n        return;\n      }\n\n      await (question as any).setQuestionTags([]);\n      await CommentEntity.destroy({ where: { questionId: id } });\n      await question.destroy();\n\n      res.status(200).json({ success: true, message: '\u0110\xE3 x\xF3a b\xE0i vi\u1EBFt th\xE0nh c\xF4ng' });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i x\xF3a b\xE0i vi\u1EBFt', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "admin/dashboard", "id": "admin/dashboard", "file": "admin/dashboard.ts", "absPath": "/admin/dashboard", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { UserEntity, QuestionEntity, CommentEntity } from '@/server/models/entities';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n\n  if (req.method === 'GET') {\n    try {\n      const totalUsers = await UserEntity.count();\n      const totalPosts = await QuestionEntity.count();\n      const totalComments = await CommentEntity.count();\n      const activeUsers = await UserEntity.count({ where: { status: 'active' } });\n\n      res.status(200).json({\n        success: true,\n        data: {\n          totalUsers,\n          totalPosts,\n          totalComments,\n          activeUsers\n        }\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y s\u1ED1 li\u1EC7u th\u1ED1ng k\xEA dashboard', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "posts/[id]/vote", "id": "posts/[id]/vote", "file": "posts/[id]/vote.ts", "absPath": "/posts/[id]/vote", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { VoteEntity, QuestionEntity, CommentEntity, UserEntity } from '@/server/models/entities';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n  const id = req.query?.id as string;\n\n  if (req.method === 'POST') {\n    try {\n      const { targetType, targetId, userId, value } = req.body ?? {};\n\n      if (!targetType || !userId || !value) {\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu th\xF4ng tin targetType, userId ho\u1EB7c value' });\n        return;\n      }\n\n      const voteTargetId = targetId || id;\n      const voteValue = parseInt(value, 10) === 1 ? 1 : -1;\n\n      let targetInstance: any = null;\n      if (targetType === 'question') {\n        targetInstance = await QuestionEntity.findByPk(voteTargetId);\n      } else if (targetType === 'comment') {\n        targetInstance = await CommentEntity.findByPk(voteTargetId);\n      }\n\n      if (!targetInstance) {\n        res.status(404).json({ success: false, message: '\u0110\u1ED1i t\u01B0\u1EE3ng \u0111\u01B0\u1EE3c vote kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      const author = await UserEntity.findByPk(targetInstance.authorId);\n\n      const existingVote = await VoteEntity.findOne({\n        where: { userId, targetId: voteTargetId, targetType }\n      });\n\n      let finalVoteValue = targetInstance.votes;\n\n      if (!existingVote) {\n        await VoteEntity.create({\n          id: Date.now().toString(),\n          userId,\n          targetId: voteTargetId,\n          targetType,\n          value: voteValue\n        });\n\n        targetInstance.votes += voteValue;\n        await targetInstance.save();\n\n        if (author) {\n          author.reputation += voteValue * 10;\n          await author.save();\n        }\n\n        finalVoteValue = targetInstance.votes;\n      } else if (existingVote.value === voteValue) {\n        await existingVote.destroy();\n\n        targetInstance.votes -= voteValue;\n        await targetInstance.save();\n\n        if (author) {\n          author.reputation -= voteValue * 10;\n          await author.save();\n        }\n\n        finalVoteValue = targetInstance.votes;\n      } else {\n        existingVote.value = voteValue;\n        await existingVote.save();\n\n        const diff = voteValue * 2;\n        targetInstance.votes += diff;\n        await targetInstance.save();\n\n        if (author) {\n          author.reputation += diff * 10;\n          await author.save();\n        }\n\n        finalVoteValue = targetInstance.votes;\n      }\n\n      res.status(200).json({\n        success: true,\n        message: 'C\u1EADp nh\u1EADt vote th\xE0nh c\xF4ng',\n        data: { votes: finalVoteValue }\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i x\u1EED l\xFD vote', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "auth/register", "id": "auth/register", "file": "auth/register.ts", "absPath": "/auth/register", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { register } from '@/server/services/authService';\nimport type { UserRole } from '@/server/models/User';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  if (req.method !== 'POST') {\n    res.status(405).json({ success: false, message: 'Method not allowed' });\n    return;\n  }\n\n  try {\n    const { name, email, password, role, department, studentId } = req.body ?? {};\n    const result = await register({\n      name,\n      email,\n      password,\n      role: (role as UserRole) || 'student',\n      department,\n      studentId,\n    });\n    res.status(201).json({ success: true, data: result });\n  } catch (error: unknown) {\n    const message = error instanceof Error ? error.message : '\u0110\u0103ng k\xFD th\u1EA5t b\u1EA1i';\n    res.status(400).json({ success: false, message });\n  }\n}\n" }, { "path": "leaderboard", "id": "leaderboard", "file": "leaderboard.ts", "absPath": "/leaderboard", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { UserEntity } from '@/server/models/entities';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n\n  if (req.method === 'GET') {\n    try {\n      const users = await UserEntity.findAll({\n        attributes: { exclude: ['password'] },\n        where: { status: 'active' },\n        order: [['reputation', 'DESC']],\n        limit: 50\n      });\n\n      const formatted = users.map((u: any) => {\n        const data = u.toJSON();\n        return {\n          ...data,\n          dept: u.department || '',\n          joined: u.joinDate ? u.joinDate.substring(0, 4) : ''\n        };\n      });\n\n      res.status(200).json({ success: true, data: { list: formatted } });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y b\u1EA3ng x\u1EBFp h\u1EA1ng', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "posts", "id": "posts/index", "file": "posts/index.ts", "absPath": "/posts", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { initDatabase } from '@/server/db';\nimport { QuestionEntity, UserEntity, TagEntity } from '@/server/models/entities';\nimport { Op } from 'sequelize';\n\nexport function formatTime(date: Date) {\n  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);\n  if (seconds < 0) return 'V\u1EEBa xong';\n  if (seconds < 60) return 'V\u1EEBa xong';\n  const minutes = Math.floor(seconds / 60);\n  if (minutes < 60) return `${minutes} ph\xFAt tr\u01B0\u1EDBc`;\n  const hours = Math.floor(minutes / 60);\n  if (hours < 24) return `${hours} gi\u1EDD tr\u01B0\u1EDBc`;\n  const days = Math.floor(hours / 24);\n  if (days < 30) return `${days} ng\xE0y tr\u01B0\u1EDBc`;\n  return new Date(date).toLocaleDateString('vi-VN');\n}\n\nexport function formatQuestion(q: any) {\n  return {\n    id: q.id,\n    title: q.title,\n    excerpt: q.excerpt,\n    content: q.content,\n    author: q.author ? q.author.name : 'Unknown',\n    authorId: q.authorId,\n    authorRole: q.author ? q.author.role : 'student',\n    authorRep: q.author ? q.author.reputation : 0,\n    tags: q.questionTags ? q.questionTags.map((t: any) => t.name) : [],\n    votes: q.votes,\n    comments: q.commentsCount,\n    views: q.views,\n    timestamp: formatTime(q.createdAt),\n    subject: q.subject,\n    isSolved: q.isSolved,\n    status: q.status,\n    createdAt: q.createdAt\n  };\n}\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n\n  if (req.method === 'GET') {\n    try {\n      const { tag, q, sort, authorId } = req.query ?? {};\n      \n      const whereClause: any = { status: { [Op.ne]: 'hidden' } };\n\n      if (authorId) {\n        whereClause.authorId = authorId;\n      }\n\n      if (typeof q === 'string' && q.trim()) {\n        const keyword = `%${q.trim()}%`;\n        whereClause[Op.or] = [\n          { title: { [Op.like]: keyword } },\n          { content: { [Op.like]: keyword } }\n        ];\n      }\n\n      let orderClause: any = [['createdAt', 'DESC']];\n      if (sort === 'votes') {\n        orderClause = [['votes', 'DESC']];\n      } else if (sort === 'views') {\n        orderClause = [['views', 'DESC']];\n      }\n\n      const tagInclude: any = {\n        model: TagEntity,\n        as: 'questionTags',\n        through: { attributes: [] }\n      };\n\n      if (typeof tag === 'string' && tag.trim()) {\n        tagInclude.where = { name: tag.trim() };\n      }\n\n      const questions = await QuestionEntity.findAll({\n        where: whereClause,\n        include: [\n          { model: UserEntity, as: 'author', attributes: ['name', 'role', 'reputation'] },\n          tagInclude\n        ],\n        order: orderClause\n      });\n\n      const list = questions.map(formatQuestion);\n\n      res.status(200).json({ success: true, data: { list } });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y danh s\xE1ch b\xE0i vi\u1EBFt', error: String(error) });\n    }\n    return;\n  }\n\n  if (req.method === 'POST') {\n    try {\n      const { title, content, subject, tags, authorId } = req.body ?? {};\n      \n      if (!title || !content || !authorId) {\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu th\xF4ng tin ti\xEAu \u0111\u1EC1, n\u1ED9i dung ho\u1EB7c ng\u01B0\u1EDDi \u0111\u0103ng' });\n        return;\n      }\n\n      const user = await UserEntity.findByPk(authorId);\n      if (!user) {\n        res.status(404).json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\n        return;\n      }\n\n      const excerpt = content.substring(0, 180) + (content.length > 180 ? '...' : '');\n\n      const newQuestion = await QuestionEntity.create({\n        id: Date.now().toString(),\n        title,\n        excerpt,\n        content,\n        authorId,\n        votes: 0,\n        commentsCount: 0,\n        views: 0,\n        subject,\n        isSolved: false,\n        status: 'active',\n        createdAt: new Date()\n      });\n\n      if (Array.isArray(tags) && tags.length > 0) {\n        const tagsInDb = await TagEntity.findAll({ where: { name: tags } });\n        await (newQuestion as any).setQuestionTags(tagsInDb);\n        \n        for (const t of tagsInDb) {\n          t.count += 1;\n          await t.save();\n        }\n      }\n\n      user.posts += 1;\n      await user.save();\n\n      try {\n        const { notifyNewPost } = await import('@/server/utils/email');\n        await notifyNewPost(newQuestion.id, user.email);\n      } catch (err) {\n        console.error('[Email] L\u1ED7i g\u1EEDi email th\xF4ng b\xE1o b\xE0i vi\u1EBFt m\u1EDBi:', err);\n      }\n\n      res.status(201).json({\n        success: true,\n        message: '\u0110\u0103ng b\xE0i vi\u1EBFt th\xE0nh c\xF4ng!',\n        data: { id: newQuestion.id }\n      });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i t\u1EA1o b\xE0i vi\u1EBFt', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }, { "path": "auth/login", "id": "auth/login", "file": "auth/login.ts", "absPath": "/auth/login", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { login } from '@/server/services/authService';\n\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  if (req.method !== 'POST') {\n    res.status(405).json({ success: false, message: 'Method not allowed' });\n    return;\n  }\n\n  try {\n    const { email, password } = req.body ?? {};\n    const result = await login({ email, password });\n    res.status(200).json({ success: true, data: result });\n  } catch (error: unknown) {\n    const message = error instanceof Error ? error.message : '\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i';\n    res.status(401).json({ success: false, message });\n  }\n}\n" }, { "path": "tags", "id": "tags", "file": "tags.ts", "absPath": "/tags", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { initDatabase } from '@/server/db';\r\nimport { TagEntity } from '@/server/models/entities';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      const tags = await TagEntity.findAll({\r\n        order: [['count', 'DESC']]\r\n      });\r\n      res.status(200).json({ success: true, data: { list: tags } });\r\n    } catch (error) {\r\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y danh s\xE1ch th\u1EBB', error: String(error) });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n\r\n" }];
var users_default = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await handler(umiReq, umiRes);
};
