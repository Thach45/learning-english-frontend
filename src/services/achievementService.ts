import api from "../utils/api";
import type {
  Achievement,
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
