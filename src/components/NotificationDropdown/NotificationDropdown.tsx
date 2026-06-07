import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Badge, Dropdown, Empty } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

interface Notification {
  id: string;
  type: 'answer' | 'vote' | 'mention' | 'best_answer';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
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

const TYPE_LABELS: Record<string, string> = {
  answer: 'TL',
  vote: 'VT',
  mention: '@',
  best_answer: 'BA',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationDropdown({ open, onOpenChange }: Props) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const dropdownContent = (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <span className={styles.title}>Thông Báo</span>
        {unreadCount > 0 && (
          <button
            type="button"
            className={styles.markAll}
            onClick={markAllRead}
          >
            <CheckOutlined /> Đánh dấu đã đọc
          </button>
        )}
      </div>
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <Empty
            description="Không có thông báo"
            style={{ padding: '32px 0' }}
          />
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.item} ${!notif.read ? styles.unread : ''}`}
              onClick={() => {
                markRead(notif.id);
                history.push(notif.link);
              }}
            >
              <div className={`${styles.icon} ${styles[notif.type]}`}>
                {TYPE_LABELS[notif.type]}
              </div>
              <div className={styles.content}>
                <div className={styles.itemTitle}>{notif.title}</div>
                <div className={styles.message}>{notif.message}</div>
                <div className={styles.time}>{notif.time}</div>
              </div>
              {!notif.read && <div className={styles.dot} />}
            </div>
          ))
        )}
      </div>
      <div className={styles.footer}>
        <a href="/notifications" className={styles.viewAll}>
          Xem tất cả thông báo →
        </a>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={onOpenChange}
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <div className={styles.trigger}>
        <Badge count={unreadCount} size="small" offset={[2, -2]}>
          <button type="button" className={styles.bellBtn}>
            <BellOutlined />
          </button>
        </Badge>
      </div>
    </Dropdown>
  );
}
