import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, X, RotateCcw, Keyboard, ArrowLeft, Sparkles } from 'lucide-react';
import { generateQuiz, QuizQuestion, QuizResult } from '../config/api';
import QuizMultipleChoicePanel from '../components/quiz/QuizMultipleChoicePanel';
import QuizFillInBlankPanel from '../components/quiz/QuizFillInBlankPanel';

/** Cùng nền ambient + bg-gray-50 như trang Learn (FlashcardView). */
function LearnQuizShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gray-50">
      <div className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="relative min-h-0 flex-1">
          <div
            className="animate-blob motion-reduce:animate-none pointer-events-none absolute left-[10%] top-0 h-[28rem] w-[28rem] rounded-full bg-purple-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:left-0 lg:h-[34rem] lg:w-[34rem] lg:opacity-25"
            aria-hidden
          />
          <div
            className="animate-blob animation-delay-2000 motion-reduce:animate-none pointer-events-none absolute right-[10%] top-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:right-0 lg:h-[34rem] lg:w-[34rem] lg:opacity-25"
            aria-hidden
          />
          <div
            className="animate-blob animation-delay-4000 motion-reduce:animate-none pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-pink-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:bottom-8 lg:opacity-20"
            aria-hidden
          />
          <div className="relative z-10 min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

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

const btnPrimary =
  'inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none';

const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300';

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
  const submitLockRef = useRef(false);

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

  const handleCompleteQuiz = (answers?: Array<{ vocabularyId: string; userAnswer: string }>) => {
    const answersToSubmit = answers || userAnswers;
    const quizResult = buildLocalQuizResult(questions, answersToSubmit, quizMode);
    setResult(quizResult);
  };

  const nextQuestion = () => {
    submitLockRef.current = false;
    setCurrentQuestion((q) => q + 1);
    setSelectedAnswer('');
    setIsAnswered(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim() || isAnswered || submitLockRef.current) return;
    submitLockRef.current = true;

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
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        handleCompleteQuiz(updatedAnswers);
      }
    }, 2000);
  };

  const handleSubmitAnswerRef = useRef(handleSubmitAnswer);
  handleSubmitAnswerRef.current = handleSubmitAnswer;

  const handleFillInputChange = (value: string) => {
    if (isAnswered) return;
    setSelectedAnswer(value);
  };

  /** Enter = gửi kiểm tra (khi đã chọn/điền đáp án). */
  useEffect(() => {
    if (loading || result || questions.length === 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isAnswered) return;
      const canSubmit =
        quizMode === 'fill_in_the_blank' ? !!selectedAnswer.trim() : !!selectedAnswer;
      if (!canSubmit) return;
      e.preventDefault();
      handleSubmitAnswerRef.current();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loading, result, questions.length, isAnswered, selectedAnswer, quizMode]);

  // Loading
  if (loading) {
    return (
      <LearnQuizShell>
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/60 px-10 py-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm font-medium text-slate-600">Đang tải câu hỏi…</p>
          </div>
        </div>
      </LearnQuizShell>
    );
  }

  // Result
  if (result) {
    const percentage = result.score;
    const isGood = percentage >= 70;
    
    return (
      <LearnQuizShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Score hero */}
          <div className="relative mb-10 overflow-hidden rounded-[28px] border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_-20px_rgba(79,70,229,0.25)] backdrop-blur-2xl sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Kết quả</p>
                <div
                  className={`bg-clip-text text-5xl font-black tabular-nums tracking-tight sm:text-6xl ${
                    isGood
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-transparent'
                      : 'bg-gradient-to-br from-amber-500 to-orange-600 text-transparent'
                  }`}
                >
                  {percentage.toFixed(0)}%
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{result.correct}</span> / {result.total} câu đúng
                </p>
              </div>
              <div
                className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-inner ring-4 ring-white/80 ${
                  isGood
                    ? 'from-emerald-400/30 to-teal-500/40 text-emerald-700'
                    : 'from-amber-400/30 to-orange-500/40 text-amber-700'
                }`}
              >
                <span className="text-3xl font-black tabular-nums">
                  {result.correct}/{result.total}
                </span>
              </div>
            </div>
            <p className="mt-8 border-t border-slate-100/80 pt-6 text-center text-base leading-relaxed text-slate-700 sm:text-left">
              {result.message}
            </p>
          </div>

          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            Chi tiết từng câu
          </h2>
          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.details.map((detail) => (
              <div
                key={detail.vocabularyId}
                className={`rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition ${
                  detail.isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/80'
                    : 'border-rose-200/80 bg-rose-50/80'
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900">{detail.word}</span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      detail.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {detail.isCorrect ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <X className="h-3.5 w-3.5" strokeWidth={2.5} />}
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Bạn chọn:{' '}
                  <span className={detail.isCorrect ? 'font-semibold text-emerald-800' : 'font-semibold text-rose-800'}>
                    {detail.userAnswer}
                  </span>
                </p>
                {!detail.isCorrect && (
                  <p className="mt-1.5 text-sm text-slate-600">
                    Đáp án đúng:{' '}
                    <span className="font-semibold text-emerald-700">{detail.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/study-sets/${studySetId}`)}
              className={`${btnSecondary} flex-1 justify-center py-3`}
            >
              Quay lại học phần
            </button>
            <button
              type="button"
              onClick={() => {
                submitLockRef.current = false;
                setResult(null);
                setCurrentQuestion(0);
                setScore(0);
                setUserAnswers([]);
                loadQuestions();
              }}
              className={`${btnPrimary} flex-1 justify-center gap-2 py-3`}
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              Làm lại quiz
            </button>
          </div>
        </div>
      </LearnQuizShell>
    );
  }

  // Empty
  if (questions.length === 0) {
    return (
      <LearnQuizShell>
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-white/70 bg-white/70 px-8 py-10 text-center shadow-xl backdrop-blur-xl">
            <p className="text-slate-600">Chưa có câu hỏi cho bộ học phần này.</p>
            <button
              type="button"
              onClick={() => navigate(`/study-sets/${studySetId}`)}
              className={`${btnSecondary} mt-6 justify-center px-6`}
            >
              Quay lại
            </button>
          </div>
        </div>
      </LearnQuizShell>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;
  const isCorrect =
    isAnswered && isAnswerMatch(selectedAnswer, currentQ.correctAnswer, quizMode);

  return (
    <LearnQuizShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-4 lg:max-w-4xl">
        {/* Top: back + progress (giống vibe Learn) */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(`/study-sets/${studySetId}`)}
            className="flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="hidden sm:inline">Quay lại học phần</span>
            <span className="sm:hidden">Quay lại</span>
          </button>

          <div className="flex w-full min-w-0 flex-1 flex-col gap-2 sm:max-w-xl">
            <div className="flex w-full items-center gap-3 rounded-full border border-white/80 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-md sm:px-5">
              <Sparkles className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-sm font-bold text-transparent">
                Câu {currentQuestion + 1} / {questions.length}
              </span>
              <div className="h-1.5 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-slate-200/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums text-slate-500">{progress}%</span>
            </div>
            <p className="text-center text-xs text-slate-500 sm:text-right">
              <span className="font-semibold text-indigo-600">{score}</span> điểm
            </p>
          </div>
        </div>

        {/* Question Card — glass + accent */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
          {quizMode === 'multiple_choice' ? (
            <QuizMultipleChoicePanel
              question={currentQ}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              onSelectOption={handleAnswerSelect}
            />
          ) : (
            <QuizFillInBlankPanel
              question={currentQ}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              onChange={handleFillInputChange}
            />
          )}

          {/* Feedback + actions */}
          <div className={`${quizMode === 'multiple_choice' ? 'px-6 pb-6 sm:px-8 sm:pb-8' : 'px-6 pb-6 sm:px-8 sm:pb-8'} -mt-1 pt-0`}>
            {isAnswered && (
              <div
                className={`mb-5 overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 ${
                  isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/90'
                    : 'border-rose-200/80 bg-rose-50/90'
                }`}
                style={{ animation: 'slideUp 0.3s ease-out' }}
              >
                <div
                  className={`flex items-center justify-between border-b px-4 py-3 sm:px-5 ${
                    isCorrect ? 'border-emerald-200/60 bg-emerald-100/50' : 'border-rose-200/60 bg-rose-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isCorrect ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <X className="h-4 w-4" strokeWidth={2.5} />}
                    </div>
                    <span className={`font-bold ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {isCorrect ? 'Chính xác!' : 'Chưa đúng'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Đang chuyển câu…</span>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
                  {!isCorrect && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Đáp án đúng</span>
                      <span className="font-semibold text-emerald-800">{currentQ.correctAnswer}</span>
                    </div>
                  )}
                  {currentQ.definition && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-24">
                        Nghĩa
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700">{currentQ.definition}</span>
                    </div>
                  )}
                  {currentQ.example && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-24">
                        Ví dụ
                      </span>
                      <span className="text-sm italic leading-relaxed text-slate-600">"{currentQ.example}"</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isAnswered && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={
                    quizMode === 'fill_in_the_blank' ? !selectedAnswer.trim() : !selectedAnswer
                  }
                  className={`${btnPrimary} w-full justify-center py-3.5 text-base disabled:pointer-events-none`}
                >
                  Kiểm tra đáp án
                </button>
                <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                  <Keyboard className="h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden />
                  <kbd className="rounded-md border border-slate-200/80 bg-white/80 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-600 shadow-sm">
                    Enter
                  </kbd>
                  <span>để gửi nhanh</span>
                </p>
              </div>
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
    </LearnQuizShell>
  );
};

export default QuizPage;
