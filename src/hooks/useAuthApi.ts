import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  login as loginApi,
  register as registerApi,
  me as meApi,
  refreshToken as refreshTokenApi,
  logout as logoutApi,
  forgotPassword as forgotPasswordApi,
  sendOtp as sendOtpApi,
  getUser,
} from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

export function useMe(enabled = false) {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: meApi,
    enabled,
  });
}

export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
      queryClient.setQueryData<User>(AUTH_KEYS.me, data.user);
    },
  });
}

export function useRegister() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
      queryClient.setQueryData<User>(AUTH_KEYS.me, data.user);
    },
  });
}

export function useRefreshToken() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: refreshTokenApi,
    onSuccess: (data) => {
      // Only update access/refresh token; user stays the same
      login(data.accessToken, data.refreshToken, null as unknown as User);
    },
  });
}

export function useLogout() {
  const { logout, refreshToken, accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi({ refreshToken: refreshToken || '' }),
    onSuccess: () => {
      logout();
      queryClient.removeQueries({ queryKey: AUTH_KEYS.me });
    },
    onError: () => {
      // Even if API fails, clear local session
      logout();
      queryClient.removeQueries({ queryKey: AUTH_KEYS.me });
    },
    meta: { requiresAuth: !!accessToken },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtpApi,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
}
export function useGetUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  });
}

