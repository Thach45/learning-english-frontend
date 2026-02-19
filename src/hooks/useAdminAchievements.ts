import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAchievementsAdmin,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../services/achievementService";
import type {
  GetAchievementsQuery,
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from "../types/achievement";
import { useNotification } from "../context/NotificationContext";

export function useAdminAchievements(query?: GetAchievementsQuery) {
  return useQuery({
    queryKey: ["admin", "achievements", query] as const,
    queryFn: () => getAchievementsAdmin(query),
  });
}

export function useCreateAchievement() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: createAchievement,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "achievements"] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã tạo thành tựu",
      });
    },
    onError: (err: any) => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: err?.response?.data?.message ?? "Không thể tạo thành tựu",
      });
    },
  });
}

export function useUpdateAchievement() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAchievementPayload }) =>
      updateAchievement(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "achievements"] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật thành tựu",
      });
    },
    onError: (err: any) => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: err?.response?.data?.message ?? "Không thể cập nhật thành tựu",
      });
    },
  });
}

export function useDeleteAchievement() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "achievements"] });
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã xóa thành tựu",
      });
    },
    onError: (err: any) => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: err?.response?.data?.message ?? "Không thể xóa thành tựu",
      });
    },
  });
}
