import {
  BookOutlined,
  CloseOutlined,
  FilterOutlined,
  FireOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { history, useSearchParams } from '@umijs/max';
import { Collapse, Tooltip } from 'antd';
import styles from './index.less';

const popularTags = [
  { name: 'Java', count: 245, color: '#f97316' },
  { name: 'JavaScript', count: 198, color: '#eab308' },
  { name: 'React', count: 176, color: '#06b6d4' },
  { name: 'Python', count: 154, color: '#3b82f6' },
  { name: 'TypeScript', count: 142, color: '#2563eb' },
  { name: 'Node.js', count: 128, color: '#10b981' },
  { name: 'SQL', count: 112, color: '#8b5cf6' },
  { name: 'AI/ML', count: 98, color: '#ec4899' },
];

const subjects = [
  { name: 'Lập Trình Cơ Bản', count: 89 },
  { name: 'Cấu Trúc Dữ Liệu', count: 76 },
  { name: 'Mạng Máy Tính', count: 65 },
  { name: 'Cơ Sở Dữ Liệu', count: 54 },
  { name: 'Hệ Điều Hành', count: 43 },
  { name: 'Web Development', count: 38 },
];

// Khớp với giá trị department thực tế trong dữ liệu user
const departments = [
  'Công Nghệ Thông Tin',
  'Khoa CNTT',
  'Kỹ Thuật Phần Mềm',
  'An Toàn Thông Tin',
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  // Trạng thái lọc lấy từ URL — luôn đồng bộ với trang Forum
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || '';
  const activeTag = searchParams.get('tag') || '';
  const activeSubject = searchParams.get('subject') || '';
  const activeDept = searchParams.get('dept') || '';

  // Điều hướng tới Forum với query lọc, đóng drawer mobile nếu có
  const goFilter = (query: string) => {
    history.push(`/forum${query}`);
    onClose?.();
  };

  const collapseItems = [
    {
      key: '1',
      label: (
        <span className={styles.collapseLabel}>
          <FireOutlined style={{ color: '#dc2626' }} /> Thẻ Phổ Biến
        </span>
      ),
      children: (
        <div className={styles.tagList}>
          {popularTags.map((tag) => (
            <Tooltip
              key={tag.name}
              title={`Lọc bài viết theo thẻ ${tag.name}`}
              placement="right"
            >
              <div
                className={`${styles.tagItem} ${
                  activeTag === tag.name ? styles.followed : ''
                }`}
                onClick={() =>
                  activeTag === tag.name
                    ? goFilter('')
                    : goFilter(`?tag=${encodeURIComponent(tag.name)}`)
                }
              >
                <span
                  className={styles.tagDot}
                  style={{ background: tag.color }}
                />
                <span className={styles.tagName} style={{ color: tag.color }}>
                  {tag.name}
                </span>
                <span className={styles.tagCount}>{tag.count}</span>
                {activeTag === tag.name && (
                  <span className={styles.followedCheck}>✓</span>
                )}
              </div>
            </Tooltip>
          ))}
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => history.push('/tags')}
          >
            Xem Tất Cả Thẻ →
          </button>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className={styles.collapseLabel}>
          <BookOutlined style={{ color: '#dc2626' }} /> Môn Học
        </span>
      ),
      children: (
        <div className={styles.subjectList}>
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className={`${styles.subjectItem} ${
                activeSubject === subject.name ? styles.followed : ''
              }`}
              onClick={() =>
                activeSubject === subject.name
                  ? goFilter('')
                  : goFilter(`?subject=${encodeURIComponent(subject.name)}`)
              }
            >
              <span>{subject.name}</span>
              <span className={styles.count}>{subject.count}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className={styles.collapseLabel}>
          <TeamOutlined style={{ color: '#dc2626' }} /> Chuyên Ngành
        </span>
      ),
      children: (
        <div className={styles.departmentList}>
          {departments.map((dept) => (
            <button
              type="button"
              key={dept}
              className={`${styles.deptBtn} ${
                activeDept === dept ? styles.active : ''
              }`}
              onClick={() =>
                activeDept === dept
                  ? goFilter('')
                  : goFilter(`?dept=${encodeURIComponent(dept)}`)
              }
            >
              {dept}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const filterOptions = [
    { key: 'newest', label: 'Mới Nhất' },
    { key: 'votes', label: 'Nhiều Vote' },
    { key: 'hot', label: 'Đang Hot' },
    { key: 'unanswered', label: 'Chưa Trả Lời' },
    { key: 'solved', label: 'Đã Giải Quyết' },
  ];

  return (
    <aside className={styles.sidebar}>
      {onClose && (
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>EduForum</span>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
      )}

      {/* Quick nav for mobile drawer */}
      {onClose && (
        <div className={styles.quickNav}>
          {[
            { label: 'Trang Chủ', path: '/home' },
            { label: 'Diễn Đàn', path: '/forum' },
            { label: 'Thẻ', path: '/tags' },
            { label: 'Xếp Hạng', path: '/leaderboard' },
          ].map((item) => (
            <button
              type="button"
              key={item.path}
              className={styles.quickNavBtn}
              onClick={() => {
                history.push(item.path);
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Collapse sections */}
      <div className={styles.collapseWrapper}>
        <Collapse
          items={collapseItems}
          defaultActiveKey={['1', '2']}
          className={styles.collapse}
          expandIconPosition="end"
        />
      </div>

      {/* Filter */}
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>
          <FilterOutlined style={{ color: '#dc2626' }} /> Bộ Lọc
        </div>
        <div className={styles.filterList}>
          {filterOptions.map((opt) => (
            <button
              type="button"
              key={opt.key}
              className={`${styles.filterBtn} ${
                activeFilter === opt.key ? styles.active : ''
              }`}
              onClick={() =>
                activeFilter === opt.key
                  ? goFilter('')
                  : goFilter(`?filter=${opt.key}`)
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
