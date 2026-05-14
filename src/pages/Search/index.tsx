import { Empty, Input, Select, Row, Col, Button, Space } from 'antd';
import { useSearchParams } from '@umijs/max';
import { useState } from 'react';
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

  // Mock search results
  const mockResults = [
    {
      id: '1',
      title: 'Giải thích OOP trong Java: Class, Object, Inheritance',
      excerpt:
        'OOP là nền tảng của Java. Trong bài viết này, tôi sẽ giải thích chi tiết về các khái niệm cốt lõi...',
      author: 'Nguyễn Văn A',
      tags: ['Java', 'OOP', 'Lập Trình'],
      votes: 45,
      comments: 12,
      views: 523,
      timestamp: '2 giờ trước',
      subject: 'Lập Trình Cơ Bản',
    },
    {
      id: '2',
      title: 'Java Exception Handling: Try, Catch, Finally',
      excerpt:
        'Exception handling là một phần quan trọng trong Java. Học cách xử lý lỗi một cách hiệu quả...',
      author: 'Trần Văn B',
      tags: ['Java', 'Exception', 'Error Handling'],
      votes: 32,
      comments: 8,
      views: 412,
      timestamp: '1 ngày trước',
      subject: 'Lập Trình Cơ Bản',
    },
    {
      id: '3',
      title: 'Java Multithreading: Thread, Runnable, Synchronization',
      excerpt: 'Multithreading là công cụ mạnh mẽ trong Java...',
      author: 'Lê Thị C',
      tags: ['Java', 'Multithreading', 'Concurrency'],
      votes: 28,
      comments: 5,
      views: 234,
      timestamp: '2 ngày trước',
      subject: 'Lập Trình Cơ Bản',
    },
  ];

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
        {mockResults.length > 0 ? (
          <>
            <p className={styles.resultCount}>
              Tìm thấy {mockResults.length} kết quả cho "{query}"
            </p>
            <div className={styles.resultsList}>
              {mockResults.map((post) => (
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
