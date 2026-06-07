# EduForum — Diễn đàn học tập (RIPT1307 — Nhóm 6)

Dự án xây dựng trên `@umijs/max` — xem thêm [Umi Max](https://umijs.org/docs/max/introduce).

## Phân quyền (RBAC)

Hệ thống có 3 vai trò, quyền được định nghĩa **tập trung tại `src/access.ts`** (Umi access plugin) và kiểm tra lại ở **server** (`src/server/middlewares/auth.ts` — giải mã JWT, tra role thật từ DB).

| Chức năng | Khách | Sinh viên | Giảng viên | Admin |
| --- | :-: | :-: | :-: | :-: |
| Xem bài viết, diễn đàn, bảng xếp hạng | ✅ | ✅ | ✅ | ✅ |
| Đăng bài, bình luận, vote | ❌ | ✅ | ✅ | ✅ |
| Sửa/xóa bài viết **của mình** | ❌ | ✅ | ✅ | ✅ |
| Chọn "câu trả lời hay nhất" cho bài của mình | ❌ | ✅ | ✅ | ✅ |
| **Kiểm duyệt**: xóa bài bất kỳ, xác nhận câu trả lời hay nhất cho mọi bài | ❌ | ❌ | ✅ | ✅ |
| Trang Kiểm Duyệt `/moderation` (danh sách bài viết + công cụ kiểm duyệt) | ❌ | ❌ | ✅ | ✅ |
| Khu quản trị `/admin` (dashboard, quản lý bài viết / thành viên / báo cáo) | ❌ | ❌ | ❌ | ✅ |

### Cơ chế thực thi

- **Frontend (Umi access plugin)**
  - `src/access.ts` định nghĩa 3 quyền: `isLoggedIn`, `canModerate` (giảng viên + admin), `canSeeAdmin` (admin).
  - Route `/admin` trong `.umirc.ts` gắn `access: 'canSeeAdmin'`; layout `src/pages/Admin/index.tsx` bao toàn bộ trang con và chặn bằng `useAccess()` — user không đủ quyền bị đẩy về `/login`.
  - Component dùng `useAccess()` để ẩn/hiện chức năng theo quyền (menu Quản Trị + Kiểm Duyệt trong Header, nút Xóa Bài / Chọn Hay Nhất ở trang chi tiết, trang `/moderation` của giảng viên).
  - Đăng nhập cập nhật `initialState` ngay (không cần F5) và điều hướng theo vai trò: **admin → `/admin/dashboard`**, còn lại → `/home`.
- **Backend (bắt buộc — không tin client)**
  - Mọi API ghi dữ liệu xác thực bằng JWT (`requireAuth`), role lấy từ DB chứ không từ client.
  - `/api/admin/*` chỉ chấp nhận admin (`requireAdminAuth`).
  - Xóa bài / chọn câu trả lời hay nhất: tác giả hoặc role thuộc `['admin', 'giangvien']` (`requireRole`).

### Tài khoản demo

| Vai trò    | Email                       | Mật khẩu   |
| ---------- | --------------------------- | ---------- |
| Admin      | `admin@ptit.edu.vn`         | `12345678` |
| Giảng viên | `duc.lm@ptit.edu.vn`        | `12345678` |
| Sinh viên  | `huong@student.ptit.edu.vn` | `12345678` |
