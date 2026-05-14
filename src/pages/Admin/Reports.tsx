import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import styles from './index.less';

const REPORTS = [
  {
    id: '1', postTitle: 'React Hooks: useState, useEffect, useContext', postId: '2',
    reporter: 'Lê Văn X', reason: 'Nội dung sai kiến thức', reportedAt: '10/05/2026',
    type: 'post', status: 'pending', severity: 'medium',
  },
  {
    id: '2', postTitle: 'Bình luận vi phạm trên bài OOP', postId: '1',
    reporter: 'Trần Thị Y', reason: 'Ngôn ngữ không phù hợp', reportedAt: '09/05/2026',
    type: 'comment', status: 'pending', severity: 'high',
  },
  {
    id: '3', postTitle: 'SQL: JOIN và Optimization', postId: '3',
    reporter: 'Nguyễn Văn Z', reason: 'Spam / quảng cáo', reportedAt: '08/05/2026',
    type: 'post', status: 'resolved', severity: 'low',
  },
];

const SEVERITY_INFO: Record<string, { color: string; label: string }> = {
  high: { color: '#dc2626', label: '🔴 Nghiêm Trọng' },
  medium: { color: '#f59e0b', label: '🟡 Trung Bình' },
  low: { color: '#10b981', label: '🟢 Thấp' },
};

export default function AdminReports() {
  const [reports, setReports] = useState(REPORTS);

  const resolveReport = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'resolved' } : r));
    message.success('Đã giải quyết báo cáo');
  };

  const dismissReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    message.info('Đã bỏ qua báo cáo');
  };

  const pending = reports.filter((r) => r.status === 'pending');
  const resolved = reports.filter((r) => r.status === 'resolved');

  return (
    <div className={styles.adminSection}>
      <h2 className={styles.sectionTitle}>⚠️ Quản Lý Báo Cáo</h2>

      <div className={styles.miniStats}>
        {[
          { label: 'Chờ Xử Lý', value: pending.length, icon: '⚠️', color: '#f59e0b' },
          { label: 'Đã Giải Quyết', value: resolved.length, icon: '✅', color: '#10b981' },
          { label: 'Tổng Báo Cáo', value: reports.length, icon: '📋', color: '#3b82f6' },
        ].map((s, i) => (
          <div key={i} className={styles.miniStat}>
            <span className={styles.miniStatIcon}>{s.icon}</span>
            <div>
              <div className={styles.miniStatValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.miniStatLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reports.map((report) => {
          const sev = SEVERITY_INFO[report.severity];
          return (
            <div key={report.id} className={`${styles.reportCard} ${report.status === 'resolved' ? styles.resolved : ''}`}>
              <span className={styles.reportIcon}>{report.type === 'post' ? '📝' : '💬'}</span>
              <div className={styles.reportContent}>
                <div className={styles.reportTitle}>{report.postTitle}</div>
                <div className={styles.reportMeta}>
                  <span>👤 Báo cáo bởi: {report.reporter}</span>
                  <span>📅 {report.reportedAt}</span>
                  <span>🏷️ {report.type === 'post' ? 'Bài viết' : 'Bình luận'}</span>
                </div>
                <span className={styles.reportReason}>💬 Lý do: {report.reason}</span>
                <span style={{ color: sev.color, fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
                  {sev.label}
                </span>
              </div>
              <div className={styles.reportActions}>
                {report.status === 'pending' ? (
                  <>
                    <Button size="small" type="primary" danger icon={<CheckOutlined />}
                      onClick={() => resolveReport(report.id)}>
                      Xử Lý
                    </Button>
                    <Button size="small" icon={<EyeOutlined />}
                      onClick={() => history.push(`/post/${report.postId}`)}>
                      Xem Bài
                    </Button>
                    <Button size="small" icon={<CloseOutlined />}
                      onClick={() => dismissReport(report.id)}>
                      Bỏ Qua
                    </Button>
                  </>
                ) : (
                  <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>✅ Đã Giải Quyết</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
