import { MOCK_QUESTIONS } from '@/server/seed/questions';
import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';

export default function handler(req: UmiApiRequest, res: UmiApiResponse) {
  if (req.method === 'GET') {
    const { tag, q } = req.query ?? {};
    let list = [...MOCK_QUESTIONS];

    if (typeof q === 'string' && q.trim()) {
      const keyword = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.excerpt.toLowerCase().includes(keyword),
      );
    }

    if (typeof tag === 'string' && tag.trim()) {
      list = list.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
      );
    }

    res.status(200).json({ success: true, data: { list } });
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({
      success: true,
      message: 'Tạo bài viết — @todo lưu DB và gửi email',
      data: { id: Date.now().toString() },
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
