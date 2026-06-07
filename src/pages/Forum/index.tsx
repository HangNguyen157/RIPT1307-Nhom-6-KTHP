import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Tabs, Pagination, Empty, Skeleton } from 'antd';
import {
  FireOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UserOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { history, request, useSearchParams } from '@umijs/max';
import PostCard from '@/components/PostCard';
import { MOCK_QUESTIONS } from '@/server/seed/questions';
import styles from './index.less';

const mockPosts = MOCK_QUESTIONS;

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Forum() {
  const [searchParams] = useSearchParams();
  const tagParam = searchParams.get('tag') || '';
  const queryParam = searchParams.get('q') || '';
  const subjectParam = searchParams.get('subject') || '';
  const deptParam = searchParams.get('dept') || '';
  const sortParam = searchParams.get('sort') || 'hot';

  const [activeFilter, setActiveFilter] = useState(sortParam);
  const [activePosts, setActivePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    setActiveFilter(sortParam);
  }, [sortParam]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const resContributors = await request<{ success: boolean; data: { list: any[] } }>('/api/leaderboard');
        if (resContributors && resContributors.success) {
          setTopContributors(resContributors.data.list.slice(0, 5));
        }

        const resTags = await request<{ success: boolean; data: { list: any[] } }>('/api/tags');
        if (resTags && resTags.success) {
          setTrendingTags(resTags.data.list.slice(0, 6));
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu sidebar:', error);
      }
    };
    fetchSidebarData();
  }, []);


  const filterOptions = [
    { key: 'hot', label: 'Nóng', icon: <FireOutlined /> },
    { key: 'newest', label: 'Mới Nhất', icon: <ClockCircleOutlined /> },
    { key: 'votes', label: 'Nhiều Vote', icon: <LikeOutlined /> },
    { key: 'unanswered', label: 'Chưa Trả Lời', icon: <QuestionCircleOutlined /> },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const apiSort = activeFilter;
        const res = await request<{ success: boolean; data: { list: any[]; pagination: PaginationInfo } }>('/api/posts', {
          method: 'GET',
          params: {
            tag: tagParam,
            q: queryParam,
            subject: subjectParam,
            dept: deptParam,
            sort: apiSort,
            page: pagination.page,
            limit: pagination.limit,
          },
        });
        if (res && res.success) {
          let list = res.data.list;
          if (activeFilter === 'unanswered') {
            list = list.filter((p: any) => !p.isSolved);
          }
          setActivePosts(list);
          
          // Update pagination info from response
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (error) {
        console.error('Lỗi tải danh sách bài viết từ database:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [tagParam, queryParam, subjectParam, deptParam, activeFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    // Reset về trang 1 khi thay đổi các bộ lọc chính
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [tagParam, queryParam, subjectParam, deptParam]);

  const handleFilter = (key: string) => {
    setActiveFilter(key);
    // Also update URL to keep in sync
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', key);
    history.push(`/forum?${params.toString()}`);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filter changes
  };

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('tag') === tagName) {
      params.delete('tag');
    } else {
      params.set('tag', tagName);
    }
    history.push(`/forum?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };


  return (
    <div className={styles.forumPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Diễn Đàn Hỏi Đáp</h1>
          <p className={styles.pageSubtitle}>Khám phá {mockPosts.length * 100}+ câu hỏi từ cộng đồng sinh viên</p>
        </div>
        <Button
          type="primary"
          danger
          size="large"
          className={styles.askBtn}
          onClick={() => history.push('/post/new')}
        >
          + Đặt Câu Hỏi
        </Button>
      </div>

      <div className={styles.forumLayout}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Filter Tabs */}
          <div className={styles.filterBar}>
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                className={`${styles.filterBtn} ${activeFilter === opt.key ? styles.active : ''}`}
                onClick={() => handleFilter(opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Post List */}
          <div className={styles.postList}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className={styles.postItem} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
              ))
            ) : activePosts && activePosts.length > 0 ? (
              activePosts.map((post, index) => (
                <div
                  key={post?.id || index}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={styles.postItem}
                >
                  <PostCard
                    id={post?.id}
                    title={post?.title}
                    excerpt={post?.excerpt}
                    author={post?.author}
                    tags={post?.tags || []}
                    votes={post?.votes || 0}
                    comments={post?.comments || 0}
                    views={post?.views || 0}
                    timestamp={post?.timestamp}
                    subject={post?.subject}
                    isSolved={post?.isSolved}
                  />
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                <Empty description="Không tìm thấy bài viết nào phù hợp" />
              </div>
            )}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          {/* Top Contributors */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <TrophyOutlined className={styles.widgetIcon} />
              <span>Top Đóng Góp</span>
            </div>
            <div className={styles.contributorList}>
              {topContributors.map((user, index) => (
                <div
                  key={user.id}
                  className={styles.contributor}
                  onClick={() => history.push(`/profile/${user.id}`)}
                >
                  <span className={styles.rank}>#{index + 1}</span>
                  <div className={styles.contributorAvatar}>
                    {user.name.charAt(0)}
                  </div>
                  <div className={styles.contributorInfo}>
                    <div className={styles.contributorName}>{user.name}</div>
                    <div className={styles.contributorRole}>
                      {user.role === 'giangvien' ? 'Giảng viên' : 'Sinh viên'}
                    </div>
                  </div>
                  <div className={styles.contributorRep}>
                    <span>{(user.reputation ?? user.rep ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.viewMoreBtn} onClick={() => history.push('/leaderboard')}>
              Xem Bảng Xếp Hạng <RightOutlined />
            </button>
          </div>

          {/* Trending Tags */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <FireOutlined className={styles.widgetIcon} />
              <span>Tags Thịnh Hành</span>
            </div>
            <div className={styles.trendingTags}>
              {trendingTags.map((tag) => (
                <div
                  key={tag.name}
                  className={`${styles.trendingTag} ${
                    tagParam === tag.name ? styles.active : ''
                  }`}
                  onClick={() => handleTagClick(tag.name)}
                >
                  <span
                    className={styles.tagDot}
                    style={{ background: tag.color }}
                  />
                  <span className={styles.tagName}>{tag.name}</span>
                  <span className={styles.tagCount}>{tag.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.sideWidget}>
            <div className={styles.widgetHeader}>
              <ClockCircleOutlined className={styles.widgetIcon} />
              <span>Hoạt Động Gần Đây</span>
            </div>
            <div className={styles.activityList}>
              {[
                { user: 'Nguyễn Văn A', action: 'đã đặt câu hỏi', time: '5 phút trước' },
                { user: 'Trần Thị B', action: 'đã trả lời', time: '12 phút trước' },
                { user: 'Lê Văn C', action: 'đã upvote', time: '20 phút trước' },
                { user: 'PGS.TS Lê Minh Đức', action: 'đã chọn best answer', time: '1 giờ trước' },
              ].map((act, i) => (
                <div key={i} className={styles.activityItem}>
                  <div>
                    <span className={styles.activityUser}>{act.user}</span>
                    <span className={styles.activityAction}> {act.action}</span>
                    <div className={styles.activityTime}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
