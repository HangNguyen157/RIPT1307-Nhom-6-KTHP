import { Empty, Input, Select, Row, Col, Spin } from 'antd';
import { useSearchParams, request } from '@umijs/max';
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import styles from './index.less';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchText, setSearchText] = useState(query);
  const [filters, setFilters] = useState({
    sortBy: 'relevant',
    filterBy: 'all',
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const apiSort = filters.sortBy === 'votes' ? 'votes' : filters.sortBy === 'newest' ? '' : 'views';
        const res = await request<{ success: boolean; data: { list: any[] } }>('/api/posts', {
          method: 'GET',
          params: {
            q: searchText,
            sort: apiSort,
          },
        });
        if (res && res.success) {
          let list = res.data.list;
          if (filters.filterBy === 'unanswered') {
            list = list.filter((p: any) => !p.isSolved);
          } else if (filters.filterBy === 'solved') {
            list = list.filter((p: any) => p.isSolved);
          }
          setResults(list);
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm bài viết:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchText, filters.sortBy, filters.filterBy]);

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
              onChange={(value) =>
                setFilters({ ...filters, sortBy: value })
              }
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
              onChange={(value) =>
                setFilters({ ...filters, filterBy: value })
              }
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
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin size="large" tip="Đang tìm kiếm..." />
          </div>
        ) : results.length > 0 ? (
          <>
            <p className={styles.resultCount}>
              Tìm thấy {results.length} kết quả cho "{searchText}"
            </p>
            <div className={styles.resultsList}>
              {results.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  tags={post.tags}
                  votes={post.votes}
                  comments={post.comments}
                  views={post.views}
                  timestamp={post.timestamp}
                  subject={post.subject}
                  isSolved={post.isSolved}
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

