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
    };
    UserEntity.init(
      {
        id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
        name: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        email: { type: import_sequelize.DataTypes.STRING, allowNull: false, unique: true },
        password: { type: import_sequelize.DataTypes.STRING(255), allowNull: true },
        role: {
          type: import_sequelize.DataTypes.ENUM("sinhvien", "giangvien", "admin"),
          defaultValue: "sinhvien"
        },
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
        status: {
          type: import_sequelize.DataTypes.ENUM("active", "banned"),
          defaultValue: "active"
        }
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: false
      }
    );
    TagEntity = class extends import_sequelize.Model {
    };
    TagEntity.init(
      {
        name: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
        count: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
        color: {
          type: import_sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: "#3b82f6"
        },
        category: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        desc: { type: import_sequelize.DataTypes.TEXT, allowNull: true }
      },
      {
        sequelize,
        modelName: "Tag",
        tableName: "Tags",
        timestamps: false
      }
    );
    QuestionEntity = class extends import_sequelize.Model {
    };
    QuestionEntity.init(
      {
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
        status: {
          type: import_sequelize.DataTypes.ENUM("active", "reported", "hidden"),
          defaultValue: "active"
        },
        createdAt: { type: import_sequelize.DataTypes.DATE, defaultValue: import_sequelize.DataTypes.NOW }
      },
      {
        sequelize,
        modelName: "Question",
        tableName: "Questions",
        timestamps: true,
        updatedAt: false
      }
    );
    CommentEntity = class extends import_sequelize.Model {
    };
    CommentEntity.init(
      {
        id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
        questionId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        parentId: { type: import_sequelize.DataTypes.STRING, allowNull: true },
        authorId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        votes: { type: import_sequelize.DataTypes.INTEGER, defaultValue: 0 },
        isBest: { type: import_sequelize.DataTypes.BOOLEAN, defaultValue: false },
        content: { type: import_sequelize.DataTypes.TEXT, allowNull: false },
        createdAt: { type: import_sequelize.DataTypes.DATE, defaultValue: import_sequelize.DataTypes.NOW }
      },
      {
        sequelize,
        modelName: "Comment",
        tableName: "Comments",
        timestamps: true,
        updatedAt: false
      }
    );
    VoteEntity = class extends import_sequelize.Model {
    };
    VoteEntity.init(
      {
        id: { type: import_sequelize.DataTypes.STRING, primaryKey: true },
        userId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        targetId: { type: import_sequelize.DataTypes.STRING, allowNull: false },
        targetType: {
          type: import_sequelize.DataTypes.ENUM("question", "comment"),
          allowNull: false
        },
        value: { type: import_sequelize.DataTypes.INTEGER, allowNull: false }
      },
      {
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
      }
    );
    UserEntity.hasMany(QuestionEntity, { foreignKey: "authorId", as: "questions" });
    QuestionEntity.belongsTo(UserEntity, { foreignKey: "authorId", as: "author" });
    UserEntity.hasMany(CommentEntity, { foreignKey: "authorId", as: "comments" });
    CommentEntity.belongsTo(UserEntity, { foreignKey: "authorId", as: "author" });
    QuestionEntity.hasMany(CommentEntity, {
      foreignKey: "questionId",
      as: "questionComments"
    });
    CommentEntity.belongsTo(QuestionEntity, { foreignKey: "questionId" });
    CommentEntity.hasMany(CommentEntity, { foreignKey: "parentId", as: "replies" });
    CommentEntity.belongsTo(CommentEntity, {
      foreignKey: "parentId",
      as: "parent"
    });
    QuestionEntity.belongsToMany(TagEntity, {
      through: "QuestionTags",
      foreignKey: "questionId",
      as: "questionTags"
    });
    TagEntity.belongsToMany(QuestionEntity, {
      through: "QuestionTags",
      foreignKey: "tagName",
      as: "taggedQuestions"
    });
  }
});

// src/server/models/User.ts
async function hashPassword(plain) {
  return import_bcryptjs.default.hash(plain, 10);
}
async function verifyPassword(plain, hash) {
  if (!hash) return false;
  try {
    return await import_bcryptjs.default.compare(plain, hash);
  } catch (error) {
    console.error("[Password Verify] L\u1ED7i so s\xE1nh m\u1EADt kh\u1EA9u:", error);
    return false;
  }
}
var import_bcryptjs;
var init_User = __esm({
  "src/server/models/User.ts"() {
    "use strict";
    import_bcryptjs = __toESM(require("bcryptjs"));
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
        authorRole: "sinhvien",
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
        authorId: "3",
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
        authorId: "5",
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
        authorId: "6",
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
          authorRole: "giangvien",
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
          authorRole: "sinhvien",
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
        role: "sinhvien",
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
        role: "giangvien",
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
        role: "sinhvien",
        department: "C\xF4ng Ngh\u1EC7 Th\xF4ng Tin",
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
        role: "giangvien",
        department: "K\u1EF9 Thu\u1EADt Ph\u1EA7n M\u1EC1m",
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
        role: "sinhvien",
        department: "An To\xE0n Th\xF4ng Tin",
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
    await UserEntity.sequelize?.sync({});
    console.log("[Database] \u0110\u1ED3ng b\u1ED9 c\xE1c b\u1EA3ng th\xE0nh c\xF4ng.");
    const userCount = await UserEntity.count();
    if (userCount === 0) {
      console.log("[Database] B\u1EA3ng Users tr\u1ED1ng, b\u1EAFt \u0111\u1EA7u seed d\u1EEF li\u1EC7u m\u1EABu...");
      for (const u of MOCK_ADMIN_USERS) {
        await UserEntity.create({
          id: u.id,
          name: u.name,
          email: u.email,
          password: await hashPassword("12345678"),
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
    init_questions();
    init_tags();
    init_users();
    init_questions();
    init_tags();
    init_users();
  }
});

// src/server/db.ts
async function initDatabase() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await sequelize.authenticate();
        console.log("[Database] K\u1EBFt n\u1ED1i MySQL th\xE0nh c\xF4ng.");
        const { seedDatabase: seedDatabase2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
        await seedDatabase2();
        isInitialized = true;
      } catch (error) {
        initPromise = null;
        console.error(
          "[Database] Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i t\u1EDBi c\u01A1 s\u1EDF d\u1EEF li\u1EC7u MySQL. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i d\u1ECBch v\u1EE5 MySQL local v\xE0 \u0111\u1EA3m b\u1EA3o \u0111\xE3 t\u1EA1o database `edu_forum`. Error:",
          error
        );
      }
    })();
  }
  return initPromise;
}
var import_mysql2, import_sequelize2, dbName, dbUser, dbPassword, dbHost, dbPort, useSsl, sequelize, isInitialized, initPromise;
var init_db = __esm({
  "src/server/db.ts"() {
    "use strict";
    import_mysql2 = __toESM(require("mysql2"));
    import_sequelize2 = require("sequelize");
    dbName = process.env.DB_NAME || "edu_forum";
    dbUser = process.env.DB_USER || "root";
    dbPassword = process.env.DB_PASSWORD ?? "";
    dbHost = process.env.DB_HOST || "localhost";
    dbPort = parseInt(process.env.DB_PORT || "3306", 10);
    console.log(
      `[Database] \u0110ang k\u1EBFt n\u1ED1i t\u1EDBi MySQL: host=${dbHost}, port=${dbPort}, database=${dbName}, user=${dbUser}`
    );
    useSsl = process.env.DB_SSL === "true";
    sequelize = new import_sequelize2.Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: "mysql",
      // Import tĩnh để bundler đóng gói mysql2 vào serverless function (Vercel)
      dialectModule: import_mysql2.default,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: useSsl ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } } : {},
      pool: {
        max: 5,
        min: 0,
        acquire: 3e4,
        idle: 1e4
      }
    });
    isInitialized = false;
    initPromise = null;
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

// src/.umi-production/api/auth/login.ts
var login_exports = {};
__export(login_exports, {
  default: () => login_default
});
module.exports = __toCommonJS(login_exports);

// src/.umi-production/api/_middlewares.ts
var middlewares_default = async (req, res, next) => {
  next();
};

// src/server/services/authService.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
init_db();
init_entities();
init_User();
var AuthError = class extends Error {
  status;
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
};
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
var JWT_EXPIRATION = "7d";
function createToken(userId) {
  return import_jsonwebtoken.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}
async function login(input) {
  await initDatabase();
  const { email, password } = input;
  const found = await UserEntity.findOne({ where: { email } });
  if (found) {
    const checkVerify = await verifyPassword(password, found.password);
    if (found.status === "banned") {
      throw new AuthError(
        "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111\xE3 b\u1ECB kh\xF3a b\u1EDFi qu\u1EA3n tr\u1ECB vi\xEAn",
        403
      );
    }
    if (checkVerify) {
      const userObj = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        department: found.department,
        major: found.major,
        studentId: found.studentId,
        avatar: found.avatar,
        bio: found.bio,
        reputation: found.reputation,
        posts: found.posts,
        answers: found.answers,
        votes: found.votes,
        followers: found.followers,
        following: found.following,
        joinDate: found.joinDate,
        badges: found.badges,
        status: found.status
      };
      return { user: userObj, token: createToken(found.id) };
    }
  }
  throw new AuthError("Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c", 401);
}

// src/utils/validation.ts
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}
function validateLoginInput(data) {
  const errors = [];
  if (!data.email || !isValidEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Vui l\xF2ng nh\u1EADp email h\u1EE3p l\u1EC7"
    });
  }
  if (!data.password || data.password.length < 1) {
    errors.push({
      field: "password",
      message: "Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u"
    });
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// src/api/auth/login.ts
async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }
  try {
    const { email, password } = req.body ?? {};
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      });
      return;
    }
    const result = await login({ email: email.toLowerCase().trim(), password });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i";
    const statusCode = error instanceof AuthError ? error.status : 401;
    res.status(statusCode).json({ success: false, message });
  }
}

// src/.umi-production/api/auth/login.ts
var import_apiRoute = __toESM(require_apiRoute());
var apiRoutes = [{ "path": "admin/users/[userId]", "id": "admin/users/[userId]", "file": "admin/users/[userId].js", "absPath": "/admin/users/[userId]", "__content": "import { initDatabase } from '@/server/db';\r\nimport { requireAuth } from '@/server/middlewares/auth';\r\nimport { UserEntity } from '@/server/models/entities';\r\nimport { hashPassword } from '@/server/models/User';\r\n\r\nexport default async function handler(req, res) {\r\n  await initDatabase();\r\n\r\n  // Check auth & role\r\n  const auth = await requireAuth(req);\r\n  if (!auth) {\r\n    return res.status(401).json({\r\n      success: false,\r\n      message: 'B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp \u0111\u1EC3 truy c\u1EADp t\xEDnh n\u0103ng n\xE0y',\r\n    });\r\n  }\r\n\r\n  // Verify admin role from database\r\n  const adminUser = await UserEntity.findByPk(auth.userId);\r\n  if (!adminUser || adminUser.role.toLowerCase() !== 'admin') {\r\n    return res.status(403).json({\r\n      success: false,\r\n      message: 'B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp t\xEDnh n\u0103ng c\u1EE7a Admin',\r\n    });\r\n  }\r\n\r\n  // Extract userId from URL path - optimize for UmiJS dynamic routes\r\n  const userId = req.query?.userId || req.params?.userId;\r\n\r\n  if (!userId) {\r\n    return res.status(400).json({\r\n      success: false,\r\n      message: 'ID ng\u01B0\u1EDDi d\xF9ng kh\xF4ng h\u1EE3p l\u1EC7',\r\n    });\r\n  }\r\n\r\n  if (req.method === 'PUT') {\r\n    return handleUpdateUser(req, res, userId);\r\n  } else if (req.method === 'PATCH') {\r\n    return handleResetPassword(req, res, userId);\r\n  } else if (req.method === 'DELETE') {\r\n    return handleDeleteUser(req, res, userId);\r\n  } else {\r\n    return res\r\n      .status(405)\r\n      .json({ success: false, message: 'Method not allowed' });\r\n  }\r\n}\r\n\r\nasync function handleUpdateUser(req, res, userId) {\r\n  try {\r\n    const { name, role, status } = req.body ?? {};\r\n\r\n    // Find user\r\n    const user = await UserEntity.findByPk(userId);\r\n    if (!user) {\r\n      return res.status(404).json({\r\n        success: false,\r\n        message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i',\r\n      });\r\n    }\r\n\r\n    // Update allowed fields\r\n    if (name) {\r\n      user.name = name.trim();\r\n    }\r\n\r\n    if (role && ['sinhvien', 'giangvien', 'admin'].includes(role)) {\r\n      user.role = role;\r\n    }\r\n\r\n    // Update status (kh\xF3a/m\u1EDF kh\xF3a t\xE0i kho\u1EA3n)\r\n    if (status && ['active', 'banned'].includes(status)) {\r\n      user.status = status;\r\n    }\r\n\r\n    await user.save();\r\n\r\n    res.status(200).json({\r\n      success: true,\r\n      message: 'C\u1EADp nh\u1EADt th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng th\xE0nh c\xF4ng',\r\n      data: {\r\n        id: user.id,\r\n        name: user.name,\r\n        email: user.email,\r\n        role: user.role,\r\n        status: user.status,\r\n        reputation: user.reputation,\r\n      },\r\n    });\r\n  } catch (error) {\r\n    console.error('Error updating user:', error);\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i c\u1EADp nh\u1EADt ng\u01B0\u1EDDi d\xF9ng',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n\r\nasync function handleResetPassword(req, res, userId) {\r\n  try {\r\n    const { newPassword } = req.body ?? {};\r\n\r\n    if (!newPassword || newPassword.trim().length < 6) {\r\n      return res.status(400).json({\r\n        success: false,\r\n        message: 'M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i \xEDt nh\u1EA5t 6 k\xFD t\u1EF1',\r\n      });\r\n    }\r\n\r\n    // Find user\r\n    const user = await UserEntity.findByPk(userId);\r\n    if (!user) {\r\n      return res.status(404).json({\r\n        success: false,\r\n        message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i',\r\n      });\r\n    }\r\n\r\n    // Hash and update password\r\n    const hashedPassword = await hashPassword(newPassword.trim());\r\n    user.password = hashedPassword;\r\n    await user.save();\r\n\r\n    res.status(200).json({\r\n      success: true,\r\n      message: 'C\u1EA5p l\u1EA1i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng',\r\n      data: {\r\n        id: user.id,\r\n        name: user.name,\r\n        email: user.email,\r\n      },\r\n    });\r\n  } catch (error) {\r\n    console.error('Error resetting password:', error);\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i c\u1EA5p l\u1EA1i m\u1EADt kh\u1EA9u',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n\r\nasync function handleDeleteUser(req, res, userId) {\r\n  try {\r\n    // Prevent admin from deleting themselves\r\n    const auth = await requireAuth(req);\r\n    if (auth && auth.userId === userId) {\r\n      return res.status(400).json({\r\n        success: false,\r\n        message: 'B\u1EA1n kh\xF4ng th\u1EC3 x\xF3a ch\xEDnh m\xECnh',\r\n      });\r\n    }\r\n\r\n    // Find and delete user\r\n    const user = await UserEntity.findByPk(userId);\r\n    if (!user) {\r\n      return res.status(404).json({\r\n        success: false,\r\n        message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i',\r\n      });\r\n    }\r\n\r\n    // Delete with cascade\r\n    await user.destroy();\r\n\r\n    res.status(200).json({\r\n      success: true,\r\n      message: 'X\xF3a ng\u01B0\u1EDDi d\xF9ng th\xE0nh c\xF4ng',\r\n      data: {\r\n        id: user.id,\r\n        name: user.name,\r\n      },\r\n    });\r\n  } catch (error) {\r\n    console.error('Error deleting user:', error);\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i x\xF3a ng\u01B0\u1EDDi d\xF9ng',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n" }, { "path": "posts/[id]/comments", "id": "posts/[id]/comments", "file": "posts/[id]/comments.ts", "absPath": "/posts/[id]/comments", "__content": "import { initDatabase } from '@/server/db';\r\nimport { requireAuth, requireRole } from '@/server/middlewares/auth';\r\nimport {\r\n  CommentEntity,\r\n  QuestionEntity,\r\n  UserEntity,\r\n} from '@/server/models/entities';\r\nimport { notifyNewReply } from '@/server/utils/email';\r\nimport { validateCommentInput } from '@/utils/validation';\r\nimport type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { formatTime } from '../index';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  // Extract id from query (UmiJS passes dynamic segments as query params)\r\n  let id = req.query?.id as string;\r\n\r\n  // If not in query, try to extract from URL path\r\n  if (!id && req.url) {\r\n    const match = req.url.match(/\\/api\\/posts\\/([^/?]+)/);\r\n    id = match ? match[1] : undefined;\r\n  }\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      const comments = await CommentEntity.findAll({\r\n        where: { questionId: id, parentId: null },\r\n        include: [\r\n          {\r\n            model: UserEntity,\r\n            as: 'author',\r\n            attributes: ['name', 'role', 'reputation'],\r\n          },\r\n          {\r\n            model: CommentEntity,\r\n            as: 'replies',\r\n            include: [\r\n              {\r\n                model: UserEntity,\r\n                as: 'author',\r\n                attributes: ['name', 'role', 'reputation'],\r\n              },\r\n            ],\r\n          },\r\n        ],\r\n        order: [['createdAt', 'ASC']],\r\n      });\r\n\r\n      const list = comments.map((c: any) => ({\r\n        id: c.id,\r\n        questionId: c.questionId,\r\n        parentId: c.parentId,\r\n        author: c.author ? c.author.name : 'Unknown',\r\n        authorId: c.authorId,\r\n        authorRole: c.author ? c.author.role : 'sinhvien',\r\n        authorRep: c.author ? c.author.reputation : 0,\r\n        avatar: c.author ? c.author.name.charAt(0) : 'U',\r\n        timestamp: formatTime(c.createdAt),\r\n        votes: c.votes,\r\n        isBest: c.isBest,\r\n        content: c.content,\r\n        replies: c.replies\r\n          ? c.replies.map((r: any) => ({\r\n              id: r.id,\r\n              author: r.author ? r.author.name : 'Unknown',\r\n              authorId: r.authorId,\r\n              timestamp: formatTime(r.createdAt),\r\n              content: r.content,\r\n              votes: r.votes,\r\n            }))\r\n          : [],\r\n      }));\r\n\r\n      res.status(200).json({ success: true, data: list });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i l\u1EA5y danh s\xE1ch b\xECnh lu\u1EADn',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'POST') {\r\n    try {\r\n      const { content, parentId } = req.body ?? {};\r\n\r\n      // Validate input\r\n      const validation = validateCommentInput({ content });\r\n      if (!validation.isValid) {\r\n        res.status(400).json({\r\n          success: false,\r\n          message: 'Validation failed',\r\n          errors: validation.errors,\r\n        });\r\n        return;\r\n      }\r\n\r\n      // Danh t\xEDnh ng\u01B0\u1EDDi b\xECnh lu\u1EADn l\u1EA5y t\u1EEB JWT, kh\xF4ng tin v\xE0o body\r\n      const auth = await requireAuth(req);\r\n      if (!auth) {\r\n        res\r\n          .status(401)\r\n          .json({ success: false, message: 'Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 b\xECnh lu\u1EADn' });\r\n        return;\r\n      }\r\n      const authorId = auth.userId;\r\n\r\n      const question = await QuestionEntity.findByPk(id);\r\n      if (!question) {\r\n        res\r\n          .status(404)\r\n          .json({ success: false, message: 'B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n        return;\r\n      }\r\n\r\n      const user = await UserEntity.findByPk(authorId);\r\n      if (!user) {\r\n        res\r\n          .status(404)\r\n          .json({ success: false, message: 'T\xE1c gi\u1EA3 kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n        return;\r\n      }\r\n\r\n      const newComment = await CommentEntity.create({\r\n        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,\r\n        questionId: id,\r\n        parentId: parentId || null,\r\n        authorId,\r\n        votes: 0,\r\n        isBest: false,\r\n        content: content.trim(),\r\n        createdAt: new Date(),\r\n      });\r\n\r\n      // T\u0103ng \u0111\u1EBFm atomic, tr\xE1nh lost update\r\n      await question.increment('commentsCount');\r\n      await user.increment('answers');\r\n\r\n      try {\r\n        if (parentId) {\r\n          const parentComment = await CommentEntity.findByPk(parentId, {\r\n            include: [\r\n              { model: UserEntity, as: 'author', attributes: ['email'] },\r\n            ],\r\n          });\r\n          if (parentComment && parentComment.author) {\r\n            await notifyNewReply(id, parentComment.author.email);\r\n          }\r\n        } else {\r\n          const questionAuthor = await UserEntity.findByPk(question.authorId);\r\n          if (questionAuthor) {\r\n            await notifyNewReply(id, questionAuthor.email);\r\n          }\r\n        }\r\n      } catch (err) {\r\n        console.error('[Email] L\u1ED7i g\u1EEDi email th\xF4ng b\xE1o:', err);\r\n      }\r\n\r\n      res.status(201).json({\r\n        success: true,\r\n        message: 'Th\xEAm b\xECnh lu\u1EADn th\xE0nh c\xF4ng',\r\n        data: {\r\n          id: newComment.id,\r\n          author: user.name,\r\n          authorId: user.id,\r\n          authorRole: user.role,\r\n          authorRep: user.reputation,\r\n          avatar: user.name.charAt(0),\r\n          timestamp: 'V\u1EEBa xong',\r\n          votes: 0,\r\n          isBest: false,\r\n          content: newComment.content,\r\n          replies: [],\r\n        },\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i th\xEAm b\xECnh lu\u1EADn',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'PUT') {\r\n    try {\r\n      const { commentId, isBest } = req.body ?? {};\r\n      if (!commentId) {\r\n        res.status(400).json({ success: false, message: 'Thi\u1EBFu commentId' });\r\n        return;\r\n      }\r\n\r\n      const question = await QuestionEntity.findByPk(id);\r\n      if (!question) {\r\n        res\r\n          .status(404)\r\n          .json({ success: false, message: 'B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n        return;\r\n      }\r\n\r\n      // T\xE1c gi\u1EA3 b\xE0i vi\u1EBFt ho\u1EB7c ng\u01B0\u1EDDi ki\u1EC3m duy\u1EC7t (admin/gi\u1EA3ng vi\xEAn)\r\n      // \u0111\u01B0\u1EE3c ch\u1ECDn c\xE2u tr\u1EA3 l\u1EDDi hay nh\u1EA5t\r\n      const auth = await requireAuth(req);\r\n      const isModerator = requireRole(auth, ['admin', 'giangvien']);\r\n      if (!auth || (!isModerator && auth.userId !== question.authorId)) {\r\n        res.status(403).json({\r\n          success: false,\r\n          message:\r\n            'Ch\u1EC9 t\xE1c gi\u1EA3 b\xE0i vi\u1EBFt ho\u1EB7c gi\u1EA3ng vi\xEAn/qu\u1EA3n tr\u1ECB vi\xEAn m\u1EDBi \u0111\u01B0\u1EE3c ch\u1ECDn c\xE2u tr\u1EA3 l\u1EDDi hay nh\u1EA5t',\r\n        });\r\n        return;\r\n      }\r\n\r\n      const comment = await CommentEntity.findByPk(commentId);\r\n      if (!comment || comment.questionId !== id) {\r\n        res\r\n          .status(404)\r\n          .json({ success: false, message: 'B\xECnh lu\u1EADn kh\xF4ng thu\u1ED9c b\xE0i vi\u1EBFt n\xE0y' });\r\n        return;\r\n      }\r\n\r\n      if (isBest) {\r\n        await CommentEntity.update(\r\n          { isBest: false },\r\n          { where: { questionId: id } },\r\n        );\r\n      }\r\n\r\n      comment.isBest = !!isBest;\r\n      await comment.save();\r\n\r\n      // T\xEDnh l\u1EA1i isSolved d\u1EF1a tr\xEAn vi\u1EC7c c\xF2n c\xE2u tr\u1EA3 l\u1EDDi hay nh\u1EA5t n\xE0o kh\xF4ng\r\n      const bestCount = await CommentEntity.count({\r\n        where: { questionId: id, isBest: true },\r\n      });\r\n      question.isSolved = bestCount > 0;\r\n      await question.save();\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        message: 'C\u1EADp nh\u1EADt c\xE2u tr\u1EA3 l\u1EDDi hay nh\u1EA5t th\xE0nh c\xF4ng',\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i c\u1EADp nh\u1EADt b\xECnh lu\u1EADn',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "admin/users", "id": "admin/users/index", "file": "admin/users/index.js", "absPath": "/admin/users", "__content": "import { initDatabase } from '@/server/db';\r\nimport { requireAuth } from '@/server/middlewares/auth';\r\nimport { UserEntity } from '@/server/models/entities';\r\nimport { hashPassword } from '@/server/models/User';\r\n\r\nexport default async function handler(req, res) {\r\n  await initDatabase();\r\n\r\n  // Check auth & role\r\n  const auth = await requireAuth(req);\r\n  if (!auth) {\r\n    return res.status(401).json({\r\n      success: false,\r\n      message: 'B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp \u0111\u1EC3 truy c\u1EADp t\xEDnh n\u0103ng n\xE0y',\r\n    });\r\n  }\r\n\r\n  // Verify admin role from database\r\n  const adminUser = await UserEntity.findByPk(auth.userId);\r\n  if (!adminUser || adminUser.role !== 'admin') {\r\n    return res.status(403).json({\r\n      success: false,\r\n      message: 'B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp t\xEDnh n\u0103ng c\u1EE7a Admin',\r\n    });\r\n  }\r\n\r\n  if (req.method === 'GET') {\r\n    return handleGetUsers(req, res);\r\n  } else if (req.method === 'POST') {\r\n    return handleCreateUser(req, res);\r\n  } else {\r\n    return res\r\n      .status(405)\r\n      .json({ success: false, message: 'Method not allowed' });\r\n  }\r\n}\r\n\r\nasync function handleGetUsers(req, res) {\r\n  try {\r\n    const users = await UserEntity.findAll({\r\n      attributes: [\r\n        'id',\r\n        'name',\r\n        'email',\r\n        'role',\r\n        'status',\r\n        'reputation',\r\n        'posts',\r\n        'answers',\r\n        'joinDate',\r\n        'avatar',\r\n      ],\r\n      order: [['joinDate', 'DESC']],\r\n    });\r\n\r\n    const formattedUsers = users.map((user) => ({\r\n      id: user.id,\r\n      name: user.name,\r\n      email: user.email,\r\n      role: user.role,\r\n      status: user.status || 'active',\r\n      reputation: user.reputation,\r\n      posts: user.posts,\r\n      answers: user.answers,\r\n      joinDate: user.joinDate,\r\n      avatar: user.avatar || user.name.charAt(0),\r\n    }));\r\n\r\n    res.status(200).json({\r\n      success: true,\r\n      data: {\r\n        list: formattedUsers,\r\n        total: formattedUsers.length,\r\n      },\r\n    });\r\n  } catch (error) {\r\n    console.error('Error fetching users:', error);\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i l\u1EA5y danh s\xE1ch ng\u01B0\u1EDDi d\xF9ng',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n\r\nasync function handleCreateUser(req, res) {\r\n  try {\r\n    const { name, email, password, role, department, studentId } =\r\n      req.body ?? {};\r\n\r\n    // Validate input\r\n    if (!name || !email || !password || !role) {\r\n      return res.status(400).json({\r\n        success: false,\r\n        message: 'Thi\u1EBFu th\xF4ng tin: name, email, password, role',\r\n      });\r\n    }\r\n\r\n    // Validate role\r\n    if (!['sinhvien', 'giangvien', 'admin'].includes(role)) {\r\n      return res.status(400).json({\r\n        success: false,\r\n        message: 'Vai tr\xF2 kh\xF4ng h\u1EE3p l\u1EC7',\r\n      });\r\n    }\r\n\r\n    // Check email exists\r\n    const existingUser = await UserEntity.findOne({\r\n      where: { email: email.toLowerCase().trim() },\r\n    });\r\n\r\n    if (existingUser) {\r\n      return res.status(409).json({\r\n        success: false,\r\n        message: 'Email n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng',\r\n      });\r\n    }\r\n\r\n    // Hash password\r\n    const hashedPassword = await hashPassword(password);\r\n\r\n    // Create new user\r\n    const newUser = await UserEntity.create({\r\n      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,\r\n      name: name.trim(),\r\n      email: email.toLowerCase().trim(),\r\n      password: hashedPassword,\r\n      role,\r\n      department: department || 'CNTT',\r\n      studentId: studentId || '',\r\n      status: 'active',\r\n      reputation: 10,\r\n      posts: 0,\r\n      answers: 0,\r\n      votes: 0,\r\n      followers: 0,\r\n      following: 0,\r\n      joinDate: new Date().toISOString(),\r\n      badges: [],\r\n    });\r\n\r\n    res.status(201).json({\r\n      success: true,\r\n      message: 'T\u1EA1o ng\u01B0\u1EDDi d\xF9ng m\u1EDBi th\xE0nh c\xF4ng',\r\n      data: {\r\n        id: newUser.id,\r\n        name: newUser.name,\r\n        email: newUser.email,\r\n        role: newUser.role,\r\n        status: newUser.status,\r\n        reputation: newUser.reputation,\r\n        joinDate: newUser.joinDate,\r\n      },\r\n    });\r\n  } catch (error) {\r\n    console.error('Error creating user:', error);\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i t\u1EA1o ng\u01B0\u1EDDi d\xF9ng',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n" }, { "path": "posts/[id]", "id": "posts/[id]/index", "file": "posts/[id]/index.ts", "absPath": "/posts/[id]", "__content": "import { initDatabase } from '@/server/db';\r\nimport { requireAuth, requireRole } from '@/server/middlewares/auth';\r\nimport {\r\n  CommentEntity,\r\n  QuestionEntity,\r\n  TagEntity,\r\n  UserEntity,\r\n} from '@/server/models/entities';\r\nimport type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { formatQuestion } from '../index';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  // Extract id from query (UmiJS passes dynamic segments as query params)\r\n  let id = req.query?.id as string;\r\n\r\n  // If not in query, try to extract from URL path\r\n  if (!id && req.url) {\r\n    const match = req.url.match(/\\/api\\/posts\\/([^/?]+)/);\r\n    id = match ? match[1] : undefined;\r\n  }\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      const question = await QuestionEntity.findOne({\r\n        where: { id },\r\n        include: [\r\n          {\r\n            model: UserEntity,\r\n            as: 'author',\r\n            attributes: ['name', 'role', 'reputation'],\r\n          },\r\n          { model: TagEntity, as: 'questionTags', through: { attributes: [] } },\r\n        ],\r\n      });\r\n\r\n      if (!question) {\r\n        res\r\n          .status(404)\r\n          .json({ success: false, message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt' });\r\n        return;\r\n      }\r\n\r\n      // T\u0103ng view atomic, tr\xE1nh lost update khi nhi\u1EC1u ng\u01B0\u1EDDi xem c\xF9ng l\xFAc\r\n      await question.increment('views');\r\n      question.views += 1; // ph\u1EA3n \xE1nh gi\xE1 tr\u1ECB m\u1EDBi trong response\r\n\r\n      const formattedQuestion = formatQuestion(question);\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        data: {\r\n          question: formattedQuestion,\r\n        },\r\n      });\r\n    } catch (error) {\r\n      console.error('API Error Details:', error);\r\n      const errorMsg = error instanceof Error ? error.message : String(error);\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i l\u1EA5y chi ti\u1EBFt b\xE0i vi\u1EBFt',\r\n        error: errorMsg,\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'DELETE') {\r\n    try {\r\n      // Ki\u1EC3m tra id\r\n      if (!id) {\r\n        res.status(400).json({\r\n          success: false,\r\n          message: 'Thi\u1EBFu ID b\xE0i vi\u1EBFt',\r\n        });\r\n        return;\r\n      }\r\n\r\n      // T\xECm b\xE0i vi\u1EBFt\r\n      const question = await QuestionEntity.findByPk(id);\r\n      if (!question) {\r\n        res.status(404).json({\r\n          success: false,\r\n          message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt',\r\n        });\r\n        return;\r\n      }\r\n\r\n      // Ch\u1EC9 ng\u01B0\u1EDDi ki\u1EC3m duy\u1EC7t (admin/gi\u1EA3ng vi\xEAn) ho\u1EB7c ch\xEDnh t\xE1c gi\u1EA3 m\u1EDBi \u0111\u01B0\u1EE3c x\xF3a b\xE0i\r\n      const auth = await requireAuth(req);\r\n      const isModerator = requireRole(auth, ['admin', 'giangvien']);\r\n      if (!auth || (!isModerator && auth.userId !== question.authorId)) {\r\n        res.status(403).json({\r\n          success: false,\r\n          message: 'B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a b\xE0i vi\u1EBFt n\xE0y',\r\n        });\r\n        return;\r\n      }\r\n\r\n      // X\xF3a c\xE1c comment c\u1EE7a b\xE0i vi\u1EBFt\r\n      await CommentEntity.destroy({ where: { questionId: id } });\r\n\r\n      // X\xF3a c\xE1c tag li\xEAn k\u1EBFt\r\n      await (question as any).setQuestionTags([]);\r\n\r\n      // X\xF3a b\xE0i vi\u1EBFt kh\u1ECFi database\r\n      await question.destroy();\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        message: '\u0110\xE3 x\xF3a b\xE0i vi\u1EBFt th\xE0nh c\xF4ng',\r\n      });\r\n    } catch (error) {\r\n      console.error('DELETE Error:', error);\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i x\xF3a b\xE0i vi\u1EBFt',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "admin/dashboard", "id": "admin/dashboard", "file": "admin/dashboard.ts", "absPath": "/admin/dashboard", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { initDatabase } from '@/server/db';\r\nimport { requireAdminAuth } from '@/server/middlewares/auth';\r\nimport { UserEntity, QuestionEntity, CommentEntity } from '@/server/models/entities';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  // Ch\u1EC9 admin \u0111\u01B0\u1EE3c xem s\u1ED1 li\u1EC7u dashboard\r\n  const admin = await requireAdminAuth(req);\r\n  if (!admin) {\r\n    res.status(403).json({\r\n      success: false,\r\n      message: 'B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp t\xEDnh n\u0103ng c\u1EE7a Admin',\r\n    });\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      const totalUsers = await UserEntity.count();\r\n      const totalPosts = await QuestionEntity.count();\r\n      const totalComments = await CommentEntity.count();\r\n      const activeUsers = await UserEntity.count({ where: { status: 'active' } });\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        data: {\r\n          totalUsers,\r\n          totalPosts,\r\n          totalComments,\r\n          activeUsers\r\n        }\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y s\u1ED1 li\u1EC7u th\u1ED1ng k\xEA dashboard', error: String(error) });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "posts/[id]/vote", "id": "posts/[id]/vote", "file": "posts/[id]/vote.ts", "absPath": "/posts/[id]/vote", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { Op } from 'sequelize';\r\nimport { initDatabase } from '@/server/db';\r\nimport { requireAuth } from '@/server/middlewares/auth';\r\nimport { VoteEntity, QuestionEntity, CommentEntity, UserEntity } from '@/server/models/entities';\r\n\r\n/** C\u1ED9ng/tr\u1EEB reputation, kh\xF4ng cho \xE2m. Kh\xF4ng c\u1ED9ng khi t\u1EF1 vote b\xE0i c\u1EE7a m\xECnh. */\r\nasync function addReputation(author: any, voterId: string, delta: number) {\r\n  if (!author || author.id === voterId) return;\r\n  const newRep = Math.max(0, (author.reputation || 0) + delta);\r\n  await author.update({ reputation: newRep });\r\n}\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n  let id = req.query?.id as string;\r\n\r\n  // If not in query, try to extract from URL path\r\n  if (!id && req.url) {\r\n    const match = req.url.match(/\\/api\\/posts\\/([^/?]+)/);\r\n    id = match ? match[1] : undefined;\r\n  }\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      // L\u1EA5y danh s\xE1ch comment c\u1EE7a b\xE0i \u0111\u1EC3 l\u1ECDc vote ngay trong query\r\n      const comments = await CommentEntity.findAll({\r\n        where: { questionId: id },\r\n        attributes: ['id'],\r\n      });\r\n      const commentIds = comments.map((c) => c.id);\r\n\r\n      // Vote c\u1EE7a ch\xEDnh b\xE0i vi\u1EBFt + vote c\u1EE7a c\xE1c comment thu\u1ED9c b\xE0i vi\u1EBFt\r\n      const postVotes = await VoteEntity.findAll({\r\n        where: {\r\n          [Op.or]: [\r\n            { targetId: id, targetType: 'question' },\r\n            ...(commentIds.length\r\n              ? [{ targetType: 'comment', targetId: { [Op.in]: commentIds } }]\r\n              : []),\r\n          ],\r\n        },\r\n      });\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        data: postVotes.map((v: any) => ({\r\n          userId: v.userId,\r\n          targetId: v.targetId,\r\n          targetType: v.targetType,\r\n          value: v.value,\r\n        })),\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i l\u1EA5y d\u1EEF li\u1EC7u vote',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'POST') {\r\n    try {\r\n      const { targetType, targetId, value } = req.body ?? {};\r\n\r\n      // Danh t\xEDnh ng\u01B0\u1EDDi vote l\u1EA5y t\u1EEB JWT, kh\xF4ng tin v\xE0o body\r\n      const auth = await requireAuth(req);\r\n      if (!auth) {\r\n        res.status(401).json({ success: false, message: 'Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 vote' });\r\n        return;\r\n      }\r\n      const userId = auth.userId;\r\n\r\n      if (!['question', 'comment'].includes(targetType)) {\r\n        res.status(400).json({ success: false, message: 'targetType ph\u1EA3i l\xE0 question ho\u1EB7c comment' });\r\n        return;\r\n      }\r\n\r\n      const parsedValue = parseInt(value, 10);\r\n      if (parsedValue !== 1 && parsedValue !== -1) {\r\n        res.status(400).json({ success: false, message: 'value ph\u1EA3i l\xE0 1 ho\u1EB7c -1' });\r\n        return;\r\n      }\r\n\r\n      const voteTargetId = targetId || id;\r\n      const voteValue = parsedValue;\r\n\r\n      let targetInstance: any = null;\r\n      if (targetType === 'question') {\r\n        targetInstance = await QuestionEntity.findByPk(voteTargetId);\r\n      } else {\r\n        targetInstance = await CommentEntity.findByPk(voteTargetId);\r\n      }\r\n\r\n      if (!targetInstance) {\r\n        res.status(404).json({ success: false, message: '\u0110\u1ED1i t\u01B0\u1EE3ng \u0111\u01B0\u1EE3c vote kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n        return;\r\n      }\r\n\r\n      const author = await UserEntity.findByPk(targetInstance.authorId);\r\n\r\n      const existingVote = await VoteEntity.findOne({\r\n        where: { userId, targetId: voteTargetId, targetType }\r\n      });\r\n\r\n      if (!existingVote) {\r\n        // Vote m\u1EDBi\r\n        await VoteEntity.create({\r\n          id: `${Date.now()}_${userId}`,\r\n          userId,\r\n          targetId: voteTargetId,\r\n          targetType,\r\n          value: voteValue\r\n        });\r\n        await targetInstance.increment('votes', { by: voteValue });\r\n        await addReputation(author, userId, voteValue * 10);\r\n      } else if (existingVote.value === voteValue) {\r\n        // Vote l\u1EA1i c\xF9ng chi\u1EC1u \u2192 h\u1EE7y vote\r\n        await existingVote.destroy();\r\n        await targetInstance.increment('votes', { by: -voteValue });\r\n        await addReputation(author, userId, -voteValue * 10);\r\n      } else {\r\n        // \u0110\u1ED5i chi\u1EC1u vote\r\n        existingVote.value = voteValue;\r\n        await existingVote.save();\r\n        const diff = voteValue * 2;\r\n        await targetInstance.increment('votes', { by: diff });\r\n        await addReputation(author, userId, diff * 10);\r\n      }\r\n\r\n      await targetInstance.reload();\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        message: 'C\u1EADp nh\u1EADt vote th\xE0nh c\xF4ng',\r\n        data: { votes: targetInstance.votes }\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({ success: false, message: 'L\u1ED7i x\u1EED l\xFD vote', error: String(error) });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "auth/register", "id": "auth/register", "file": "auth/register.ts", "absPath": "/auth/register", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { AuthError, register } from '@/server/services/authService';\r\nimport { validateRegisterInput } from '@/utils/validation';\r\nimport type { UserRole } from '@/server/models/User';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method !== 'POST') {\r\n    res.status(405).json({ success: false, message: 'Method not allowed' });\r\n    return;\r\n  }\r\n\r\n  try {\r\n    const { name, email, password, role, department, studentId } = req.body ?? {};\r\n\r\n    // Validate input\r\n    const validation = validateRegisterInput({ name, email, password, role });\r\n    if (!validation.isValid) {\r\n      res.status(400).json({ success: false, message: 'Validation failed', errors: validation.errors });\r\n      return;\r\n    }\r\n\r\n    const result = await register({\r\n      name: name.trim(),\r\n      email: email.toLowerCase().trim(),\r\n      password,\r\n      role: (role as UserRole) || 'sinhvien',\r\n      department,\r\n      studentId: studentId || '',\r\n    });\r\n    res.status(201).json({ success: true, data: result });\r\n  } catch (error: unknown) {\r\n    const message = error instanceof Error ? error.message : '\u0110\u0103ng k\xFD th\u1EA5t b\u1EA1i';\r\n    const statusCode = error instanceof AuthError ? error.status : 400;\r\n    res.status(statusCode).json({ success: false, message });\r\n  }\r\n}\r\n" }, { "path": "leaderboard", "id": "leaderboard", "file": "leaderboard.ts", "absPath": "/leaderboard", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { initDatabase } from '@/server/db';\r\nimport { UserEntity } from '@/server/models/entities';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      const users = await UserEntity.findAll({\r\n        attributes: { exclude: ['password'] },\r\n        where: { status: 'active' },\r\n        order: [['reputation', 'DESC']],\r\n        limit: 50\r\n      });\r\n\r\n      const formatted = users.map((u: any) => {\r\n        const data = u.toJSON();\r\n        return {\r\n          ...data,\r\n          dept: u.department || '',\r\n          joined: u.joinDate ? u.joinDate.substring(0, 4) : ''\r\n        };\r\n      });\r\n\r\n      res.status(200).json({ success: true, data: { list: formatted } });\r\n    } catch (error) {\r\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y b\u1EA3ng x\u1EBFp h\u1EA1ng', error: String(error) });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "posts", "id": "posts/index", "file": "posts/index.ts", "absPath": "/posts", "__content": "import { initDatabase } from '@/server/db';\r\nimport { requireAuth } from '@/server/middlewares/auth';\r\nimport {\r\n  QuestionEntity,\r\n  TagEntity,\r\n  UserEntity,\r\n} from '@/server/models/entities';\r\nimport type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { Op } from 'sequelize';\r\nimport { validateCreatePostInput } from '@/utils/validation';\r\n\r\nexport function formatTime(date: Date) {\r\n  const seconds = Math.floor(\r\n    (new Date().getTime() - new Date(date).getTime()) / 1000,\r\n  );\r\n  if (seconds < 0) return 'V\u1EEBa xong';\r\n  if (seconds < 60) return 'V\u1EEBa xong';\r\n  const minutes = Math.floor(seconds / 60);\r\n  if (minutes < 60) return `${minutes} ph\xFAt tr\u01B0\u1EDBc`;\r\n  const hours = Math.floor(minutes / 60);\r\n  if (hours < 24) return `${hours} gi\u1EDD tr\u01B0\u1EDBc`;\r\n  const days = Math.floor(hours / 24);\r\n  if (days < 30) return `${days} ng\xE0y tr\u01B0\u1EDBc`;\r\n  return new Date(date).toLocaleDateString('vi-VN');\r\n}\r\n\r\nexport function formatQuestion(q: any) {\r\n  return {\r\n    id: q.id,\r\n    title: q.title,\r\n    excerpt: q.excerpt,\r\n    content: q.content,\r\n    author: q.author ? q.author.name : 'Unknown',\r\n    authorId: q.authorId,\r\n    authorRole: q.author ? q.author.role : 'sinhvien',\r\n    authorRep: q.author ? q.author.reputation : 0,\r\n    tags: q.questionTags ? q.questionTags.map((t: any) => t.name) : [],\r\n    votes: q.votes,\r\n    comments: q.commentsCount,\r\n    views: q.views,\r\n    timestamp: formatTime(q.createdAt),\r\n    subject: q.subject,\r\n    isSolved: q.isSolved,\r\n    status: q.status,\r\n    createdAt: q.createdAt,\r\n  };\r\n}\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  if (req.method === 'GET') {\r\n    try {\r\n      // L\u01B0u \xFD: umi apiRoute KH\xD4NG t\u1EF1 URL-decode query param\r\n      // (vd nh\u1EADn \"Web%20Development\" thay v\xEC \"Web Development\")\r\n      const dec = (v: unknown) =>\r\n        typeof v === 'string' ? decodeURIComponent(v.replace(/\\+/g, ' ')) : '';\r\n\r\n      const { sort, authorId, page, limit, unanswered, solved } = req.query ?? {};\r\n      const tag = dec(req.query?.tag);\r\n      const q = dec(req.query?.q);\r\n      const subject = dec(req.query?.subject);\r\n      const dept = dec(req.query?.dept);\r\n\r\n      // Pagination\r\n      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);\r\n      const pageSize = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));\r\n      const offset = (pageNum - 1) * pageSize;\r\n\r\n      const whereClause: any = { status: { [Op.ne]: 'hidden' } };\r\n\r\n      if (authorId) {\r\n        whereClause.authorId = authorId;\r\n      }\r\n\r\n      // L\u1ECDc b\xE0i ch\u01B0a \u0111\u01B0\u1EE3c gi\u1EA3i quy\u1EBFt (filter \u1EDF DB \u0111\u1EC3 ph\xE2n trang \u0111\xFAng)\r\n      if (unanswered === '1' || unanswered === 'true') {\r\n        whereClause.isSolved = false;\r\n      }\r\n\r\n      // L\u1ECDc b\xE0i \u0111\xE3 gi\u1EA3i quy\u1EBFt\r\n      if (solved === '1' || solved === 'true') {\r\n        whereClause.isSolved = true;\r\n      }\r\n\r\n      // L\u1ECDc theo m\xF4n h\u1ECDc\r\n      if (subject.trim()) {\r\n        whereClause.subject = subject.trim();\r\n      }\r\n\r\n      if (q.trim()) {\r\n        const keyword = `%${q.trim()}%`;\r\n        whereClause[Op.or] = [\r\n          { title: { [Op.like]: keyword } },\r\n          { content: { [Op.like]: keyword } },\r\n        ];\r\n      }\r\n\r\n      let orderClause: any = [['createdAt', 'DESC']];\r\n      if (sort === 'votes') {\r\n        orderClause = [['votes', 'DESC']];\r\n      } else if (sort === 'views') {\r\n        orderClause = [['views', 'DESC']];\r\n      }\r\n\r\n      const tagInclude: any = {\r\n        model: TagEntity,\r\n        as: 'questionTags',\r\n        through: { attributes: [] },\r\n      };\r\n\r\n      if (tag.trim()) {\r\n        tagInclude.where = { name: tag.trim() };\r\n      }\r\n\r\n      const authorInclude: any = {\r\n        model: UserEntity,\r\n        as: 'author',\r\n        attributes: ['name', 'role', 'reputation'],\r\n      };\r\n\r\n      // L\u1ECDc theo chuy\xEAn ng\xE0nh (khoa) c\u1EE7a t\xE1c gi\u1EA3\r\n      if (dept.trim()) {\r\n        authorInclude.where = { department: { [Op.like]: `%${dept.trim()}%` } };\r\n        authorInclude.required = true;\r\n      }\r\n\r\n      const { count, rows } = await QuestionEntity.findAndCountAll({\r\n        where: whereClause,\r\n        include: [authorInclude, tagInclude],\r\n        order: orderClause,\r\n        limit: pageSize,\r\n        offset,\r\n        distinct: true,\r\n      });\r\n\r\n      const list = rows.map(formatQuestion);\r\n      const total = count;\r\n      const totalPages = Math.ceil(total / pageSize);\r\n\r\n      res.status(200).json({\r\n        success: true,\r\n        data: {\r\n          list,\r\n          pagination: {\r\n            page: pageNum,\r\n            limit: pageSize,\r\n            total,\r\n            totalPages,\r\n          },\r\n        },\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i l\u1EA5y danh s\xE1ch b\xE0i vi\u1EBFt',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'POST') {\r\n    try {\r\n      const { title, content, subject, tags } = req.body ?? {};\r\n\r\n      // Validate input\r\n      const validation = validateCreatePostInput({ title, content, tags });\r\n      if (!validation.isValid) {\r\n        res.status(400).json({\r\n          success: false,\r\n          message: 'Validation failed',\r\n          errors: validation.errors,\r\n        });\r\n        return;\r\n      }\r\n\r\n      // Danh t\xEDnh ng\u01B0\u1EDDi \u0111\u0103ng l\u1EA5y t\u1EEB JWT, kh\xF4ng tin v\xE0o body\r\n      const auth = await requireAuth(req);\r\n      if (!auth) {\r\n        res.status(401).json({\r\n          success: false,\r\n          message: 'Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 \u0111\u0103ng b\xE0i',\r\n        });\r\n        return;\r\n      }\r\n      const authorId = auth.userId;\r\n\r\n      const user = await UserEntity.findByPk(authorId);\r\n      if (!user) {\r\n        res.status(404).json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n        return;\r\n      }\r\n\r\n      const excerpt = content.substring(0, 180) + (content.length > 180 ? '...' : '');\r\n\r\n      const newQuestion = await QuestionEntity.create({\r\n        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,\r\n        title: title.trim(),\r\n        excerpt,\r\n        content,\r\n        authorId,\r\n        votes: 0,\r\n        commentsCount: 0,\r\n        views: 0,\r\n        subject,\r\n        isSolved: false,\r\n        status: 'active',\r\n        createdAt: new Date(),\r\n      });\r\n\r\n      if (Array.isArray(tags) && tags.length > 0) {\r\n        const tagsInDb = await TagEntity.findAll({ where: { name: tags } });\r\n        await (newQuestion as any).setQuestionTags(tagsInDb);\r\n\r\n        // T\u0103ng count atomic, tr\xE1nh lost update\r\n        await Promise.all(tagsInDb.map((t) => t.increment('count')));\r\n      }\r\n\r\n      await user.increment('posts');\r\n\r\n      try {\r\n        const { notifyNewPost } = await import('@/server/utils/email');\r\n        await notifyNewPost(newQuestion.id, user.email);\r\n      } catch (err) {\r\n        console.error('[Email] L\u1ED7i g\u1EEDi email th\xF4ng b\xE1o b\xE0i vi\u1EBFt m\u1EDBi:', err);\r\n      }\r\n\r\n      res.status(201).json({\r\n        success: true,\r\n        message: '\u0110\u0103ng b\xE0i vi\u1EBFt th\xE0nh c\xF4ng!',\r\n        data: { id: newQuestion.id },\r\n      });\r\n    } catch (error) {\r\n      res.status(500).json({\r\n        success: false,\r\n        message: 'L\u1ED7i t\u1EA1o b\xE0i vi\u1EBFt',\r\n        error: String(error),\r\n      });\r\n    }\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n" }, { "path": "auth/login", "id": "auth/login", "file": "auth/login.ts", "absPath": "/auth/login", "__content": "import { AuthError, login } from '@/server/services/authService';\r\nimport { validateLoginInput } from '@/utils/validation';\r\nimport type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\n\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method !== 'POST') {\r\n    res.status(405).json({ success: false, message: 'Method not allowed' });\r\n    return;\r\n  }\r\n\r\n  try {\r\n    const { email, password } = req.body ?? {};\r\n\r\n    // Validate input\r\n    const validation = validateLoginInput({ email, password });\r\n    if (!validation.isValid) {\r\n      res\r\n        .status(400)\r\n        .json({\r\n          success: false,\r\n          message: 'Validation failed',\r\n          errors: validation.errors,\r\n        });\r\n      return;\r\n    }\r\n\r\n    const result = await login({ email: email.toLowerCase().trim(), password });\r\n    res.status(200).json({ success: true, data: result });\r\n  } catch (error: unknown) {\r\n    const message =\r\n      error instanceof Error ? error.message : '\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i';\r\n\r\n    // Status code l\u1EA5y t\u1EEB AuthError, kh\xF4ng ph\u1EE5 thu\u1ED9c n\u1ED9i dung message\r\n    const statusCode = error instanceof AuthError ? error.status : 401;\r\n\r\n    res.status(statusCode).json({ success: false, message });\r\n  }\r\n}\r\n" }, { "path": "users/[id]", "id": "users/[id]", "file": "users/[id].ts", "absPath": "/users/[id]", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { initDatabase } from '@/server/db';\r\nimport { UserEntity } from '@/server/models/entities';\r\n\r\n/**\r\n * GET /api/users/:id \u2014 th\xF4ng tin h\u1ED3 s\u01A1 c\xF4ng khai c\u1EE7a m\u1ED9t user.\r\n * Ch\u1EC9 tr\u1EA3 v\u1EC1 c\xE1c field an to\xE0n (kh\xF4ng password, kh\xF4ng email qu\u1EA3n tr\u1ECB n\u1ED9i b\u1ED9).\r\n */\r\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  await initDatabase();\r\n\r\n  if (req.method !== 'GET') {\r\n    res.status(405).json({ success: false, message: 'Method not allowed' });\r\n    return;\r\n  }\r\n\r\n  let id = req.query?.id as string;\r\n  if (!id && req.url) {\r\n    const match = req.url.match(/\\/api\\/users\\/([^/?]+)/);\r\n    id = match ? match[1] : '';\r\n  }\r\n\r\n  if (!id) {\r\n    res.status(400).json({ success: false, message: 'Thi\u1EBFu ID ng\u01B0\u1EDDi d\xF9ng' });\r\n    return;\r\n  }\r\n\r\n  try {\r\n    const user = await UserEntity.findByPk(id, {\r\n      attributes: [\r\n        'id',\r\n        'name',\r\n        'email',\r\n        'role',\r\n        'department',\r\n        'major',\r\n        'studentId',\r\n        'avatar',\r\n        'bio',\r\n        'reputation',\r\n        'posts',\r\n        'answers',\r\n        'votes',\r\n        'followers',\r\n        'following',\r\n        'joinDate',\r\n        'badges',\r\n        'status',\r\n      ],\r\n    });\r\n\r\n    if (!user) {\r\n      res\r\n        .status(404)\r\n        .json({ success: false, message: 'Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i' });\r\n      return;\r\n    }\r\n\r\n    res.status(200).json({ success: true, data: user });\r\n  } catch (error) {\r\n    res.status(500).json({\r\n      success: false,\r\n      message: 'L\u1ED7i l\u1EA5y th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng',\r\n      error: String(error),\r\n    });\r\n  }\r\n}\r\n" }, { "path": "tags", "id": "tags", "file": "tags.ts", "absPath": "/tags", "__content": "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\nimport { Op, QueryTypes, col, fn } from 'sequelize';\nimport { initDatabase, sequelize } from '@/server/db';\nimport { QuestionEntity, TagEntity } from '@/server/models/entities';\n\n/**\n * GET /api/tags \u2014 danh s\xE1ch th\u1EBB (count b\xE0i vi\u1EBFt TH\u1EACT) + danh s\xE1ch m\xF4n h\u1ECDc\n * (g\u1ED9p chung 1 endpoint v\xEC Vercel Hobby gi\u1EDBi h\u1EA1n 12 serverless functions).\n */\nexport default async function handler(req: UmiApiRequest, res: UmiApiResponse) {\n  await initDatabase();\n\n  if (req.method === 'GET') {\n    try {\n      const tags = await TagEntity.findAll({ raw: true });\n\n      // \u0110\u1EBFm s\u1ED1 b\xE0i vi\u1EBFt TH\u1EACT theo t\u1EEBng tag t\u1EEB b\u1EA3ng n\u1ED1i (kh\xF4ng d\xF9ng c\u1ED9t count seed s\u1EB5n)\n      const rows = (await sequelize.query(\n        'SELECT tagName, COUNT(*) AS cnt FROM QuestionTags GROUP BY tagName',\n        { type: QueryTypes.SELECT },\n      )) as { tagName: string; cnt: number }[];\n\n      const countMap: Record<string, number> = {};\n      for (const r of rows) {\n        countMap[r.tagName] = Number(r.cnt);\n      }\n\n      const list = (tags as any[])\n        .map((t) => ({ ...t, count: countMap[t.name] || 0 }))\n        .sort((a, b) => b.count - a.count);\n\n      // M\xF4n h\u1ECDc k\xE8m s\u1ED1 b\xE0i th\u1EADt (GROUP BY t\u1EEB b\u1EA3ng Questions)\n      const subjectRows = await QuestionEntity.findAll({\n        attributes: ['subject', [fn('COUNT', col('id')), 'count']],\n        where: {\n          status: { [Op.ne]: 'hidden' },\n          subject: { [Op.ne]: null },\n        },\n        group: ['subject'],\n        order: [[fn('COUNT', col('id')), 'DESC']],\n        raw: true,\n      });\n\n      const subjects = (subjectRows as any[]).map((r) => ({\n        name: r.subject,\n        count: Number(r.count),\n      }));\n\n      res.status(200).json({ success: true, data: { list, subjects } });\n    } catch (error) {\n      res.status(500).json({ success: false, message: 'L\u1ED7i l\u1EA5y danh s\xE1ch th\u1EBB', error: String(error) });\n    }\n    return;\n  }\n\n  res.status(405).json({ success: false, message: 'Method not allowed' });\n}\n" }];
var login_default = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await handler(umiReq, umiRes);
};
