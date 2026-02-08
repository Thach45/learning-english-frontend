import { useState, useEffect, useCallback, useMemo } from 'react';
import { StudySet, StudySetQueryParams, CreateStudySetDto, UpdateStudySetDto } from '../types/studySet';
import studySetService from '../services/studySetService';

// ============================================
// useStudySets Hook
// ============================================

interface UseStudySetsOptions {
  initialParams?: StudySetQueryParams;
  autoFetch?: boolean;
  mode?: 'all' | 'enrolled';
}

interface UseStudySetsReturn {
  studySets: StudySet[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  // Actions
  refetch: () => Promise<void>;
  setParams: (params: StudySetQueryParams) => void;
  createStudySet: (data: CreateStudySetDto) => Promise<StudySet | null>;
  updateStudySet: (id: string, data: UpdateStudySetDto) => Promise<StudySet | null>;
  deleteStudySet: (id: string) => Promise<boolean>;
  toggleLike: (id: string) => Promise<boolean>;
}

export function useStudySets(options: UseStudySetsOptions = {}): UseStudySetsReturn {
  const { initialParams = {}, autoFetch = true, mode = 'all' } = options;

  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<StudySetQueryParams>(initialParams);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const fetchStudySets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        mode === 'enrolled'
          ? await studySetService.getEnrolled({ page: params.page, pageSize: params.pageSize })
          : await studySetService.getAll(params);
      setStudySets(response.studySets);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch study sets');
      console.error('Error fetching study sets:', err);
    } finally {
      setLoading(false);
    }
  }, [params, mode]);

  useEffect(() => {
    if (autoFetch) {
      fetchStudySets();
    }
  }, [fetchStudySets, autoFetch]);

  const createStudySet = useCallback(async (data: CreateStudySetDto): Promise<StudySet | null> => {
    try {
      const newSet = await studySetService.create(data);
      setStudySets(prev => [newSet, ...prev]);
      return newSet;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create study set');
      console.error('Error creating study set:', err);
      return null;
    }
  }, []);

  const updateStudySet = useCallback(async (id: string, data: UpdateStudySetDto): Promise<StudySet | null> => {
    try {
      const updated = await studySetService.update(id, data);
      setStudySets(prev => prev.map(set => set.id === id ? updated : set));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update study set');
      console.error('Error updating study set:', err);
      return null;
    }
  }, []);

  const deleteStudySet = useCallback(async (id: string): Promise<boolean> => {
    try {
      await studySetService.delete(id);
      setStudySets(prev => prev.filter(set => set.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete study set');
      console.error('Error deleting study set:', err);
      return false;
    }
  }, []);

  const toggleLike = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await studySetService.toggleLike(id);
      setStudySets(prev => prev.map(set => 
        set.id === id 
          ? { ...set, isLiked: result.liked, likesCount: result.likesCount }
          : set
      ));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle like');
      console.error('Error toggling like:', err);
      return false;
    }
  }, []);

  const totalPages = useMemo(() => 
    Math.ceil(pagination.total / pagination.pageSize), 
    [pagination.total, pagination.pageSize]
  );

  return {
    studySets,
    loading,
    error,
    total: pagination.total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages,
    refetch: fetchStudySets,
    setParams,
    createStudySet,
    updateStudySet,
    deleteStudySet,
    toggleLike,
  };
}

// ============================================
// usePopularStudySets Hook
// ============================================

interface UsePopularStudySetsReturn {
  studySets: StudySet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePopularStudySets(): UsePopularStudySetsReturn {
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopular = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studySetService.getPopular();
      setStudySets(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch popular study sets');
      console.error('Error fetching popular study sets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return {
    studySets,
    loading,
    error,
    refetch: fetchPopular,
  };
}

// ============================================
// useStudySetById Hook
// ============================================

interface UseStudySetByIdReturn {
  studySet: StudySet | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStudySetById(id: string | null): UseStudySetByIdReturn {
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudySet = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await studySetService.getById(id);
      setStudySet(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch study set');
      console.error('Error fetching study set:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudySet();
  }, [fetchStudySet]);

  return {
    studySet,
    loading,
    error,
    refetch: fetchStudySet,
  };
}

// ============================================
// useFilteredStudySets Hook - For local filtering
// ============================================

interface UseFilteredStudySetsOptions {
  studySets: StudySet[];
  categoryId?: string;
  searchTerm?: string;
  view?: 'community' | 'library';
}

export function useFilteredStudySets({
  studySets,
  categoryId,
  searchTerm = '',
  view = 'community',
}: UseFilteredStudySetsOptions): StudySet[] {
  return useMemo(() => {
    return studySets.filter(set => {
      // View filter
      const matchesView = view === 'community' ? set.isPublic : true;
      
      // Category filter
      const matchesCategory = !categoryId || categoryId === 'ALL' || set.category?.id === categoryId;
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        set.title.toLowerCase().includes(searchLower) ||
        (set.description?.toLowerCase() || '').includes(searchLower);

      return matchesView && matchesCategory && matchesSearch;
    });
  }, [studySets, categoryId, searchTerm, view]);
}

export default useStudySets;

