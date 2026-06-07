import PostCard from '@/components/PostCard';
import { request, useSearchParams } from '@umijs/max';
import { Col, Empty, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchText, setSearchText] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'relevant',
    filterBy: 'all',
  });

  // Fetch search results from API
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const res = await request('/api/posts', {
          method: 'GET',
          params: { q: query },
        });
        if (res?.success && Array.isArray(res.data.list)) {
          setResults(res.data.list);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.header}>
        <h1>Kết Quả Tìm Kiếm</h1>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Input.Search
          size="large"
          placeholder="Tìm câu hỏi, bài viết..."
          defaultValue={searchText}
          onSearch={(value) => setSearchText(value)}
        />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Select
              value={filters.sortBy}
              onChange={(value) => setFilters({ ...filters, sortBy: value })}
              options={[
                { label: 'Liên quan nhất', value: 'relevant' },
                { label: 'Mới nhất', value: 'newest' },
                { label: 'Được vote cao nhất', value: 'votes' },
                { label: 'Nhiều bình luận', value: 'comments' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              value={filters.filterBy}
              onChange={(value) => setFilters({ ...filters, filterBy: value })}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Chưa có câu trả lời', value: 'unanswered' },
                { label: 'Đã giải quyết', value: 'solved' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </div>

      {/* Results */}
      <div className={styles.results}>
        {loading ? (
          <p>Đang tìm kiếm...</p>
        ) : results.length > 0 ? (
          <>
            <p className={styles.resultCount}>
              Tìm thấy {results.length} kết quả cho "{query}"
            </p>
            <div className={styles.resultsList}>
              {results.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author?.name || 'Ẩn danh'}
                  tags={post.tags || []}
                  votes={post.votes ?? 0}
                  comments={post.comments ?? 0}
                  views={post.views ?? 0}
                  timestamp={
                    post.created_at
                      ? new Date(post.created_at).toLocaleDateString('vi-VN')
                      : 'Mới'
                  }
                  subject={post.subject}
                  isSolved={post.is_solved === 1}
                />
              ))}
            </div>
          </>
        ) : (
          <Empty
            description="Không tìm thấy kết quả nào"
            style={{ marginTop: 48 }}
          />
        )}
      </div>
    </div>
  );
}
