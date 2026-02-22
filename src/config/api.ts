import axios from 'axios';
import { StudySetStats } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to attempt token refresh when 401 is returned
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void; } & { config: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.config.headers.Authorization = `Bearer ${token}`;
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Mark request as retried to prevent infinite loop
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = refreshResponse.data.data;

        // Store new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update default header
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
// --- Custom API for learning ---

export async function fetchStudySetStats(studySetId: string): Promise<StudySetStats> {
  const res = await api.get(`/learning/study-sets/${studySetId}/stats`);
  return res.data.data.data;
}

export async function fetchStudySetVocabulary(studySetId: string, mode: 'practice' | 'review' = 'practice'): Promise<any[]> {
  const res = await api.get(`/learning/study-sets/${studySetId}/vocabulary`, {
    params: { mode }
  });
 
  if (res.data && Array.isArray(res.data.data.data)) return res.data.data.data;
  // Nếu backend trả về mảng luôn
  if (Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export async function updateVocabularyProgress(vocabId: string, result: 'easy' | 'good' | 'hard'): Promise<any> {
  const res = await api.patch(`/learning/vocabulary/${vocabId}/progress`, { result });
  return res.data;
} 

export async function fetchDictionary(word: string, langue: string): Promise<any> {
  const res = await api.get(`/vocabulary/search`, {
    params: { word, langue }
  });
  return res.data;
}

export async function bulkAddVocabularies(studySetId: string, vocabularies: any[]) {
  const res = await api.post(`/study-sets/${studySetId}/vocabularies/bulk`, {
    vocabularies,
  });
  return res.data;
}

// --- Quiz API ---

export interface QuizQuestion {
  id: string;
  vocabularyId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  word: string;
  pronunciation?: string;
  definition?: string;
  example?: string;
}

export interface QuizAnswer {
  vocabularyId: string;
  userAnswer: string;
}

export interface QuizResult {
  score: number;
  correct: number;
  total: number;
  message: string;
  details: Array<{
    vocabularyId: string;
    word: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export async function generateQuiz(
  studySetId: string,
  questionCount?: number,
  mode?: 'multiple_choice' | 'fill_in_the_blank'
): Promise<QuizQuestion[]> {
  const params: any = { studySetId };
  if (questionCount) params.questionCount = questionCount;
  if (mode) params.mode = mode;

  const res = await api.get('/quiz/generate', { params });
  
  return res.data.data.data;
}

export async function submitQuiz(
  studySetId: string,
  answers: QuizAnswer[]
): Promise<QuizResult> {
  const res = await api.post('/quiz/submit', {
    studySetId,
    answers,
  });
  return res.data.data.data;
}

