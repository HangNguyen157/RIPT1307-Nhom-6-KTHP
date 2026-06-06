import { MOCK_TAGS, TAG_CATEGORIES } from '@/server/seed/tags';
import { SearchOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useState } from 'react';
import styles from './index.less';

const ALL_TAGS = MOCK_TAGS;
const CATEGORIES = TAG_CATEGORIES;

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
          <h1 className={styles.pageTitle}>🏷️ Tất Cả Thẻ</h1>
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
