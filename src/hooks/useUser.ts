import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe } from '../services/userService';
import type { UpdateProfilePayload } from '../types/user';
import { useNotification } from '../context/NotificationContext';

/** Lấy thông tin cá nhân user đang đăng nhập (GET /users/me). */
export function useMe(enabled = true) {
  return useQuery({
    queryKey: ['user', 'me'] as const,
    queryFn: getMe,
    enabled,
  });
}

/** Cập nhật thông tin cá nhân (PATCH /users/me). */
export function useUpdateProfile() {
  const qc = useQueryClient();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMe(payload),
    onSuccess: (data) => {
      qc.setQueryData(['user', 'me'], data);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      addNotification({
        type: 'success',
        title: 'Thành công',
        message: 'Đã cập nhật thông tin cá nhân',
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err?.response?.data?.message ?? 'Không thể cập nhật',
      });
    },
  });
}
