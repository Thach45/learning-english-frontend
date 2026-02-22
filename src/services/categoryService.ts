import api from '../config/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/studySet';

// ============================================
// Category Service - API calls for categories
// ============================================

const ENDPOINT = '/categories';

/**
 * Get all categories for current user
 */
export async function getCategories(): Promise<Category[]> {
  const response = await api.get(ENDPOINT);
  return response.data?.data?.data || response.data?.data || [];
}

/**
 * Get single category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data?.data?.category || response.data?.data;
}

/**
 * Create new category
 */
export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  const response = await api.post(ENDPOINT, data);
  return response.data?.data?.category || response.data?.data;
}

/**
 * Update existing category
 */
export async function updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data?.data?.category || response.data?.data;
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}

// Export all as default object for convenience
const categoryService = {
  getAll: getCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
};

export default categoryService;

