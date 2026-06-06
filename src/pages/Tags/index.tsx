<<<<<<< HEAD
=======
import { MOCK_TAGS, TAG_CATEGORIES } from '@/server/seed/tags';
>>>>>>> Phanh
import { SearchOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useState } from 'react';
import styles from './index.less';

<<<<<<< HEAD
const ALL_TAGS = [
  {
    name: 'Java',
    count: 245,
    color: '#f97316',
    category: 'language',
    desc: 'Ngôn ngữ lập trình hướng đối tượng phổ biến',
  },
  {
    name: 'JavaScript',
    count: 198,
    color: '#eab308',
    category: 'language',
    desc: 'Ngôn ngữ scripting cho web development',
  },
  {
    name: 'Python',
    count: 176,
    color: '#3b82f6',
    category: 'language',
    desc: 'Ngôn ngữ đa năng dùng trong AI/ML, web, data',
  },
  {
    name: 'React',
    count: 165,
    color: '#06b6d4',
    category: 'framework',
    desc: 'Thư viện JavaScript để xây dựng UI',
  },
  {
    name: 'TypeScript',
    count: 142,
    color: '#2563eb',
    category: 'language',
    desc: 'JavaScript với static typing',
  },
  {
    name: 'Node.js',
    count: 128,
    color: '#10b981',
    category: 'framework',
    desc: 'Runtime JavaScript phía server',
  },
  {
    name: 'SQL',
    count: 112,
    color: '#8b5cf6',
    category: 'database',
    desc: 'Ngôn ngữ truy vấn cơ sở dữ liệu quan hệ',
  },
  {
    name: 'OOP',
    count: 98,
    color: '#f97316',
    category: 'concept',
    desc: 'Mô hình lập trình hướng đối tượng',
  },
  {
    name: 'AI/ML',
    count: 87,
    color: '#ec4899',
    category: 'field',
    desc: 'Trí tuệ nhân tạo và Machine Learning',
  },
  {
    name: 'Git',
    count: 85,
    color: '#6b7280',
    category: 'tool',
    desc: 'Hệ thống quản lý phiên bản phân tán',
  },
  {
    name: 'Cấu Trúc Dữ Liệu',
    count: 76,
    color: '#14b8a6',
    category: 'subject',
    desc: 'Môn học về tổ chức và quản lý dữ liệu',
  },
  {
    name: 'Thuật Toán',
    count: 72,
    color: '#14b8a6',
    category: 'subject',
    desc: 'Các phương pháp giải quyết bài toán',
  },
  {
    name: 'Database',
    count: 65,
    color: '#8b5cf6',
    category: 'database',
    desc: 'Thiết kế và quản trị cơ sở dữ liệu',
  },
  {
    name: 'Web Development',
    count: 63,
    color: '#0ea5e9',
    category: 'field',
    desc: 'Phát triển ứng dụng web',
  },
  {
    name: 'Docker',
    count: 54,
    color: '#2563eb',
    category: 'tool',
    desc: 'Nền tảng containerization',
  },
  {
    name: 'C++',
    count: 48,
    color: '#7c3aed',
    category: 'language',
    desc: 'Ngôn ngữ lập trình hệ thống',
  },
  {
    name: 'Mạng Máy Tính',
    count: 45,
    color: '#0891b2',
    category: 'subject',
    desc: 'Môn học về mạng và giao thức',
  },
  {
    name: 'Linux',
    count: 43,
    color: '#374151',
    category: 'tool',
    desc: 'Hệ điều hành mã nguồn mở',
  },
  {
    name: 'Spring Boot',
    count: 38,
    color: '#15803d',
    category: 'framework',
    desc: 'Framework Java cho backend',
  },
  {
    name: 'MongoDB',
    count: 35,
    color: '#15803d',
    category: 'database',
    desc: 'Cơ sở dữ liệu NoSQL',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Tất Cả', emoji: '🏷️' },
  { key: 'language', label: 'Ngôn Ngữ', emoji: '💻' },
  { key: 'framework', label: 'Framework', emoji: '🛠️' },
  { key: 'subject', label: 'Môn Học', emoji: '📚' },
  { key: 'database', label: 'Database', emoji: '🗄️' },
  { key: 'field', label: 'Lĩnh Vực', emoji: '🎯' },
  { key: 'tool', label: 'Công Cụ', emoji: '⚙️' },
  { key: 'concept', label: 'Khái Niệm', emoji: '💡' },
];
=======
const ALL_TAGS = MOCK_TAGS;
const CATEGORIES = TAG_CATEGORIES;
>>>>>>> Phanh

export default function Tags() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [followed, setFollowed] = useState<string[]>(['React', 'JavaScript']);

  const filtered = ALL_TAGS.filter((tag) => {
    const matchSearch =
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === 'all' || tag.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggleFollow = (tagName: string) => {
    setFollowed((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  };

  const totalQuestions = ALL_TAGS.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className={styles.tagsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
<<<<<<< HEAD
          <h1 className={styles.pageTitle}>Tất cả thẻ</h1>
=======
          <h1 className={styles.pageTitle}>🏷️ Tất Cả Thẻ</h1>
>>>>>>> Phanh
          <p className={styles.pageSubtitle}>
            {ALL_TAGS.length} thẻ · {totalQuestions.toLocaleString('vi')} câu
            hỏi
          </p>
        </div>
        {followed.length > 0 && (
          <div className={styles.followedInfo}>
            Đang theo dõi <strong>{followed.length}</strong> thẻ
          </div>
        )}
      </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <SearchOutlined className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm thẻ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.key}
            className={`${styles.catBtn} ${
              activeCategory === cat.key ? styles.active : ''
            }`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Tags Grid */}
      <div className={styles.tagsGrid}>
        {filtered.map((tag, i) => (
          <div
            key={tag.name}
            className={styles.tagCard}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className={styles.tagCardHeader}>
              <div
                className={styles.tagPill}
                style={{
                  background: `${tag.color}18`,
                  color: tag.color,
                  borderColor: `${tag.color}40`,
                }}
              >
                {tag.name}
              </div>
              <span className={styles.tagCount}>{tag.count}</span>
            </div>
            <p className={styles.tagDesc}>{tag.desc}</p>
            <div className={styles.tagCardFooter}>
              <button
                className={`${styles.followBtn} ${
                  followed.includes(tag.name) ? styles.following : ''
                }`}
                onClick={() => toggleFollow(tag.name)}
                style={
                  followed.includes(tag.name)
                    ? { borderColor: tag.color, color: tag.color }
                    : {}
                }
              >
                {followed.includes(tag.name) ? '✓ Đang Theo Dõi' : '+ Theo Dõi'}
              </button>
              <button
                type="button"
                className={styles.exploreBtn}
                onClick={() => history.push(`/forum?tag=${tag.name}`)}
              >
                {tag.count} câu hỏi →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <div>🔍</div>
          <p>Không tìm thấy thẻ nào</p>
        </div>
      )}
    </div>
  );
}
