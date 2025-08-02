import React, { useState } from 'react';
import { BookOpenIcon, Brain, Star, BookOpen, RotateCcw, Play, HelpCircle } from 'lucide-react';

interface LearningStats {
  total: number;
  review: number;
  mastered: number;
  needReview: number;
}

interface LearningProgressCardProps {
  learningStats: LearningStats;
  onStartLearning: () => void;
  onStartQuiz: () => void;
}

const LearningProgressCard: React.FC<LearningProgressCardProps> = ({
  learningStats,
  onStartLearning,
  onStartQuiz
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
          <div className="relative">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute left-full top-1 mb-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg z-10">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">📚 Total Words</h4>
                    <p className="text-gray-300">Tổng số từ vựng trong study set này</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-300 mb-1">🧠 Studied Words</h4>
                    <p className="text-gray-300">Số từ bạn đã bắt đầu học </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">⭐ Mastered Words</h4>
                    <p className="text-gray-300">Số từ bạn đã thuộc hoàn toàn </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-300 mb-1">🔄 Need Review</h4>
                    <p className="text-gray-300">Số từ cần ôn lại theo phương pháp Spaced Repetition</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-300 mb-1">‼️Chú ý</h4>
                    <p className="text-gray-300">Sẽ ưu tiên việc ôn lại các từ cần ôn lại trước</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Last studied: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Words */}
        <div className="bg-white rounded-xl p-4 border-l-4 border border-blue-500 border-l-blue-500 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <BookOpenIcon className="h-6 w-6 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              TOTAL
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-800">{learningStats.total}</div>
            <div className="text-sm text-blue-600 font-medium">Total Words</div>
          </div>
        </div>

        {/* Studied Words */}
        <div className="bg-white rounded-xl p-4 border-l-4 border border-indigo-500 border-l-indigo-500 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <Brain className="h-6 w-6 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              STUDIED
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-800">{learningStats.review}</div>
            <div className="text-sm text-indigo-600 font-medium">
              {calculatePercentage(learningStats.review, learningStats.total)}% Reviewed
            </div>
          </div>
        </div>

        {/* Mastered Words */}
        <div className="bg-white rounded-xl p-4 border-l-4 border border-purple-500 border-l-purple-500 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6 text-purple-500" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              MASTERED
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-800">{learningStats.mastered}</div>
            <div className="text-sm text-purple-600 font-medium">
              {calculatePercentage(learningStats.mastered, learningStats.total)}% Complete
            </div>
          </div>
        </div>

        {/* Need Review Words */}
        <div className="bg-white rounded-xl p-4 border-l-4 border border-green-500 border-l-green-500 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-6 w-6 text-green-500" />
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              NEED REVIEW
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-800">{learningStats.needReview}</div>
            <div className="text-sm text-green-600 font-medium">Ready to Study</div>
          </div>
        </div>
      </div>

      {/* Need Review Alert */}
      {learningStats.needReview > 0 && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 p-2 rounded-lg">
              <RotateCcw className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-amber-800">
                You have <span className="font-semibold">{learningStats.needReview} words</span> that need review. 
                Keep your memory fresh by reviewing them now!
              </p>
            </div>
            <div className="ml-4">
              <button
                onClick={onStartLearning}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
              >
                Review Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action when no reviews needed */}
      {learningStats.needReview === 0 && learningStats.total > 0 && learningStats.review > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-green-800">
                Great job! You're all caught up. Want to learn some new words?
              </p>
            </div>
            <div className="ml-4">
              <button
                onClick={onStartLearning}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Actions */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <button
          onClick={onStartLearning}
          className="flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Play className="h-5 w-5 mr-2" />
          Study with Flashcards
        </button>
        
        <button
          onClick={onStartQuiz}
          className="flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <Brain className="h-5 w-5 mr-2" />
          Take Quiz
        </button>
      </div>
    </div>
  );
};

export default LearningProgressCard;