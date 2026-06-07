-- MySQL Initialization Script for edu_forum
-- Created based on project models and seed data
-- This script will DROP existing tables and recreate them

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create Database
CREATE DATABASE IF NOT EXISTS `edu_forum` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `edu_forum`;

-- ----------------------------
-- Drop existing tables
-- ----------------------------
DROP TABLE IF EXISTS `QuestionTags`;
DROP TABLE IF EXISTS `Votes`;
DROP TABLE IF EXISTS `Comments`;
DROP TABLE IF EXISTS `Questions`;
DROP TABLE IF EXISTS `Tags`;
DROP TABLE IF EXISTS `Users`;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
CREATE TABLE `Users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('sinhvien','giangvien','admin') DEFAULT 'sinhvien',
  `department` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `studentId` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text,
  `reputation` int(11) DEFAULT '10',
  `posts` int(11) DEFAULT '0',
  `answers` int(11) DEFAULT '0',
  `votes` int(11) DEFAULT '0',
  `followers` int(11) DEFAULT '0',
  `following` int(11) DEFAULT '0',
  `joinDate` varchar(255) NOT NULL,
  `badges` text,
  `status` enum('active','banned') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Tags
-- ----------------------------
CREATE TABLE `Tags` (
  `name` varchar(255) NOT NULL,
  `count` int(11) DEFAULT '0',
  `color` varchar(255) NOT NULL DEFAULT '#3b82f6',
  `category` varchar(255) NOT NULL,
  `desc` text,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Questions
-- ----------------------------
CREATE TABLE `Questions` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `authorId` varchar(255) NOT NULL,
  `votes` int(11) DEFAULT '0',
  `commentsCount` int(11) DEFAULT '0',
  `views` int(11) DEFAULT '0',
  `subject` varchar(255) DEFAULT NULL,
  `isSolved` tinyint(1) DEFAULT '0',
  `status` enum('active','reported','hidden') DEFAULT 'active',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Comments
-- ----------------------------
CREATE TABLE `Comments` (
  `id` varchar(255) NOT NULL,
  `questionId` varchar(255) NOT NULL,
  `parentId` varchar(255) DEFAULT NULL,
  `authorId` varchar(255) NOT NULL,
  `votes` int(11) DEFAULT '0',
  `isBest` tinyint(1) DEFAULT '0',
  `content` text NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `questionId` (`questionId`),
  KEY `parentId` (`parentId`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `Questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`parentId`) REFERENCES `Comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Votes
-- ----------------------------
CREATE TABLE `Votes` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `targetId` varchar(255) NOT NULL,
  `targetType` enum('question','comment') NOT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `votes_user_target_unique` (`userId`,`targetId`,`targetType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for QuestionTags
-- ----------------------------
CREATE TABLE `QuestionTags` (
  `questionId` varchar(255) NOT NULL,
  `tagName` varchar(255) NOT NULL,
  PRIMARY KEY (`questionId`,`tagName`),
  KEY `tagName` (`tagName`),
  CONSTRAINT `questiontags_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `Questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `questiontags_ibfk_2` FOREIGN KEY (`tagName`) REFERENCES `Tags` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Seed Data for Users
-- Password for all seed users: 12345678 (hashed with bcrypt)
-- ----------------------------
INSERT INTO `Users` (`id`, `name`, `email`, `password`, `role`, `department`, `reputation`, `posts`, `answers`, `votes`, `followers`, `following`, `joinDate`, `badges`, `status`) VALUES
('1', 'Nguyễn Văn Admin', 'admin@ptit.edu.vn', '$2a$10$7ZZf.XdbKv6etEETPUq6fOSNciwnWV1aDm4LPt4S2RPC9NPKeZYsC', 'admin', 'Ban Quản Trị', 9999, 150, 320, 1250, 500, 50, '2023-01-01', '[\"admin\", \"top-contributor\", \"helpful\"]', 'active'),
('2', 'Trần Thị Hương', 'huong@student.ptit.edu.vn', '$2a$10$7ZZf.XdbKv6etEETPUq6fOSNciwnWV1aDm4LPt4S2RPC9NPKeZYsC', 'sinhvien', 'Công Nghệ Thông Tin', 1250, 28, 45, 320, 89, 34, '2024-09-01', '[\"first-question\", \"helpful\", \"100-votes\"]', 'active'),
('3', 'PGS.TS Lê Minh Đức', 'duc.lm@ptit.edu.vn', '$2a$10$7ZZf.XdbKv6etEETPUq6fOSNciwnWV1aDm4LPt4S2RPC9NPKeZYsC', 'giangvien', 'Khoa CNTT', 5430, 85, 210, 870, 342, 15, '2023-06-15', '[\"teacher\", \"expert\", \"top-contributor\", \"advisor\"]', 'active');

-- ----------------------------
-- Seed Data for Tags
-- ----------------------------
INSERT INTO `Tags` (`name`, `count`, `color`, `category`, `desc`) VALUES
('Java', 245, '#f97316', 'language', 'Ngôn ngữ lập trình hướng đối tượng phổ biến'),
('JavaScript', 198, '#eab308', 'language', 'Ngôn ngữ scripting cho web development'),
('Python', 176, '#3b82f6', 'language', 'Ngôn ngữ đa năng dùng trong AI/ML, web, data'),
('React', 165, '#06b6d4', 'framework', 'Thư viện JavaScript để xây dựng UI'),
('TypeScript', 142, '#2563eb', 'language', 'JavaScript với static typing'),
('Node.js', 128, '#10b981', 'framework', 'Runtime JavaScript phía server'),
('SQL', 112, '#8b5cf6', 'database', 'Ngôn ngữ truy vấn cơ sở dữ liệu quan hệ'),
('OOP', 98, '#f97316', 'concept', 'Mô hình lập trình hướng đối tượng'),
('AI/ML', 87, '#ec4899', 'field', 'Trí tuệ nhân tạo và Machine Learning'),
('Git', 85, '#6b7280', 'tool', 'Hệ thống quản lý phiên bản phân tán'),
('Cấu Trúc Dữ Liệu', 76, '#14b8a6', 'subject', 'Môn học về tổ chức và quản lý dữ liệu'),
('Thuật Toán', 72, '#14b8a6', 'subject', 'Các phương pháp giải quyết bài toán'),
('Database', 65, '#8b5cf6', 'database', 'Thiết kế và quản trị cơ sở dữ liệu'),
('Web Development', 63, '#0ea5e9', 'field', 'Phát triển ứng dụng web'),
('Lập Trình', 0, '#10b981', 'concept', 'Các khái niệm lập trình cơ bản'),
('Optimization', 0, '#f59e0b', 'concept', 'Tối ưu hóa mã nguồn và hiệu năng'),
('GitHub', 0, '#1f2937', 'tool', 'Nền tảng lưu trữ mã nguồn'),
('DevOps', 0, '#6366f1', 'field', 'Văn hóa và công cụ triển khai phần mềm'),
('Functional', 0, '#ec4899', 'concept', 'Lập trình hàm');

-- ----------------------------
-- Seed Data for Questions
-- ----------------------------
INSERT INTO `Questions` (`id`, `title`, `excerpt`, `content`, `authorId`, `votes`, `commentsCount`, `views`, `subject`, `isSolved`, `status`, `createdAt`) VALUES
('1', 'Giải thích OOP trong Java: Class, Object, Inheritance và Polymorphism', 'OOP là nền tảng của Java...', 'OOP là nền tảng của Java...', '2', 45, 12, 523, 'Lập Trình Cơ Bản', 1, 'active', '2026-05-09'),
('2', 'React Hooks: useState, useEffect, useContext - Hướng dẫn toàn diện', 'React Hooks là một cách mới...', 'React Hooks là một cách mới...', '2', 67, 23, 892, 'Web Development', 0, 'active', '2026-05-08'),
('3', 'Cấu trúc dữ liệu: Stack và Queue - Cài đặt và ứng dụng thực tế', 'Stack và Queue là hai cấu trúc...', 'Stack và Queue là hai cấu trúc...', '2', 34, 8, 421, 'Cấu Trúc Dữ Liệu', 1, 'active', '2026-05-06'),
('4', 'SQL: JOIN, Subquery, và Optimization - Tối ưu truy vấn database', 'JOIN là một trong những khái niệm...', 'JOIN là một trong những khái niệm...', '2', 56, 15, 734, 'Cơ Sở Dữ Liệu', 0, 'active', '2026-05-07'),
('5', 'Git & GitHub: Quản lý phiên bản hiệu quả cho team lớn', 'Git là công cụ không thể thiếu...', 'Git là công cụ không thể thiếu...', '2', 78, 31, 1023, 'Công Cụ Phát Triển', 1, 'active', '2026-05-05'),
('6', 'Python: List Comprehension, Lambda và Functional Programming', 'Python có những tính năng...', 'Python có những tính năng...', '2', 42, 11, 356, 'Ngôn Ngữ Lập Trình', 0, 'active', '2026-05-04');

-- ----------------------------
-- Seed Data for QuestionTags
-- ----------------------------
INSERT INTO `QuestionTags` (`questionId`, `tagName`) VALUES
('1', 'Java'), ('1', 'OOP'), ('1', 'Lập Trình'),
('2', 'React'), ('2', 'JavaScript'), ('2', 'Web Development'),
('3', 'Cấu Trúc Dữ Liệu'), ('3', 'Thuật Toán'), ('3', 'Java'),
('4', 'SQL'), ('4', 'Database'), ('4', 'Optimization'),
('5', 'Git'), ('5', 'GitHub'), ('5', 'DevOps'),
('6', 'Python'), ('6', 'Lập Trình'), ('6', 'Functional');

-- ----------------------------
-- Seed Data for Comments
-- ----------------------------
INSERT INTO `Comments` (`id`, `questionId`, `parentId`, `authorId`, `votes`, `isBest`, `content`) VALUES
('1', '1', NULL, '3', 28, 1, 'Đây là một câu hỏi rất hay về OOP!'),
('2', '1', NULL, '2', 12, 0, 'Bổ sung thêm về Encapsulation...'),
('r1', '1', '1', '1', 3, 0, 'Cảm ơn thầy!');

SET FOREIGN_KEY_CHECKS = 1;
