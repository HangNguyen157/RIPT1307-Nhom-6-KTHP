import type { Notification } from '@/constants/notifications';
import {
  MOCK_NOTIFICATIONS,
  TYPE_LABELS,
  TYPE_NAMES,
} from '@/constants/notifications';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Badge, Button, Empty, List, Tabs, Tag, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const TYPE_COLORS: Record<string, string> = {
  answer: '#3b82f6',
  vote: '#f59e0b',
  mention: '#8b5cf6',
  best_answer: '#10b981',
};

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    message.success('Đã đánh dấu tất cả là đã đọc');
  };

  const clearAll = () => {
    setNotifications([]);
    message.success('Đã xóa tất cả thông báo');
  };

  const openNotification = (notif: Notification) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    );
    history.push(notif.link);
  };

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <BellOutlined /> Thông Báo{' '}
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </h1>
          <p className={styles.pageSubtitle}>
            Cập nhật hoạt động liên quan đến bạn trên diễn đàn
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            icon={<CheckOutlined />}
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Đánh dấu đã đọc
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Xóa tất cả
          </Button>
        </div>
      </div>

      <div className={styles.listCard}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `Tất cả (${notifications.length})` },
            { key: 'unread', label: `Chưa đọc (${unreadCount})` },
          ]}
        />

        {filtered.length === 0 ? (
          <Empty
            description={
              activeTab === 'unread'
                ? 'Không có thông báo chưa đọc'
                : 'Không có thông báo nào'
            }
            style={{ padding: '48px 0' }}
          />
        ) : (
          <List
            dataSource={filtered}
            renderItem={(notif) => (
              <List.Item
                className={`${styles.notifItem} ${
                  !notif.read ? styles.unread : ''
                }`}
                onClick={() => openNotification(notif)}
              >
                <div
                  className={styles.notifIcon}
                  style={{
                    background: `${TYPE_COLORS[notif.type]}18`,
                    color: TYPE_COLORS[notif.type],
                  }}
                >
                  {TYPE_LABELS[notif.type]}
                </div>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}>{notif.title}</span>
                    <Tag color={TYPE_COLORS[notif.type]}>
                      {TYPE_NAMES[notif.type]}
                    </Tag>
                    {!notif.read && <span className={styles.unreadDot} />}
                  </div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  <div className={styles.notifTime}>{notif.time}</div>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}
