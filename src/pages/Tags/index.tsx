import { SearchOutlined } from '@ant-design/icons';
import { history, request } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';

const TAG_CATEGORIES = [
  { id: 'all', name: 'Tất Cả' },
  { id: 'web', name: 'Web Development' },
  { id: 'backend', name: 'Backend' },
  { id: 'database', name: 'Database' },
  { id: 'other', name: 'Khác' },
];

const CATEGORY_FILTER_MAP: Record<string, string[]> = {
  all: [],
  web: ['language', 'framework', 'tool'],
  backend: ['subject', 'concept'],
  database: ['database'],
  other: ['field'],
};

export default function Tags() {
  const [tags, setTags] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [followed, setFollowed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await request('/api/tags', { method: 'GET' }).catch(
          () => null,
        );
        if (res?.success && Array.isArray(res.data?.list)) {
          setTags(res.data.list);
        } else if (Array.isArray(res?.data)) {
          setTags(res.data);
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const filtered = tags.filter((tag) => {
    const matchSearch = String(tag.name || '')
      .toLowerCase()
      .includes(search.toLowerCase());
    const categoryList = CATEGORY_FILTER_MAP[activeCategory] || [];
    const matchCategory =
      activeCategory === 'all' ||
      (tag.category && categoryList.includes(tag.category));

    return matchSearch && matchCategory;
  });

  const toggleFollow = (tagName: string) => {
    setFollowed((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  };

  return (
    <div className={styles.tagsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>🏷️ Tất Cả Thẻ</h1>
          <p className={styles.pageSubtitle}>{tags.length} thẻ</p>
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
        {TAG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.catBtn} ${
              activeCategory === cat.id ? styles.active : ''
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tags Grid */}
      {loading ? (
        <div className={styles.loadingState}>Đang tải thẻ...</div>
      ) : filtered.length > 0 ? (
        <div className={styles.tagsGrid}>
          {filtered.map((tag, i) => {
            const tagName = String(tag.name || 'Không tên');
            return (
              <div
                key={tag.id || tagName || i}
                className={styles.tagCard}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className={styles.tagCardHeader}>
                  <div
                    className={styles.tagPill}
                    style={{
                      background: `${tag.color || '#999'}18`,
                      color: tag.color || '#333',
                      borderColor: `${tag.color || '#999'}40`,
                    }}
                  >
                    {tagName}
                  </div>
                  <span className={styles.tagCount}>{tag.count ?? 0}</span>
                </div>
                <p className={styles.tagDesc}>
                  {tag.description || 'Chưa có mô tả'}
                </p>
                <div className={styles.tagCardFooter}>
                  <button
                    className={`${styles.followBtn} ${
                      followed.includes(tagName) ? styles.following : ''
                    }`}
                    onClick={() => toggleFollow(tagName)}
                    style={
                      followed.includes(tagName)
                        ? { borderColor: tag.color, color: tag.color }
                        : {}
                    }
                  >
                    {followed.includes(tagName)
                      ? '✓ Đang Theo Dõi'
                      : '+ Theo Dõi'}
                  </button>
                  <button
                    className={styles.exploreBtn}
                    onClick={() =>
                      history.push(`/forum?tag=${encodeURIComponent(tagName)}`)
                    }
                  >
                    {tag.count ?? 0} câu hỏi →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div>🔍</div>
          <p>Không tìm thấy thẻ nào</p>
        </div>
      )}
    </div>
  );
}
