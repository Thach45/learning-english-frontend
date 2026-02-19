export enum AchievementType {
  TOTAL_WORDS_LEARNED = 'TOTAL_WORDS_LEARNED',
  STREAK_DAYS = 'STREAK_DAYS',
  LEVEL_REACHED = 'LEVEL_REACHED',
  TOTAL_WORDS_REVIEWED = 'TOTAL_WORDS_REVIEWED'
}

export enum AchievementRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  targetValue: number;
  duration?: number;
  rarity: AchievementRarity;
  icon?: string;
  isActive: boolean;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievement: Achievement;
  progress: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface GetAchievementsQuery {
  page?: number;
  pageSize?: number;
  type?: AchievementType;
  rarity?: AchievementRarity;
  isActive?: boolean;
}

export interface GetAchievementsResponse {
  items: Achievement[];
  pagination: AchievementPagination;
}

export interface CreateAchievementPayload {
  title: string;
  description: string;
  type: AchievementType;
  targetValue: number;
  duration?: number;
  rarity: AchievementRarity;
  icon?: string;
  xpReward?: number;
}

export interface UpdateAchievementPayload {
  title?: string;
  description?: string;
  targetValue?: number;
  duration?: number;
  rarity?: AchievementRarity;
  icon?: string;
  isActive?: boolean;
  xpReward?: number;
}