import { useQuery } from '@tanstack/react-query';
import {
  fetchGamificationStats,
  fetchDailyActivityStats,
  fetchXPEvents,
} from '../services/gamificationService';
import { GamificationStats, DailyActivity, XPEventsResponse } from '../utils/gamification';

export const GAMIFICATION_KEYS = {
  stats: (userId?: string) => ['gamification', 'stats', userId] as const,
  dailyActivity: (userId?: string, date?: string) =>
    ['gamification', 'daily-activity-stats', userId, date] as const,
  xpEvents: (userId?: string, limit?: number) =>
    ['gamification', 'xp-events', userId, limit] as const,
};

export function useGamificationStats(userId?: string) {
  return useQuery<GamificationStats>({
    queryKey: GAMIFICATION_KEYS.stats(userId),
    queryFn: () => fetchGamificationStats(userId),
    enabled: !!userId,
  });
}

export function useDailyActivityStats(userId?: string, date?: string) {
  return useQuery<DailyActivity>({
    queryKey: GAMIFICATION_KEYS.dailyActivity(userId, date),
    queryFn: () => fetchDailyActivityStats(userId, date),
    enabled: !!userId,
  });
}

export function useXPEvents(userId?: string, limit: number = 10) {
  return useQuery<XPEventsResponse>({
    queryKey: GAMIFICATION_KEYS.xpEvents(userId, limit),
    queryFn: () => fetchXPEvents(userId, limit),
    enabled: !!userId,
  });
}

