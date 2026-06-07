import type { User } from '@/server/models/User';
import { canModerate, isAdmin } from '@/server/models/User';

/**
 * Định nghĩa quyền tập trung cho toàn bộ frontend (Umi access plugin).
 * - isLoggedIn:  đã đăng nhập (sinhvien / giangvien / admin)
 * - canModerate: kiểm duyệt nội dung — giangvien + admin
 *                (xóa bài bất kỳ, xác nhận câu trả lời hay nhất)
 * - canSeeAdmin: truy cập khu quản trị /admin — chỉ admin
 *
 * Dùng trong component qua hook useAccess(), và gắn vào route
 * qua thuộc tính `access` trong .umirc.ts.
 */
export default (initialState: { currentUser?: User | null }) => {
  const user = initialState?.currentUser ?? null;

  return {
    isLoggedIn: !!user,
    canModerate: canModerate(user),
    canSeeAdmin: isAdmin(user),
  };
};
