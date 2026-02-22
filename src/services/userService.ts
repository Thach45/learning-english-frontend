import api from '../config/api';
import type { UserProfile, UpdateProfilePayload } from '../types/user';

const unwrap = <T>(res: any): T =>
  res?.data?.data != null ? res.data.data : res.data;

export async function getMe(): Promise<UserProfile> {
  const res = await api.get('/users/me');
  return unwrap<UserProfile>(res);
}

export async function updateMe(payload: UpdateProfilePayload): Promise<UserProfile> {
  const res = await api.patch('/users/me', payload);
  return unwrap<UserProfile>(res);
}
