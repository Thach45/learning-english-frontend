// ============================================
// Types for Study Sets and Categories
// ============================================

export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudySet {
  id: string;
  title: string;
  description?: string;
  level: Level;
  tags: string[];
  isPublic: boolean;
  likesCount: number;
  learnersCount: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: Author;
  category?: Category;
  categoryId?: string;
  authorId?: string;
  author?: Author;
  vocabularyCount: number;
  progress?: number;
  lastStudied?: string;
  isLiked?: boolean;
}

// ============================================
// Request DTOs
// ============================================

export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CreateStudySetDto {
  title: string;
  description?: string;
  level: Level;
  tags?: string[];
  isPublic?: boolean;
  categoryId?: string;
}

export interface UpdateStudySetDto {
  title?: string;
  description?: string;
  level?: Level;
  tags?: string[];
  isPublic?: boolean;
  categoryId?: string;
}

// ============================================
// Query Params
// ============================================

export interface StudySetQueryParams {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// ============================================
// Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StudySetsResponse {
  studySets: StudySet[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalSets: number;
  totalLearners: number;
  completionRate: number;
}

