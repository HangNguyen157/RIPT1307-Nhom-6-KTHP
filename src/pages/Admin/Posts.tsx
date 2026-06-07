import { authUtils } from '@/utils/auth';
import { request } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = authUtils.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await request('/api/posts', { method: 'GET' });
        if (res?.success && Array.isArray(res.data.list)) {
          setPosts(
            res.data.list.map((q: any) => ({
              id: q.id,
              title: q.title,
              author: q.author?.name || 'Ẩn danh',
              subject: q.subject || '',
              votes: 0,
              comments: 0,
              status: q.status || 'active',
              isSolved: q.is_solved === 1,
              createdAt: q.created_at
                ? new Date(q.created_at).toLocaleDateString('vi-VN')
                : '',
            })),
          );
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const deletePost = async (id: string) => {
    try {
      const res = await request(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      // Thường API trả về response trực tiếp, nếu bọc trong res.data thì bạn sửa thành res?.data?.success
      if (res?.success || res?.data?.success) {
        setPosts(posts.filter((p) => p.id !== id));
        message.success('Đã xóa bài viết thành công');
      } else {
        message.error(res?.message || 'Lỗi khi xóa bài viết');
      }
    } catch (err: any) {
      // Lấy message từ server trả về nếu có trong err.response
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Lỗi khi xóa bài viết';
      message.error(errorMsg);
    }
  };
}
