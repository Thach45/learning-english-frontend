import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, X, RotateCcw, Volume2 } from 'lucide-react';
import { generateQuiz, QuizQuestion, QuizResult } from '../config/api';

function normalizeQuizAnswer(s: string): string {
  return s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
}

function isAnswerMatch(
  user: string,
  correct: string,
  quizMode: 'multiple_choice' | 'fill_in_the_blank'
): boolean {
  if (quizMode === 'fill_in_the_blank') {
    return normalizeQuizAnswer(user) === normalizeQuizAnswer(correct);
  }
  return user === correct;
}

function getScoreMessage(score: number): string {
  if (score >= 90) return 'Excellent! You mastered this quiz! 🎉';
  if (score >= 70) return 'Great job! Keep practicing! 👍';
  if (score >= 50) return 'Good effort! Review the words you missed. 📚';
  return "Don't give up! Practice makes perfect! 💪";
}

/** Chấm điểm hoàn toàn trên client (không gọi API submit) */
function buildLocalQuizResult(
  questions: QuizQuestion[],
  answers: Array<{ vocabularyId: string; userAnswer: string }>,
  quizMode: 'multiple_choice' | 'fill_in_the_blank'
): QuizResult {
  let correct = 0;
  const details = questions.map((q, i) => {
    const a = answers[i];
    const userAnswer = a?.userAnswer ?? '';
    const ok = isAnswerMatch(userAnswer, q.correctAnswer, quizMode);
    if (ok) correct++;
    return {
      vocabularyId: q.vocabularyId,
      word: q.word,
      isCorrect: ok,
      userAnswer,
      correctAnswer: q.correctAnswer,
    };
  });
  const total = questions.length;
  const score = total > 0 ? (correct / total) * 100 : 0;
  return {
    score: Math.round(score * 100) / 100,
    correct,
    total,
    message: getScoreMessage(score),
    details,
  };
}

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studySetId = searchParams.get('studySetId') || '';
  const quizModeParam = searchParams.get('mode');
  const quizMode = (quizModeParam === 'fill_in_the_blank' ? 'fill_in_the_blank' : 'multiple_choice') as
    | 'multiple_choice'
    | 'fill_in_the_blank';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<{ vocabularyId: string; userAnswer: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!studySetId) {
      navigate('/study-sets');
      return;
    }
    loadQuestions();
  }, [studySetId, quizMode]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await generateQuiz(studySetId, 10, quizMode);
      setQuestions(data);
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz questions');
      navigate(`/study-sets/${studySetId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim() || isAnswered) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = isAnswerMatch(selectedAnswer, currentQ.correctAnswer, quizMode);

    setIsAnswered(true);
    
    const newAnswer = {
      vocabularyId: currentQ.vocabularyId,
      userAnswer: selectedAnswer.trim(),
    };
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        handleCompleteQuiz(updatedAnswers);
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer('');
    setIsAnswered(false);
  };

  const handleFillInputChange = (value: string) => {
    if (isAnswered) return;
    setSelectedAnswer(value);
  };

  const handleCompleteQuiz = (answers?: Array<{ vocabularyId: string; userAnswer: string }>) => {
    const answersToSubmit = answers || userAnswers;
    const quizResult = buildLocalQuizResult(questions, answersToSubmit, quizMode);
    setResult(quizResult);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-indigo-600"></div>
      </div>
    );
  }

  // Result
  if (result) {
    const percentage = result.score;
    const isGood = percentage >= 70;
    
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 mb-2">Your Score</p>
                <div className={`text-6xl font-bold ${isGood ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {percentage.toFixed(0)}%
                </div>
                <p className="text-slate-600 mt-2">
                  {result.correct} of {result.total} questions correct
                </p>
              </div>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                isGood ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                <div className={`text-4xl font-bold ${isGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {result.correct}/{result.total}
                </div>
              </div>
            </div>
            <p className="text-lg text-slate-700 mt-6 pt-6 border-t border-slate-100">
              {result.message}
            </p>
          </div>

          {/* Results Grid */}
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Review Your Answers</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {result.details.map((detail) => (
              <div
                key={detail.vocabularyId}
                className={`p-5 rounded-xl border-2 ${
                  detail.isCorrect 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-slate-900 text-lg">{detail.word}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    detail.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {detail.isCorrect ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <X className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Your answer: <span className={detail.isCorrect ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                    {detail.userAnswer}
                  </span>
                </p>
                {!detail.isCorrect && (
                  <p className="text-sm text-slate-600 mt-1">
                    Correct: <span className="text-emerald-700 font-medium">{detail.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/study-sets/${studySetId}`)}
              className="flex-1 py-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Done
            </button>
            <button
              onClick={() => {
                setResult(null);
                setCurrentQuestion(0);
                setScore(0);
                setUserAnswers([]);
                loadQuestions();
              }}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No questions available</p>
          <button
            onClick={() => navigate(`/study-sets/${studySetId}`)}
            className="text-indigo-600 hover:underline font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;
  const isCorrect =
    isAnswered && isAnswerMatch(selectedAnswer, currentQ.correctAnswer, quizMode);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/study-sets/${studySetId}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          
          {/* Progress */}
          <div className="flex-1 mx-8">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">{currentQuestion + 1}/{questions.length}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-indigo-600">{score} pts</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {quizMode === 'multiple_choice' ? (
            <>
              {/* Question Header */}
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                <p className="text-sm text-slate-500 mb-2">Select the correct meaning</p>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-slate-900">{currentQ.word}</h1>
                  {currentQ.pronunciation && (
                    <span className="text-lg text-slate-400">{currentQ.pronunciation}</span>
                  )}
                  <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <Volume2 className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Options Grid 2x2 */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQ.correctAnswer;
                    const showCorrect = isAnswered && isCorrectOption;
                    const showWrong = isAnswered && isSelected && !isCorrectOption;

                    let borderColor = 'border-slate-200';
                    let bgColor = 'bg-white hover:bg-slate-50';
                    let textColor = 'text-slate-700';

                    if (showCorrect) {
                      borderColor = 'border-emerald-500';
                      bgColor = 'bg-emerald-50';
                      textColor = 'text-emerald-700';
                    } else if (showWrong) {
                      borderColor = 'border-red-500';
                      bgColor = 'bg-red-50';
                      textColor = 'text-red-700';
                    } else if (isSelected) {
                      borderColor = 'border-indigo-500';
                      bgColor = 'bg-indigo-50';
                      textColor = 'text-indigo-700';
                    }

                    const labels = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                        className={`relative p-6 text-left rounded-xl border-2 transition-all ${borderColor} ${bgColor} ${
                          isAnswered ? 'cursor-default' : 'cursor-pointer hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                              showCorrect
                                ? 'bg-emerald-500 text-white'
                                : showWrong
                                  ? 'bg-red-500 text-white'
                                  : isSelected
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {labels[index]}
                          </span>
                          <span className={`font-medium ${textColor} leading-relaxed`}>{option}</span>
                        </div>
                        {showCorrect && (
                          <div className="absolute top-4 right-4">
                            <Check className="w-6 h-6 text-emerald-500" />
                          </div>
                        )}
                        {showWrong && (
                          <div className="absolute top-4 right-4">
                            <X className="w-6 h-6 text-red-500" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">Nghĩa tiếng Việt → điền từ tiếng Anh</p>
                <p className="text-xs text-slate-500">Không gợi ý từ gốc — chỉ dựa vào nghĩa bên dưới.</p>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-800 whitespace-pre-wrap leading-relaxed mb-6">
                  {currentQ.question}
                </p>
                <label className="block text-sm font-medium text-slate-600 mb-2">Từ tiếng Anh</label>
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => handleFillInputChange(e.target.value)}
                  disabled={isAnswered}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-red-400 bg-red-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  placeholder="Type the English word..."
                />
              </div>
            </>
          )}

          {/* Feedback + actions (shared) */}
          <div className={`${quizMode === 'multiple_choice' ? 'px-8 pb-8 -mt-2' : 'px-8 pb-8'} pt-0`}>

            {/* Feedback Panel */}
            {isAnswered && (
              <div 
                className={`mb-6 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                  isCorrect 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}
                style={{ animation: 'slideUp 0.3s ease-out' }}
              >
                {/* Header */}
                <div className={`px-6 py-3 border-b ${
                  isCorrect ? 'bg-emerald-100 border-emerald-200' : 'bg-red-100 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <X className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">Continuing...</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="px-6 py-4 space-y-3">
                  {/* Correct Answer (show if wrong) */}
                  {!isCorrect && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-slate-500 w-28 flex-shrink-0">Correct answer</span>
                      <span className="text-sm font-medium text-emerald-700">{currentQ.correctAnswer}</span>
                    </div>
                  )}
                  
                  {/* Definition */}
                  {currentQ.definition && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-slate-500 w-28 flex-shrink-0">Definition</span>
                      <span className="text-sm text-slate-700">{currentQ.definition}</span>
                    </div>
                  )}
                  
                  {/* Example */}
                  {currentQ.example && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-slate-500 w-28 flex-shrink-0">Example</span>
                      <span className="text-sm text-slate-600 italic">"{currentQ.example}"</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            {!isAnswered && (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={
                  quizMode === 'fill_in_the_blank' ? !selectedAnswer.trim() : !selectedAnswer
                }
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  (quizMode === 'fill_in_the_blank' ? selectedAnswer.trim() : selectedAnswer)
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
