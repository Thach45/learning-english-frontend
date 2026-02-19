import api from "../utils/api";
import type {
  AdminStats,
  GetUsersResponse,
  AdminUserDetail,
  GetPostsResponse,
  AdminPostDetail,
  GetCommentsResponse,
  GetUsersParams,
  GetPostsParams,
  GetCommentsParams,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "../types/admin";

const unwrap = <T>(res: any): T =>
  res?.data?.data?.data ? res.data.data.data : res.data.data;

export async function getStats(from?: string, to?: string): Promise<AdminStats> {
  const res = await api.get("/dashboard/stats", { params: { from, to } });
  return unwrap<AdminStats>(res);
}

export async function getUsers(
  params?: GetUsersParams
): Promise<GetUsersResponse> {
  const res = await api.get("/dashboard/users", { params });
  return unwrap<GetUsersResponse>(res);
}

export async function getUserById(id: string): Promise<AdminUserDetail> {
  const res = await api.get(`/dashboard/users/${id}`);
  return unwrap<AdminUserDetail>(res);
}

export async function updateUserRole(
  userId: string,
  payload: UpdateUserRolePayload
): Promise<AdminUserDetail> {
  const res = await api.put(`/dashboard/users/${userId}/role`, payload);
  return unwrap<AdminUserDetail>(res);
}

export async function updateUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload
): Promise<{ message: string; user: AdminUserDetail }> {
  const res = await api.put(`/dashboard/users/${userId}/status`, payload);
  return unwrap<{ message: string; user: AdminUserDetail }>(res);
}

export async function getPosts(
  params?: GetPostsParams
): Promise<GetPostsResponse> {
  const res = await api.get("/dashboard/posts", { params });
  return unwrap<GetPostsResponse>(res);
}

export async function getPostById(id: string): Promise<AdminPostDetail> {
  const res = await api.get(`/dashboard/posts/${id}`);
  return unwrap<AdminPostDetail>(res);
}

export async function deletePost(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/dashboard/posts/${id}`);
  return unwrap<{ message: string }>(res);
}

export async function getComments(
  params?: GetCommentsParams
): Promise<GetCommentsResponse> {
  const res = await api.get("/dashboard/comments", { params });
  return unwrap<GetCommentsResponse>(res);
}

export async function deleteComment(
  id: string
): Promise<{ message: string }> {
  const res = await api.delete(`/dashboard/comments/${id}`);
  return unwrap<{ message: string }>(res);
}
