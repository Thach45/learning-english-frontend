import api from '../config/api';
import {
  StudySet,
  CreateStudySetDto,
  UpdateStudySetDto,
  StudySetQueryParams,
  StudySetsResponse,
} from '../types/studySet';

// ============================================
// Study Set Service - API calls for study sets
// ============================================

const ENDPOINT = '/study-sets';

/**
 * Get all study sets with optional filters
 */
export async function getStudySets(params?: StudySetQueryParams): Promise<StudySetsResponse> {
  const response = await api.get(ENDPOINT, { params });
  
  // Handle different response structures
  const data = response.data?.data || response.data;
  
  return {
    studySets: data?.studySets || data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
  };
}

/**
 * Get popular study sets (public)
 */
export async function getPopularStudySets(): Promise<StudySet[]> {
  const response = await api.get(`${ENDPOINT}/popular`);
  return response.data?.data?.studySets || response.data?.data || [];
}

/**
 * Get single study set by ID
 */
export async function getStudySetById(id: string): Promise<StudySet> {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data?.data?.studySet || response.data?.data;
}

/**
 * Create new study set
 */
export async function createStudySet(data: CreateStudySetDto): Promise<StudySet> {
  const response = await api.post(ENDPOINT, data);
  return response.data?.data?.studySet || response.data?.data;
}

/**
 * Update existing study set
 */
export async function updateStudySet(id: string, data: UpdateStudySetDto): Promise<StudySet> {
  const response = await api.patch(`${ENDPOINT}/${id}`, data);
  return response.data?.data?.studySet || response.data?.data;
}

/**
 * Delete study set
 */
export async function deleteStudySet(id: string): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}

/**
 * Toggle like on study set
 */
export async function toggleLikeStudySet(id: string): Promise<{ liked: boolean; likesCount: number }> {
  const response = await api.post(`${ENDPOINT}/${id}/toggle-like`);
  return response.data?.data || response.data;
}

/**
 * Enroll current user into a study set (from community).
 */
export async function enrollStudySet(id: string): Promise<{ enrolled: boolean }> {
  const response = await api.post(`${ENDPOINT}/${id}/enroll`);
  return response.data?.data || response.data;
}

export async function getEnrolledStudySets(params?: { page?: number; pageSize?: number }): Promise<StudySetsResponse> {
  const response = await api.get(`${ENDPOINT}/enrolled/me`, { params });
  const data = response.data?.data || response.data;
  return {
    studySets: data?.data || data?.studySets || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
  };
}

// Export all as default object for convenience
const studySetService = {
  getAll: getStudySets,
  getEnrolled: getEnrolledStudySets,
  getPopular: getPopularStudySets,
  getById: getStudySetById,
  create: createStudySet,
  update: updateStudySet,
  delete: deleteStudySet,
  toggleLike: toggleLikeStudySet,
  enroll: enrollStudySet,
};

export default studySetService;


