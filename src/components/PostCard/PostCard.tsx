import {
  BookFilled,
  BookOutlined,
  CheckCircleFilled,
  DislikeFilled,
  DislikeOutlined,
  EyeOutlined,
  FireOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Skeleton, Tooltip } from 'antd';
import React, { useState } from 'react';

import { history } from '@umijs/max';
import styles from './index.less';

const TAG_COLORS: Record<string, string> = {
  Java: '#f97316',
  JavaScript: '#eab308',
  Python: '#3b82f6',
  React: '#06b6d4',
  SQL: '#8b5cf6',
  'AI/ML': '#ec4899',
  'Node.js': '#10b981',
  Git: '#6b7280',
  TypeScript: '#2563eb',
  'Web Development': '#0ea5e9',
  OOP: '#f97316',
  Algorithm: '#14b8a6',
  Default: '#dc2626',
};

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar?: string;
  tags: { id: number; name: string; color?: string; slug?: string }[];
  votes: number;
  comments: number;
  views: number;
  timestamp: string;
  subject?: string;
  isSolved?: boolean;
  isLoading?: boolean;
  authorReputation?: number;
}

export default function PostCard({
  id,
  title,
  excerpt,
  author,
  authorAvatar,
  tags,
  votes,
  comments,
  views,
  timestamp,
  subject,
  isSolved = false,
  isLoading = false,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (isLoading) {
    return (
      <Card className={styles.postCard} styles={{ body: { padding: '16px' } }}>
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLiked) {
      setVoteCount(voteCount + (isDisliked ? 2 : 1));
      setIsLiked(true);

      if (isDisliked) {
        setIsDisliked(false);
      }
    } else {
      setVoteCount(voteCount - 1);
      setIsLiked(false);
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isDisliked) {
      setVoteCount(voteCount - (isLiked ? 2 : 1));
      setIsDisliked(true);

      if (isLiked) {
        setIsLiked(false);
      }
    } else {
      setVoteCount(voteCount + 1);
      setIsDisliked(false);
    }
  };

  const getTagColor = (tag: any) =>
    TAG_COLORS[tag?.name] || tag?.color || TAG_COLORS.Default;

  const isHot = votes > 50;

  return (
    <div
      className={`${styles.postCard} ${isSolved ? styles.solved : ''}`}
      onClick={() => history.push(`/post/${id}`)}
    >
      {/* Vote Column */}
      <div className={styles.voteCol}>
        <button
          className={`${styles.voteBtn} ${isLiked ? styles.active : ''}`}
          onClick={handleLike}
        >
          {isLiked ? <LikeFilled /> : <LikeOutlined />}
        </button>

        <span
          className={`${styles.voteNum} ${isLiked ? styles.liked : ''} ${
            isDisliked ? styles.disliked : ''
          }`}
        >
          {voteCount}
        </span>

        <button
          className={`${styles.voteBtn} ${isDisliked ? styles.activeDown : ''}`}
          onClick={handleDislike}
        >
          {isDisliked ? <DislikeFilled /> : <DislikeOutlined />}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.topRow}>
          {isSolved && (
            <span className={styles.solvedBadge}>
              <CheckCircleFilled /> Đã Giải Quyết
            </span>
          )}

          {isHot && !isSolved && (
            <span className={styles.hotBadge}>
              <FireOutlined /> Hot
            </span>
          )}

          {!isSolved && !isHot && (
            <span className={styles.unansweredBadge}>Chưa Giải Quyết</span>
          )}

          {subject && <span className={styles.subjectTag}>{subject}</span>}
        </div>

        <h3 className={styles.title}>{title}</h3>

        <p className={styles.excerpt}>{excerpt}</p>

        {/* Tags */}
        <div className={styles.tags}>
          {tags?.map((tag: any) => (
            <span
              key={tag.id || tag.name}
              className={styles.tag}
              style={{
                background: `${getTagColor(tag)}18`,
                color: getTagColor(tag),
                borderColor: `${getTagColor(tag)}40`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                history.push('/tags');
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <Avatar
              size={28}
              src={authorAvatar}
              style={{
                background: 'var(--color-primary)',
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {!authorAvatar && author.charAt(0)}
            </Avatar>

            <div>
              <span className={styles.authorName}>{author}</span>

              <span className={styles.dot}>·</span>

              <span className={styles.timestamp}>{timestamp}</span>
            </div>
          </div>

          <div className={styles.stats}>
            <Tooltip title="Bình luận">
              <span className={styles.stat}>
                <MessageOutlined /> {comments}
              </span>
            </Tooltip>

            <Tooltip title="Lượt xem">
              <span className={styles.stat}>
                <EyeOutlined />{' '}
                {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
              </span>
            </Tooltip>

            <Tooltip title={isBookmarked ? 'Bỏ lưu' : 'Lưu bài'}>
              <button
                className={`${styles.bookmarkBtn} ${
                  isBookmarked ? styles.bookmarked : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
              >
                {isBookmarked ? <BookFilled /> : <BookOutlined />}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
