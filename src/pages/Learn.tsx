import React, { useEffect, useState } from 'react';
import { ArrowLeft, Book, Clock, RotateCcw } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/study-sets/${studySetId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Study Set
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {studyMode === 'practice' ? 'Practice Mode' : 'Review Mode'}
              </h1>
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

  // Redirect back to study set if in select mode
  navigate(`/study-sets/${studySetId}`);
  return null;
};

export default Learn;