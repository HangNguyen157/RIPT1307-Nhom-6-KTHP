import { MOCK_NOTIFICATIONS, TYPE_LABELS } from '@/constants/notifications';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Badge, Dropdown, Empty } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

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
        <button
          type="button"
          className={styles.viewAll}
          onClick={() => {
            onOpenChange(false);
            history.push('/notifications');
          }}
        >
          Xem tất cả thông báo →
        </button>
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
