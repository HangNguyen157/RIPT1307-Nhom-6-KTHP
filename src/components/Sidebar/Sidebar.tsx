import React, { useState, useEffect } from 'react';
import { Button, Collapse, Tooltip, Skeleton, Empty } from 'antd';
import {
  FireOutlined, BookOutlined, TeamOutlined, TagsOutlined,
  CloseOutlined, FilterOutlined,
} from '@ant-design/icons';
import { history, useSearchParams, request } from '@umijs/max';
import styles from './index.less';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [searchParams] = useSearchParams();
  const activeSort = searchParams.get('sort') || 'hot';
  const activeTag = searchParams.get('tag');
  const activeSubject = searchParams.get('subject');
  const activeDept = searchParams.get('dept');

  const [popularTags, setPopularTags] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resTags, resSubjects, resDepts] = await Promise.all([
          request<{ success: boolean; data: { list: any[] } }>('/api/tags'),
          request<{ success: boolean; data: { list: any[] } }>('/api/stats/subjects'),
          request<{ success: boolean; data: { list: any[] } }>('/api/stats/depts')
        ]);

        if (resTags && resTags.success) {
          setPopularTags(resTags.data.list.slice(0, 8));
        }
        if (resSubjects && resSubjects.success) {
          setSubjects(resSubjects.data.list);
        }
        if (resDepts && resDepts.success) {
          setDepartments(resDepts.data.list);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu sidebar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterClick = (type: 'tag' | 'subject' | 'dept', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = searchParams.get(type);

    if (currentValue === value) {
      params.delete(type); 
    } else {
      params.set(type, value);
    }
    
    history.push(`/forum?${params.toString()}`);
    if (onClose) onClose();
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
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          ) : popularTags.length > 0 ? (
            popularTags.map((tag) => (
              <div
                key={tag.name}
                className={`${styles.tagItem} ${activeTag === tag.name ? styles.active : ''}`}
                onClick={() => handleFilterClick('tag', tag.name)}
              >
                <span className={styles.tagDot} style={{ background: tag.color }} />
                <span className={styles.tagName} style={{ color: tag.color }}>{tag.name}</span>
                <span className={styles.tagCount}>{tag.count}</span>
                {activeTag === tag.name && <span className={styles.followedCheck}>✓</span>}
              </div>
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#999' }}>Không có thẻ nào</div>
          )}
          <button className={styles.viewAllBtn} onClick={() => history.push('/tags')}>
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
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          ) : subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.subject} className={`${styles.subjectItem} ${activeSubject === subject.subject ? styles.active : ''}`}
                onClick={() => handleFilterClick('subject', subject.subject)}>
                <span>{subject.subject}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.count}>{subject.count}</span>
                  {activeSubject === subject.subject && (
                    <span className={styles.followedCheck} style={{ marginLeft: '4px' }}>✓</span>
                  )}
                </div>
              </div>
            ))
          ) : (
             <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#999' }}>Không có môn học nào</div>
          )}
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
          {loading ? (
             <Skeleton active paragraph={{ rows: 2 }} title={false} />
          ) : departments.length > 0 ? (
            departments.map((dept) => (
              <button key={dept.name} className={`${styles.deptBtn} ${activeDept === dept.name ? styles.active : ''}`}
                onClick={() => handleFilterClick('dept', dept.name)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span>{dept.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.tagCount} style={{ background: '#f5f5f5' }}>{dept.count}</span>
                    {activeDept === dept.name && (
                      <span className={styles.followedCheck}>✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#999' }}>Không có chuyên ngành nào</div>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = [
    { key: 'newest', label: 'Mới Nhất' },
    { key: 'votes', label: 'Nhiều Vote' },
    { key: 'hot', label: 'Đang Hot' },
    { key: 'unanswered', label: 'Chưa Trả Lời' },
  ];

  const handleSortClick = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = activeSort === key ? 'hot' : key;
    params.set('sort', newSort);
    history.push(`/forum?${params.toString()}`);
  };

  return (
    <aside className={styles.sidebar}>
      {onClose && (
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>EduForum</span>
          <button className={styles.closeBtn} onClick={onClose}><CloseOutlined /></button>
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
            <button key={item.path} className={styles.quickNavBtn}
              onClick={() => { history.push(item.path); if (onClose) onClose(); }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Collapse sections */}
      <div className={styles.collapseWrapper}>
        <Collapse
          items={collapseItems}
          defaultActiveKey={['1', '2', '3']}
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
              key={opt.key}
              className={`${styles.filterBtn} ${activeSort === opt.key ? styles.active : ''}`}
              onClick={() => handleSortClick(opt.key)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span>{opt.label}</span>
                {activeSort === opt.key && activeSort !== 'hot' && (
                  <span className={styles.followedCheck}>✓</span>
                )}
                {activeSort === 'hot' && opt.key === 'hot' && (
                   <span className={styles.followedCheck}>✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
