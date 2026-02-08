import { gamificationApi, GamificationStats, DailyActivity, XPEventsResponse } from '../utils/gamification';

// Service layer over gamificationApi for React Query hooks and pages

export async function fetchGamificationStats(userId?: string): Promise<GamificationStats> {
  return gamificationApi.getStats(userId);
}

export async function fetchDailyActivityStats(
  userId?: string,
  date?: string,
): Promise<DailyActivity> {
  return gamificationApi.getDailyActivityStats(userId, date);
}

export async function fetchXPEvents(
  userId?: string,
  limit?: number,
): Promise<XPEventsResponse> {
  return gamificationApi.getXPEvents(userId, limit);
}

