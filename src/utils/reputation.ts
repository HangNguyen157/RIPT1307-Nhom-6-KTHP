export interface ReputationLevel {
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  description: string;
}

export const REPUTATION_LEVELS: ReputationLevel[] = [
  {
    name: 'Người Mới',
    emoji: '🆕',
    minPoints: 0,
    maxPoints: 99,
    color: '#6b7280',
    description: 'Vừa tham gia cộng đồng',
  },
  {
    name: 'Đóng Góp Viên',
    emoji: '🤝',
    minPoints: 100,
    maxPoints: 499,
    color: '#3b82f6',
    description: 'Đang đóng góp tích cực cho cộng đồng',
  },
  {
    name: 'Chuyên Gia',
    emoji: '⭐',
    minPoints: 500,
    maxPoints: 1999,
    color: '#f59e0b',
    description: 'Có kiến thức chuyên sâu và được cộng đồng tin tưởng',
  },
  {
    name: 'Cố Vấn',
    emoji: '🏆',
    minPoints: 2000,
    maxPoints: Infinity,
    color: '#dc2626',
    description: 'Chuyên gia hàng đầu, là nguồn cảm hứng cho cộng đồng',
  },
];

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export const BADGES: Record<string, Badge> = {
  newcomer: {
    id: 'newcomer',
    name: 'Người Mới',
    emoji: '🌱',
    description: 'Đặt câu hỏi đầu tiên',
    color: '#10b981',
    rarity: 'common',
  },
  'first-question': {
    id: 'first-question',
    name: 'Câu Hỏi Đầu Tiên',
    emoji: '❓',
    description: 'Đăng câu hỏi đầu tiên',
    color: '#3b82f6',
    rarity: 'common',
  },
  helpful: {
    id: 'helpful',
    name: 'Hỗ Trợ Tích Cực',
    emoji: '💡',
    description: 'Có 10 câu trả lời được chọn là tốt nhất',
    color: '#f59e0b',
    rarity: 'uncommon',
  },
  '100-votes': {
    id: '100-votes',
    name: '100 Lượt Ủng Hộ',
    emoji: '👍',
    description: 'Nhận được 100 lượt upvote',
    color: '#8b5cf6',
    rarity: 'uncommon',
  },
  expert: {
    id: 'expert',
    name: 'Chuyên Gia',
    emoji: '⭐',
    description: 'Đạt 500 điểm uy tín',
    color: '#f59e0b',
    rarity: 'rare',
  },
  'top-contributor': {
    id: 'top-contributor',
    name: 'Người Đóng Góp Hàng Đầu',
    emoji: '🏅',
    description: 'Top 10 người đóng góp trong tháng',
    color: '#dc2626',
    rarity: 'rare',
  },
  advisor: {
    id: 'advisor',
    name: 'Cố Vấn',
    emoji: '🏆',
    description: 'Đạt 2000 điểm uy tín',
    color: '#dc2626',
    rarity: 'legendary',
  },
  teacher: {
    id: 'teacher',
    name: 'Giảng Viên',
    emoji: '👨‍🏫',
    description: 'Giảng viên được xác minh',
    color: '#6366f1',
    rarity: 'uncommon',
  },
  admin: {
    id: 'admin',
    name: 'Quản Trị Viên',
    emoji: '⚙️',
    description: 'Quản trị viên hệ thống',
    color: '#111827',
    rarity: 'legendary',
  },
};

export function getReputationLevel(points: number): ReputationLevel {
  return (
    REPUTATION_LEVELS.find((l) => points >= l.minPoints && points <= l.maxPoints) ||
    REPUTATION_LEVELS[0]
  );
}

export function getNextLevel(points: number): ReputationLevel | null {
  const currentIndex = REPUTATION_LEVELS.findIndex(
    (l) => points >= l.minPoints && points <= l.maxPoints,
  );
  return currentIndex < REPUTATION_LEVELS.length - 1 ? REPUTATION_LEVELS[currentIndex + 1] : null;
}

export function getProgressToNextLevel(points: number): number {
  const current = getReputationLevel(points);
  const next = getNextLevel(points);
  if (!next) return 100;
  const progress = ((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getBadgesByIds(badgeIds: string[]): Badge[] {
  return badgeIds.map((id) => BADGES[id]).filter(Boolean);
}
