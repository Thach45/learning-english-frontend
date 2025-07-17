export interface Vocabulary {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  definition: string;
  example: string;
  imageUrl?: string;
  audioUrl?: string;
  studySetId: string;
  createdAt: Date;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  category: Category;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  vocabularyCount: number;
  createdBy?: string;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  vocabularies?: Vocabulary[];
  author?: { id: string; name: string };
}
export interface StudySetResponse {
  data: StudySet[];
  total: number;
  page: number;
  pageSize: number;
}
export interface UserProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  nextReview?: Date;
  reviewCount: number;
  difficulty: number; // 0-1, for spaced repetition
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Corrected from avatar to avatarUrl
  level: number;
  xp: number;
  streak: number;
  totalWordsLearned: number;
  dailyGoal: number;
  difficultyPreference: string;
  notificationsEnabled: boolean;
  publicProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
  achievements?: Achievement[]; // Made optional as it's not in the login response
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface Quiz {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  vocabulary: Vocabulary;
  difficulty: number;
}

export interface StudySession {
  id: string;
  userId: string;
  vocabularyId: string;
  result: 'correct' | 'incorrect' | 'partial';
  timeSpent: number;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalStudySet: number;
  imageUrl?: string | null;
}

export interface AddVocabulary {
 
  word: string;
  pronunciation?: string;
  meaning: string;
  definition?: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UpdateVocabulary extends AddVocabulary {
  id: string;
}