/** Vote model — upvote / downvote cho bài hoặc bình luận. */

export type VoteTargetType = 'question' | 'comment';

export type VoteValue = 1 | -1;

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteTargetType;
  value: VoteValue;
}
