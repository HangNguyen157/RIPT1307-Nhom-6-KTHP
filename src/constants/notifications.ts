export interface Notification {
  id: string;
  type: 'answer' | 'vote' | 'mention' | 'best_answer';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export const TYPE_LABELS: Record<string, string> = {
  answer: 'TL',
  vote: 'VT',
  mention: '@',
  best_answer: 'BA',
};

export const TYPE_NAMES: Record<string, string> = {
  answer: 'Câu trả lời',
  vote: 'Lượt vote',
  mention: 'Nhắc đến',
  best_answer: 'Trả lời hay nhất',
};

/** Dữ liệu thông báo mẫu (demo) — dùng chung cho dropdown và trang Thông Báo */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'Câu trả lời mới',
    message: 'Trần Văn B đã trả lời câu hỏi của bạn về OOP trong Java',
    time: '5 phút trước',
    read: false,
    link: '/post/1',
  },
  {
    id: '2',
    type: 'vote',
    title: 'Nhận được upvote',
    message: 'Câu trả lời của bạn về React Hooks đã nhận được 5 upvote',
    time: '30 phút trước',
    read: false,
    link: '/post/2',
  },
  {
    id: '3',
    type: 'mention',
    title: 'Nhắc đến bạn',
    message: 'Lê Hồng C đã nhắc đến bạn trong bình luận về SQL JOIN',
    time: '1 giờ trước',
    read: false,
    link: '/post/3',
  },
  {
    id: '4',
    type: 'best_answer',
    title: 'Câu trả lời hay nhất',
    message: 'Câu trả lời của bạn về Python được chọn là hay nhất!',
    time: '2 giờ trước',
    read: true,
    link: '/post/4',
  },
];
