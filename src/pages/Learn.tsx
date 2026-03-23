import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Flashcard from '../components/learn/FlashcardView';
import { ReviewVocabulary } from '../types';
import { fetchStudySetVocabulary, updateVocabularyProgress } from '../config/api';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const Learn: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'flashcard'>('flashcard');
  const [vocabularyList, setVocabularyList] = useState<ReviewVocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    learned: 0,
    reviewed: 0,
    correct: 0,
    total: 0
  });
  
  const { studySetId } = useParams<{ studySetId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studyMode = searchParams.get('mode') as 'practice' | 'review' || 'practice';
  
  useEffect(() => {
    const fetchVocabularyList = async () => {
      try {
        setIsLoading(true);
        const response = await fetchStudySetVocabulary(studySetId || '', studyMode);
        setVocabularyList(response);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabularyList();
  }, [studyMode, studySetId]);

  const handleFlashcardResult = (result: 'easy' | 'good' | 'hard') => {
    if(studyMode === 'practice') {
      updateVocabularyProgress(vocabularyList[currentIndex].vocabularyId, result);
    }

    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: result === 'easy' ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleFlashcardNext = () => {
    if (currentIndex < vocabularyList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('select');
      setCurrentIndex(0);
      navigate(`/study-sets/${studySetId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (mode === 'flashcard') {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-gray-50">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <header className="mb-2 flex shrink-0 items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/study-sets/${studySetId}`)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" />
              <span className="hidden sm:inline">Quay lại học phần</span>
            </button>
            <p className="text-right text-xs text-gray-500 sm:text-sm">
              <span className="tabular-nums font-semibold text-gray-800">
                {sessionStats.correct}/{sessionStats.total}
              </span>
              <span className="ml-1 hidden sm:inline">từ đúng</span>
            </p>
          </header>
          {/* min-h-0 + flex-1: thẻ + dock trong viewport, không phải cuộn xuống tìm dock */}
          <div className="flex min-h-0 flex-1 flex-col">
            <Flashcard
              vocabulary={vocabularyList[currentIndex]}
              onNext={handleFlashcardNext}
              onResult={handleFlashcardResult}
              showResult={true}
              currentIndex={currentIndex}
              totalCards={vocabularyList.length}
            />
          </div>
        </div>
      </div>
    );
  }

  // Redirect back to study set if in select mode
  navigate(`/study-sets/${studySetId}`);
  return null;
};

export default Learn;