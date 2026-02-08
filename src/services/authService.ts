import api from '../utils/api';
import { User } from '../types';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

type RefreshPayload = { refreshToken: string };
type ForgotPasswordPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};
type SendOtpPayload = { email: string; type: string };

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

const unwrap = <T>(res: any): T => {
  if (res?.data?.data) return res.data.data as T;
  return res.data as T;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post('/auth/login', payload);
  return unwrap<AuthResponse>(res);
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const res = await api.post('/auth/register', payload);
  return unwrap<AuthResponse>(res);
}

export async function refreshToken(
  payload: RefreshPayload,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await api.post('/auth/refresh-token', payload);
  return unwrap(res);
}

export async function logout(payload: RefreshPayload): Promise<{ message: string }> {
  const res = await api.post('/auth/logout', payload);
  return unwrap(res);
}

export async function me(): Promise<User> {
  const res = await api.get('/auth/me');
  return unwrap<User>(res);
}

export async function sendOtp(payload: SendOtpPayload) {
  const res = await api.post('/auth/send-otp', payload);
  return unwrap(res);
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const res = await api.post('/auth/forgot-password', payload);
  return unwrap(res);
}

export async function getUser(id: string) {
  const res = await api.get(`/auth/users/${id}`);
  return unwrap<User>(res);
}
