import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Brain, Target, Shuffle } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import { mockVocabulary, mockStudySets } from '../data/mockData';
import { Vocabulary } from '../types';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [mode, setMode] = useState<'select' | 'flashcard' | 'quiz'>('select');
  const [quizType, setQuizType] = useState<'multiple-choice' | 'fill-blank' | 'matching' | 'mixed'>('mixed');
  const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>(mockVocabulary);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    learned: 0,
    reviewed: 0,
    correct: 0,
    total: 0
  });

  const { updateVocabularyAfterStudy, getVocabularyForReview } = useSpacedRepetition();

  useEffect(() => {
    // Get parameters from URL
    const studySetId = searchParams.get('studySetId');
    const category = searchParams.get('category');
    let filteredVocab = mockVocabulary;
    
    if (studySetId) {
      // Filter by study set
      filteredVocab = mockVocabulary.filter(vocab => vocab.studySetId === studySetId);
    } else if (category) {
      // Filter by category (legacy support)
      const studySetsInCategory = mockStudySets.filter(set => set.category === category);
      const studySetIds = studySetsInCategory.map(set => set.id);
      filteredVocab = mockVocabulary.filter(vocab => vocab.category === category);
    }
    
    // Get vocabulary that needs review
    const reviewList = getVocabularyForReview(filteredVocab);
    setVocabularyList(reviewList.length > 0 ? reviewList : filteredVocab);
    
    // Auto-start based on URL path
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('flashcards')) {
      setMode('flashcard');
    } else if (pathParts.includes('quiz')) {
      setMode('quiz');
    }
  }, [searchParams, location.pathname]);

  const handleFlashcardResult = (result: 'correct' | 'incorrect' | 'partial') => {
    const currentVocab = vocabularyList[currentIndex];
    const updatedVocab = updateVocabularyAfterStudy(currentVocab, result);
    
    // Update vocabulary in the list
    const newList = [...vocabularyList];
    newList[currentIndex] = updatedVocab;
    setVocabularyList(newList);

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: result === 'correct' ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleFlashcardNext = () => {
    if (currentIndex < vocabularyList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      setMode('select');
      setCurrentIndex(0);
      showSessionComplete();
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setSessionStats(prev => ({
      ...prev,
      learned: prev.learned + score,
      correct: prev.correct + score,
      total: prev.total + totalQuestions
    }));
    
    setMode('select');
    showSessionComplete();
  };

  const showSessionComplete = () => {
    // This would show a completion modal/page
    alert(`Session Complete!\nCorrect: ${sessionStats.correct + sessionStats.learned}\nTotal: ${sessionStats.total}`);
  };

  const startFlashcards = () => {
    setMode('flashcard');
    setCurrentIndex(0);
  };

  const startQuiz = (type: typeof quizType) => {
    setQuizType(type);
    setMode('quiz');
  };

  if (mode === 'flashcard') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
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
          />
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setMode('select')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Learning
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">Quiz Mode</h1>
            <div></div>
          </div>

          <Quiz
            vocabularyList={vocabularyList}
            onComplete={handleQuizComplete}
            quizType={quizType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              const studySetId = searchParams.get('studySetId');
              if (studySetId) {
                navigate(`/study-sets/${studySetId}`);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {searchParams.get('studySetId') ? 'Back to Study Set' : 'Back to Dashboard'}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Learning Center</h1>
          <div></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{vocabularyList.length}</div>
              <div className="text-sm text-gray-600">Words Available</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessionStats.learned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionStats.reviewed}</div>
              <div className="text-sm text-gray-600">Words Reviewed</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Learning Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Flashcard Mode */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flashcard Mode</h3>
              <p className="text-gray-600">
                Learn new words with interactive flashcards. Perfect for memorization and retention.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Interactive word cards with images
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Audio pronunciation guide
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Spaced repetition algorithm
              </div>
            </div>

            <button
              onClick={startFlashcards}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Start Flashcards
            </button>
          </div>

          {/* Quiz Mode */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Mode</h3>
              <p className="text-gray-600">
                Test your knowledge with various quiz types. Challenge yourself and track progress.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => startQuiz('multiple-choice')}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <span className="font-medium text-gray-700">Multiple Choice</span>
                <Target className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => startQuiz('fill-blank')}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <span className="font-medium text-gray-700">Fill in the Blank</span>
                <Target className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => startQuiz('mixed')}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <span className="font-medium text-gray-700">Mixed Quiz</span>
                <Shuffle className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">💡 Learning Tips</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Spaced Repetition:</strong> Words you find difficult will appear more frequently until you master them.
            </div>
            <div>
              <strong>Regular Practice:</strong> Study for 15-20 minutes daily for best results.
            </div>
            <div>
              <strong>Use Audio:</strong> Listen to pronunciation to improve your speaking skills.
            </div>
            <div>
              <strong>Context Learning:</strong> Pay attention to example sentences to understand usage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;