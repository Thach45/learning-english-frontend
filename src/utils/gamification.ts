import apiClient from './api';
export interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  totalWordsLearned: number;
  dailyGoal: number;
  xpForNextLevel: number;
  xpProgress: number;
  isMaxLevel: boolean;
}

export interface DailyActivity {
  wordsLearned: number;
  wordsReviewed: number;
  xpEarned: number;
  streakCount: number;
  dailyGoal?: number;
  totalActivity?: number;
  goalProgress?: number;
  isGoalCompleted?: boolean;
  date: string;
}

export interface XPEvent {
  id: string;
  eventType: string;
  xpAmount: number;
  metadata: any;
  createdAt: string;
}

export interface XPEventsResponse {
  events: XPEvent[];
  total: number;
}

// Gamification API functions
export const gamificationApi = {
  // Get user's gamification stats
  getStats: async (): Promise<GamificationStats> => {
    const response = await apiClient.get('/gamification/stats');
    return response.data.data;
  },

  // Get daily activity
  getDailyActivity: async (date?: string): Promise<DailyActivity> => {
    const params = date ? { date } : {};
    const response = await apiClient.get('/gamification/daily-activity-stats', { params });
    console.log("response", response);
    return response.data.data;
  },

  // Get XP events history
  getXPEvents: async (limit?: number): Promise<XPEventsResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get('/gamification/xp-events', { params });

    return response.data.data;
  },
};

// XP calculation helpers
export const XP_SOURCES = {
  NEW_WORD_LEARNED: 10,
  WORD_REVIEWED: 1,
  STREAK_BONUS: 5,
  DAILY_GOAL_COMPLETED: 50,
  MASTERED_WORD: 25,
} as const;

// Level progression
export const LEVEL_XP_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 4000,
  8: 8000,
  9: 16000,
  10: 32000,
} as const;

// Helper functions
export const calculateLevel = (xp: number): number => {
  for (let level = 10; level >= 1; level--) {
    if (xp >= LEVEL_XP_REQUIREMENTS[level as keyof typeof LEVEL_XP_REQUIREMENTS]) {
      return level;
    }
  }
  return 1;
};

export const calculateXPForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1;
  if (nextLevel > 10) return 0;
  return LEVEL_XP_REQUIREMENTS[nextLevel as keyof typeof LEVEL_XP_REQUIREMENTS];
};

export const calculateXPProgress = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = LEVEL_XP_REQUIREMENTS[currentLevel as keyof typeof LEVEL_XP_REQUIREMENTS];
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  
  if (xpForNextLevel === 0) return 100;
  
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));
};

// Event type labels
export const EVENT_TYPE_LABELS = {
  new_word_learned: 'New Word Learned',
  word_reviewed: 'Word Reviewed',
  mastered_word: 'Word Mastered',
  streak_bonus: 'Streak Bonus',
  daily_goal_completed: 'Daily Goal Completed',
} as const;

// Level titles
export const LEVEL_TITLES = {
  1: 'Beginner',
  2: 'Novice',
  3: 'Apprentice',
  4: 'Student',
  5: 'Scholar',
  6: 'Expert',
  7: 'Master',
  8: 'Grandmaster',
  9: 'Legend',
  10: 'Immortal',
} as const; 