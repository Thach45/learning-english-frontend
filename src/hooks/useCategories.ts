import { useState, useEffect, useCallback } from 'react';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/studySet';
import categoryService from '../services/categoryService';

// ============================================
// useCategories Hook
// ============================================

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CreateCategoryDto) => Promise<Category | null>;
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
     
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (data: CreateCategoryDto): Promise<Category | null> => {
    try {
      const newCategory = await categoryService.create(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      console.error('Error creating category:', err);
      return null;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryDto): Promise<Category | null> => {
    try {
      const updated = await categoryService.update(id, data);
      setCategories(prev => prev.map(cat => cat.id === id ? updated : cat));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
      console.error('Error updating category:', err);
      return null;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
      return false;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

// ============================================
// useCategoryById Hook
// ============================================

interface UseCategoryByIdReturn {
  category: Category | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategoryById(id: string | null): UseCategoryByIdReturn {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getById(id);
      setCategory(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch category');
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
}

export default useCategories;

