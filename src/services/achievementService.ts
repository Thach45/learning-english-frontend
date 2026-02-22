import api from "../config/api";
import type {
  Achievement,
  UserAchievement,
  GetAchievementsQuery,
  GetAchievementsResponse,
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from "../types/achievement";

const unwrap = <T>(res: any): T =>
  res?.data?.data?.data ? res.data.data.data : res.data.data;

export async function getAchievementsAdmin(
  query?: GetAchievementsQuery
): Promise<GetAchievementsResponse> {
  const res = await api.get("/achievements/admin", { params: query });
  return unwrap<GetAchievementsResponse>(res);
}

export async function createAchievement(
  payload: CreateAchievementPayload
): Promise<Achievement> {
  const res = await api.post("/achievements", payload);
  return unwrap<Achievement>(res);
}

export async function updateAchievement(
  id: string,
  payload: UpdateAchievementPayload
): Promise<Achievement> {
  const res = await api.put(`/achievements/${id}`, payload);
  return unwrap<Achievement>(res);
}

export async function deleteAchievement(id: string): Promise<Achievement> {
  const res = await api.delete(`/achievements/${id}`);
  return unwrap<Achievement>(res);
}

/** Danh sách achievement đã đạt của user */
export async function getUserAchievements(): Promise<UserAchievement[]> {
  const res = await api.get("/achievements/me");
  return res?.data?.data ?? res.data ?? [];
}

/** Danh sách achievement đang làm dở */
export async function getInProgressAchievements(): Promise<UserAchievement[]> {
  const res = await api.get("/achievements/me/in-progress");
  return res?.data?.data ?? res.data ?? [];
}

/** Gọi backend check và cập nhật achievements */
export async function checkAchievements(): Promise<unknown> {
  const res = await api.post("/achievements/check");
  return res?.data?.data ?? res.data;
}
