import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
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

const TYPE_ICONS: Record<string, string> = {
  answer: '💬',
  vote: '👍',
  mention: '@',
  best_answer: '🏆',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationDropdown({ open, onOpenChange }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // TODO: Add notification API endpoint when available
        // For now, show empty state
        setNotifications([]);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchNotifications();
  }, [open]);

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
          <button className={styles.markAll} onClick={markAllRead}>
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
                window.location.href = notif.link;
              }}
            >
              <div className={`${styles.icon} ${styles[notif.type]}`}>
                {TYPE_ICONS[notif.type]}
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
          <button className={styles.bellBtn}>
            <BellOutlined />
          </button>
        </Badge>
      </div>
    </Dropdown>
  );
}
