-- =============================================================================
-- KHỞI TẠO DATABASE CHUẨN UTF8MB4 (HỖ TRỢ TIẾNG VIỆT + EMOJI)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS `forum_ptit_enterprise_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `forum_ptit_enterprise_db`;

-- Xóa bảng cũ nếu tồn tại để làm sạch môi trường chạy
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `attachments`, `reports`, `user_activities`, `notification_recipients`, 
                     `notifications`, `bookmarks`, `answer_votes`, `question_votes`, 
                     `answer_comments`, `question_comments`, `answers`, `question_tags`, 
                     `questions`, `tags`, `user_follows`, `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- PHẦN I: ĐỊNH NGHĨA CẤU TRÚC BẢNG (SCHEMA V3.1)
-- =============================================================================

-- 1. Bảng Users (Đầy đủ các trường counter cache + badges JSON)
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  `department` VARCHAR(255) NULL,
  `major` VARCHAR(255) NULL,
  `student_id` VARCHAR(100) NULL,
  `avatar` VARCHAR(255) NULL,
  `bio` TEXT NULL,
  `reputation` INT NOT NULL DEFAULT 0,
  `posts_count` INT NOT NULL DEFAULT 0,
  `answers_count` INT NOT NULL DEFAULT 0,
  `votes_count` INT NOT NULL DEFAULT 0,
  `followers_count` INT NOT NULL DEFAULT 0,
  `following_count` INT NOT NULL DEFAULT 0,
  `badges` JSON NULL, 
  `status` ENUM('active', 'banned') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uidx_users_email` (`email` ASC),
  INDEX `idx_users_role_status` (`role` ASC, `status` ASC)
) ENGINE = InnoDB;

-- 2. Bảng Theo dõi mạng xã hội
CREATE TABLE `user_follows` (
  `follower_id` VARCHAR(36) NOT NULL,
  `following_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  INDEX `idx_following` (`following_id` ASC),
  CONSTRAINT `fk_follows_follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_follows_following` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 3. Bảng Danh mục Tags (Chuẩn hóa ID INT)
CREATE TABLE `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `color` VARCHAR(20) NULL,
  `category` ENUM('language', 'framework', 'subject', 'database', 'field', 'tool', 'concept') NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uidx_tags_name` (`name` ASC),
  UNIQUE INDEX `uidx_tags_slug` (`slug` ASC)
) ENGINE = InnoDB;

-- 4. Bảng Câu hỏi (Hỗ trợ Soft Delete + Fulltext Search)
CREATE TABLE `questions` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(512) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NULL,
  `author_id` VARCHAR(36) NULL,
  `subject` VARCHAR(255) NULL,
  `is_solved` TINYINT(1) NOT NULL DEFAULT 0,
  `accepted_answer_id` VARCHAR(36) NULL, 
  `status` ENUM('active', 'reported', 'hidden') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_questions_feed` (`status` ASC, `deleted_at` ASC, `created_at` DESC), 
  INDEX `idx_questions_author` (`author_id` ASC, `created_at` DESC),
  FULLTEXT INDEX `fidx_questions_search` (`title`, `content`),
  CONSTRAINT `fk_questions_users` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 5. Bảng Trung gian Câu hỏi - Tags
CREATE TABLE `question_tags` (
  `question_id` VARCHAR(36) NOT NULL,
  `tag_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`, `tag_id`),
  INDEX `idx_qt_tag` (`tag_id` ASC),
  CONSTRAINT `fk_qt_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qt_tags` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 6. Bảng Câu trả lời (Tách riêng biệt khỏi comment)
CREATE TABLE `answers` (
  `id` VARCHAR(36) NOT NULL,
  `question_id` VARCHAR(36) NOT NULL,
  `author_id` VARCHAR(36) NULL,
  `content` LONGTEXT NOT NULL,
  `is_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_answers_query` (`question_id` ASC, `deleted_at` ASC, `is_accepted` DESC, `created_at` ASC),
  INDEX `idx_answers_author` (`author_id` ASC),
  FULLTEXT INDEX `fidx_answers_search` (`content`),
  CONSTRAINT `fk_answers_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answers_users` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- Thiết lập Khóa ngoại vòng an toàn cho accepted_answer_id
ALTER TABLE `questions` ADD CONSTRAINT `fk_questions_accepted_answer`
  FOREIGN KEY (`accepted_answer_id`) REFERENCES `answers` (`id`) ON DELETE SET NULL;

-- 7. Bảng Bình luận riêng cho Câu hỏi
CREATE TABLE `question_comments` (
  `id` VARCHAR(36) NOT NULL,
  `question_id` VARCHAR(36) NOT NULL,
  `parent_id` VARCHAR(36) NULL,
  `author_id` VARCHAR(36) NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_q_comments_tree` (`question_id` ASC, `parent_id` ASC, `created_at` ASC),
  CONSTRAINT `fk_qc_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qc_parent` FOREIGN KEY (`parent_id`) REFERENCES `question_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qc_users` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 8. Bảng Bình luận riêng cho Câu trả lời
CREATE TABLE `answer_comments` (
  `id` VARCHAR(36) NOT NULL,
  `answer_id` VARCHAR(36) NOT NULL,
  `parent_id` VARCHAR(36) NULL,
  `author_id` VARCHAR(36) NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_a_comments_tree` (`answer_id` ASC, `parent_id` ASC, `created_at` ASC),
  CONSTRAINT `fk_ac_answers` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ac_parent` FOREIGN KEY (`parent_id`) REFERENCES `answer_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ac_users` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 9. Bảng Vote Câu hỏi
CREATE TABLE `question_votes` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `question_id` VARCHAR(36) NOT NULL,
  `value` TINYINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uidx_q_vote_user` (`user_id`, `question_id`),
  CONSTRAINT `fk_qv_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qv_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 10. Bảng Vote Câu trả lời
CREATE TABLE `answer_votes` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `answer_id` VARCHAR(36) NOT NULL,
  `value` TINYINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uidx_a_vote_user` (`user_id`, `answer_id`),
  CONSTRAINT `fk_av_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_av_answers` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 11. Bảng Lưu bài viết (Bookmarks)
CREATE TABLE `bookmarks` (
  `user_id` VARCHAR(36) NOT NULL,
  `question_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `question_id`),
  CONSTRAINT `fk_bookmarks_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmarks_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 12. Bảng Lõi Thông báo
CREATE TABLE `notifications` (
  `id` VARCHAR(36) NOT NULL,
  `sender_id` VARCHAR(36) NULL,       
  `type` ENUM('upvote_question', 'upvote_answer', 'new_answer', 'new_comment', 'accepted_answer', 'mention') NOT NULL,
  `source_question_id` VARCHAR(36) NULL, 
  `source_answer_id` VARCHAR(36) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_noti_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_noti_question` FOREIGN KEY (`source_question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_noti_answer` FOREIGN KEY (`source_answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 13. Bảng Người nhận thông báo (Hỗ trợ Multi-device Sync)
CREATE TABLE `notification_recipients` (
  `notification_id` VARCHAR(36) NOT NULL,
  `receiver_id` VARCHAR(36) NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `read_at` DATETIME NULL,
  PRIMARY KEY (`notification_id`, `receiver_id`),
  INDEX `idx_recv_unread` (`receiver_id` ASC, `is_read` ASC),
  CONSTRAINT `fk_nr_notification` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nr_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 14. Bảng Nhật ký hoạt động (Audit Log bảo mật hệ thống)
CREATE TABLE `user_activities` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NULL,
  `action` VARCHAR(100) NOT NULL, 
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(512) NULL,
  `meta_data` JSON NULL,          
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_activity_user_time` (`user_id` ASC, `created_at` DESC),
  CONSTRAINT `fk_activities_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 15. Bảng Báo cáo vi phạm (Reports)
CREATE TABLE `reports` (
  `id` VARCHAR(36) NOT NULL,
  `reporter_id` VARCHAR(36) NULL,
  `target_type` ENUM('question', 'answer', 'q_comment', 'a_comment', 'user') NOT NULL,
  `target_id` VARCHAR(36) NOT NULL, 
  `reason` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('pending', 'resolved', 'dismissed') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_reports_status_time` (`status` ASC, `created_at` DESC),
  CONSTRAINT `fk_reports_users` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- 16. Bảng Tệp và Hình ảnh đính kèm
CREATE TABLE `attachments` (
  `id` VARCHAR(36) NOT NULL,
  `target_type` ENUM('question', 'answer') NOT NULL,
  `target_id` VARCHAR(36) NOT NULL,
  `file_url` VARCHAR(512) NOT NULL,
  `file_type` VARCHAR(100) NULL,
  `file_size` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_attachments_lookup` (`target_type` ASC, `target_id` ASC)
) ENGINE = InnoDB;


-- =============================================================================
-- PHẦN II: NẠP DỮ LIỆU MẪU ĐỒNG BỘ 100% (SEED DATA)
-- Mật khẩu đăng nhập mặc định của tất cả User: 123456
-- =============================================================================

-- 1. Thêm Người dùng (Bao gồm tài khoản Trần Thị Hương đồng bộ với Object Mock)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `department`, `major`, `student_id`, `avatar`, `bio`, `reputation`, `posts_count`, `answers_count`, `votes_count`, `followers_count`, `following_count`, `badges`, `status`, `created_at`) 
VALUES 
('11111111-1111-4111-a111-111111111111', 'Trương Quốc Hải', 'haict.admin@forum.edu.vn', '$2b$12$K3.G96uXvXmC.uE080w3G.Z/wG6YhZqSleA1kHl33w1A5v7P.D83a', 'admin', 'Công nghệ thông tin', 'Kỹ thuật phần mềm', 'B22DCCN001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hai', 'Hệ thống Admin Forum sinh viên', 999, 5, 20, 150, 45, 12, '["Admin Cốt Cán"]', 'active', '2025-09-02 08:00:00'),
('22222222-2222-4222-a222-222222222222', 'Thầy Trần Văn Tuấn', 'tuantv@forum.edu.vn', '$2b$12$K3.G96uXvXmC.uE080w3G.Z/wG6YhZqSleA1kHl33w1A5v7P.D83a', 'teacher', 'Công nghệ thông tin', 'Khoa học máy tính', NULL, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan', 'Giảng viên khoa CNTT - Hỗ trợ giải đáp môn học', 550, 0, 115, 680, 210, 5, '["Giảng Viên Ưu Tú"]', 'active', '2026-04-21 09:30:00'),
('99999999-9999-4999-a999-999999999999', 'Trần Thị Hương', 'huong@student.ptit.edu.vn', '$2b$12$K3.G96uXvXmC.uE080w3G.Z/wG6YhZqSleA1kHl33w1A5v7P.D83a', 'student', 'Công Nghệ Thông Tin', 'Lập Trình Web', 'B21DCCN123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong', 'Sinh viên năm 3 ngành CNTT, đam mê Web Development và AI. Yêu thích React, Node.js và Python.', 1250, 28, 45, 320, 89, 34, '["first-question", "helpful", "100-votes"]', 'active', '2024-09-01 00:00:00'),
('33333333-3333-4333-a333-333333333333', 'Nguyễn Minh Anh', 'anhnm.student@forum.edu.vn', '$2b$12$K3.G96uXvXmC.uE080w3G.Z/wG6YhZqSleA1kHl33w1A5v7P.D83a', 'student', 'An toàn thông tin', 'An toàn thông tin', 'B22DCAT052', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anh', 'Sinh viên năm 3 đam mê lập trình Web & Security', 120, 12, 15, 95, 23, 40, '[]', 'active', '2025-10-23 14:22:11'),
('44444444-4444-4444-a444-444444444444', 'Lê Hoàng Nam', 'namlh.student@forum.edu.vn', '$2b$12$K3.G96uXvXmC.uE080w3G.Z/wG6YhZqSleA1kHl33w1A5v7P.D83a', 'student', 'Multimedia', 'Thiết kế đồ họa', 'B23DCMD102', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nam', 'Designer tập sự, thích UI/UX và Frontend', 45, 2, 8, 30, 14, 18, '[]', 'active', '2026-03-01 11:05:00');

-- 2. Thêm Dữ liệu Mạng xã hội (Follows)
INSERT INTO `user_follows` (`follower_id`, `following_id`,`created_at`) VALUES
('99999999-9999-4999-a999-999999999999', '22222222-2222-4222-a222-222222222222', '2026-05-01 12:00:00'), -- Hương follow Thầy Tuấn
('33333333-3333-4333-a333-333333333333', '99999999-9999-4999-a999-999999999999', '2026-05-15 18:20:00'), -- Minh Anh follow Hương
('99999999-9999-4999-a999-999999999999', '11111111-1111-4111-a111-111111111111', '2026-06-01 07:10:00'); -- Hương follow Admin Hải

-- 3. Thêm Danh sách Tags (Khớp hoàn toàn giao diện trực quan của bạn)
INSERT INTO `tags` (`id`, `name`, `slug`, `color`, `category`, `description`) 
VALUES 
(1, 'Java', 'java', '#FF9900', 'language', 'Ngôn ngữ lập trình hướng đối tượng phổ biến'),
(2, 'JavaScript', 'javascript', '#F7DF1E', 'language', 'Ngôn ngữ scripting cho web development'),
(3, 'Python', 'python', '#3776AB', 'language', 'Ngôn ngữ đa năng dùng trong AI/ML, web, data'),
(4, 'React', 'react', '#61DAFB', 'framework', 'Thư viện JavaScript để xây dựng UI'),
(5, 'TypeScript', 'typescript', '#3178C6', 'language', 'JavaScript với static typing'),
(6, 'Node.js', 'node-js', '#339933', 'framework', 'Runtime JavaScript phía server'),
(7, 'SQL', 'sql', '#CC2927', 'database', 'Ngôn ngữ truy vấn cơ sở dữ liệu quan hệ'),
(8, 'OOP', 'oop', '#9B51E0', 'concept', 'Mô hình lập trình hướng đối tượng'),
(9, 'AI/ML', 'ai-ml', '#E2574C', 'field', 'Trí tuệ nhân tạo và Machine Learning'),
(10, 'Git', 'git', '#F05032', 'tool', 'Hệ thống quản lý phiên bản phân tán'),
(11, 'Cấu Trúc Dữ Liệu', 'cau-truc-du-lieu', '#2D9CDB', 'subject', 'Môn học về tổ chức và quản lý dữ liệu'),
(12, 'Thuật Toán', 'thuat-toan', '#27AE60', 'subject', 'Các phương pháp giải quyết bài toán'),
(13, 'Database', 'database', '#828282', 'database', 'Thiết kế và quản trị cơ sở dữ liệu'),
(14, 'Web Development', 'web-development', '#56CCF2', 'field', 'Phát triển ứng dụng web'),
(15, 'Docker', 'docker', '#2496ED', 'tool', 'Nền tảng containerization'),
(16, 'C++', 'c-plus-plus', '#00599C', 'language', 'Ngôn ngữ lập trình hệ thống'),
(17, 'Mạng Máy Tính', 'mang-may-tinh', '#109CF1', 'subject', 'Môn học về mạng và giao thức'),
(18, 'Linux', 'linux', '#FCC624', 'tool', 'Hệ điều hành mã nguồn mở'),
(19, 'Spring Boot', 'spring-boot', '#6DB33F', 'framework', 'Framework Java cho backend'),
(20, 'MongoDB', 'mongodb', '#47A248', 'database', 'Cơ sở dữ liệu NoSQL');

-- 4. Thêm Câu hỏi (Hương đóng vai trò là tác giả chính của các bài đăng Web)
INSERT INTO `questions` (`id`, `title`, `excerpt`, `content`, `author_id`, `subject`, `is_solved`, `accepted_answer_id`, `status`, `created_at`) 
VALUES 
('a6b12c84-9669-4a0b-9dfd-519213567801', 'Làm sao để giải quyết Re-render thừa thãi trong React Component?', 'Lỗi tối ưu hiệu năng Component Tree khi state của cha thay đổi liên tục.', 'Mọi người cho mình hỏi, mình đang xây dựng form tìm kiếm thời gian thực bằng React. Mỗi lần user gõ phím thì toàn bộ danh sách con đều bị re-render lại dù props không đổi. Có cách nào dùng useMemo hay memo chuẩn chỉ không?', '99999999-9999-4999-a999-999999999999', 'Lập trình Frontend nâng cao', 1, NULL, 'active', '2026-06-05 10:00:00'),
('b6b12c84-9669-4a0b-9dfd-519213567802', 'Tại sao không nên SELECT * trong câu lệnh MySQL khi làm Production?', 'Phân tích hiệu năng ổ đĩa mạng và CPU khi truy vấn dữ liệu thừa.', 'Em thấy thầy cô hay dạy viết lệnh SELECT * cho nhanh, nhưng đi thực tập công ty lại bắt liệt kê rõ từng cột cần lấy. Ai giải thích cặn kẽ giúp em bản chất hệ thống bên dưới chạy khác nhau thế nào không ạ?', '33333333-3333-4333-a333-333333333333', 'Cơ sở dữ liệu', 0, NULL, 'active', '2026-06-06 14:30:00');

-- 5. Thêm Liên kết Thẻ (Question Tags)
INSERT INTO `question_tags` (`question_id`, `tag_id`) VALUES 
('a6b12c84-9669-4a0b-9dfd-519213567801', 4),  -- Bài 1: React
('a6b12c84-9669-4a0b-9dfd-519213567801', 2),  -- Bài 1: JavaScript
('b6b12c84-9669-4a0b-9dfd-519213567802', 7),  -- Bài 2: SQL
('b6b12c84-9669-4a0b-9dfd-519213567802', 13); -- Bài 2: Database

-- 6. Thêm Câu trả lời
INSERT INTO `answers` (`id`, `question_id`, `author_id`, `content`, `is_accepted`, `created_at`) 
VALUES 
('f1a23d45-5678-4bc2-89ef-1234567890a1', 'a6b12c84-9669-4a0b-9dfd-519213567801', '11111111-1111-4111-a111-111111111111', 'Chào Hương, em hãy bọc component con vào `React.memo()`. Đồng thời các hàm callback truyền từ cha xuống con phải được bọc trong hook `useCallback` để giữ nguyên tham chiếu giữa các lần render nhé.', 1, '2026-06-05 11:15:00'),
('f1a23d45-5678-4bc2-89ef-1234567890a2', 'b6b12c84-9669-4a0b-9dfd-519213567802', '22222222-2222-4222-a222-222222222222', 'Việc dùng `SELECT *` sẽ khiến MySQL không dùng được Cover Index, ép hệ thống phải đọc ổ đĩa (Data Block Scan) nhiều hơn, đồng thời làm lãng phí băng thông đường truyền (Network I/O) để gửi các trường không cần thiết về Backend.', 0, '2026-06-06 15:00:00');

-- Đồng bộ liên kết ngược khóa ngoại accepted_answer_id
UPDATE `questions` SET `accepted_answer_id` = 'f1a23d45-5678-4bc2-89ef-1234567890a1' WHERE `id` = 'a6b12c84-9669-4a0b-9dfd-519213567801';

-- 7. Thêm Thảo luận / Bình luận (Comments)
INSERT INTO `question_comments` (`id`, `question_id`, `parent_id`, `author_id`, `content`, `created_at`) 
VALUES 
('c1111111-abcd-4111-9999-111111111111', 'a6b12c84-9669-4a0b-9dfd-519213567801', NULL, '44444444-4444-4444-a444-444444444444', 'Vấn đề tối ưu Render này đúng là nỗi ác mộng của mọi dev React mới vào nghề.', '2026-06-05 10:10:00'),
('c2222222-abcd-4222-9999-222222222222', 'a6b12c84-9669-4a0b-9dfd-519213567801', 'c1111111-abcd-4111-9999-111111111111', '99999999-9999-4999-a999-999999999999', 'Công nhận luôn bạn ơi, tối ưu mệt thực sự!', '2026-06-05 10:12:00');

INSERT INTO `answer_comments` (`id`, `answer_id`, `parent_id`, `author_id`, `content`, `created_at`) 
VALUES 
('d1111111-abcd-4111-8888-111111111111', 'f1a23d45-5678-4bc2-89ef-1234567890a1', NULL, '99999999-9999-4999-a999-999999999999', 'Dạ em áp dụng thử React.memo và thành công giảm được 80% render thừa rồi anh Hải ơi! Cảm ơn anh!', '2026-06-05 11:30:00');

-- 8. Thêm Tương tác Lượt thích (Votes)
INSERT INTO `question_votes` (`id`, `user_id`, `question_id`, `value`) VALUES 
('v1111111-9999-4111-bbbb-111111111111', '44444444-4444-4444-a444-444444444444', 'a6b12c84-9669-4a0b-9dfd-519213567801', 1),
('v2222222-9999-4222-bbbb-222222222222', '33333333-3333-4333-a333-333333333333', 'a6b12c84-9669-4a0b-9dfd-519213567801', 1);

INSERT INTO `answer_votes` (`id`, `user_id`, `answer_id`, `value`) VALUES 
('v3333333-9999-4333-bbbb-333333333333', '99999999-9999-4999-a999-999999999999', 'f1a23d45-5678-4bc2-89ef-1234567890a1', 1);

-- 9. Thêm Đánh dấu lưu trữ (Bookmarks)
INSERT INTO `bookmarks` (`user_id`, `question_id`) VALUES 
('33333333-3333-4333-a333-333333333333', 'a6b12c84-9669-4a0b-9dfd-519213567801');

-- 10. Thêm Nhật ký & Log thông báo
INSERT INTO `notifications` (`id`, `sender_id`, `type`, `source_question_id`, `source_answer_id`, `created_at`) 
VALUES 
('n1111111-0000-4111-cccc-111111111111', '11111111-1111-4111-a111-111111111111', 'new_answer', 'a6b12c84-9669-4a0b-9dfd-519213567801', 'f1a23d45-5678-4bc2-89ef-1234567890a1', '2026-06-05 11:15:00');

INSERT INTO `notification_recipients` (`notification_id`, `receiver_id`, `is_read`, `read_at`) 
VALUES 
('n1111111-0000-4111-cccc-111111111111', '99999999-9999-4999-a999-999999999999', 1, '2026-06-05 11:20:00');

-- 11. Thêm Nhật ký Audit Log hành vi người dùng
INSERT INTO `user_activities` (`user_id`, `action`, `ip_address`, `user_agent`, `meta_data`) 
VALUES 
('99999999-9999-4999-a999-999999999999', 'UPDATE_PROFILE', '10.252.12.84', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"fields_changed": ["bio", "major"]}');