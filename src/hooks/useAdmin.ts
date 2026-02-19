import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStats,
  getUsers,
  getUserById,
  updateUserRole as updateUserRoleApi,
  updateUserStatus as updateUserStatusApi,
  getPosts,
  getPostById,
  deletePost as deletePostApi,
  getComments,
  deleteComment as deleteCommentApi,
} from "../services/adminService";
import type {
  GetUsersParams,
  GetPostsParams,
  GetCommentsParams,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "../types/admin";
import { useNotification } from "../context/NotificationContext";

export function useAdminStats(query?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["admin", "stats", query] as const,
    queryFn: () => getStats(query?.from, query?.to),
  });
}

export function useAdminUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ["admin", "users", params] as const,
    queryFn: () => getUsers(params),
  });
}

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "user", id] as const,
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}

export function useAdminPosts(params?: GetPostsParams) {
  return useQuery({
    queryKey: ["admin", "posts", params] as const,
    queryFn: () => getPosts(params),
  });
}

export function useAdminPost(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "post", id] as const,
    queryFn: () => getPostById(id!),
    enabled: !!id,
  });
}

export function useAdminComments(params?: GetCommentsParams) {
  return useQuery({
    queryKey: ["admin", "comments", params] as const,
    queryFn: () => getComments(params),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: { userId: string; payload: UpdateUserRolePayload }) =>
      updateUserRoleApi(userId, payload),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật vai trò",
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: "Không thể cập nhật vai trò",
      });
    },
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: { userId: string; payload: UpdateUserStatusPayload }) =>
      updateUserStatusApi(userId, payload),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật trạng thái",
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: "Không thể cập nhật trạng thái",
      });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "post", postId] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã xoá bài viết",
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: "Không thể xoá bài viết",
      });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "comments"] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã xoá bình luận",
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: "Không thể xoá bình luận",
      });
    },
  });
}
