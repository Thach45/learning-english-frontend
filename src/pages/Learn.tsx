import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Flashcard from '../components/pageLearn/FlashcardView';

import { ReviewVocabulary } from '../types';
import { fetchStudySetVocabulary, updateVocabularyProgress } from '../utils/api';
import { useParams } from 'react-router-dom';

const Learn: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'flashcard'>('flashcard');
  // Ép kiểu cho mockReviewVocabulary nếu cần
  const [vocabularyList, setVocabularyList] = useState<ReviewVocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    learned: 0,
    reviewed: 0,
    correct: 0,
    total: 0
  });
  // learning/study-sets/:id/vocabulary
  const { studySetId } = useParams<{ studySetId: string }>();
  
  useEffect(() => {
    const fetchVocabularyList = async () => {
      try {
        setIsLoading(true);
        const response = await fetchStudySetVocabulary(studySetId || '');
        console.log(response);
        const data = response;
        setVocabularyList(data);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVocabularyList();
  }, []);
  const handleFlashcardResult = (result: 'easy' | 'good' | 'hard') => {
    updateVocabularyProgress(vocabularyList[currentIndex].vocabularyId, result);
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
      alert(`Session Complete!\nCorrect: ${sessionStats.correct + sessionStats.learned}\nTotal: ${sessionStats.total}`);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setMode('select')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Learning
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Flashcard Mode</h1>
              <p className="text-gray-600">
                Card {currentIndex + 1} of {vocabularyList.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Session Progress</p>
              <p className="font-medium text-gray-900">
                {sessionStats.correct}/{sessionStats.total} correct
              </p>
            </div>
          </div>
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
    );
  }

  // Trang chọn chế độ học (có thể tuỳ chỉnh thêm)
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Center</h1>
      <button
        onClick={() => setMode('flashcard')}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl shadow-lg"
      >
        Start Flashcards
      </button>
    </div>
  );
};

export default Learn;