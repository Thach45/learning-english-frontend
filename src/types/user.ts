export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  level: number;
  xp: number;
  streak: number;
  totalWordsLearned: number;
  dailyGoal: number;
  difficultyPreference: string;
  notificationsEnabled: boolean;
  publicProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  dailyGoal?: number;
  difficultyPreference?: string;
  notificationsEnabled?: boolean;
  publicProfile?: boolean;
}
