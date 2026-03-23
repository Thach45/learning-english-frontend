import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Flame,
  ArrowRight,
  Info,
  PlayCircle,
} from 'lucide-react';

export interface LearningProgressStats {
  total: number;
  review: number;
  mastered: number;
  needReview: number;
}

const emptyStats: LearningProgressStats = {
  total: 0,
  review: 0,
  mastered: 0,
  needReview: 0,
};

interface LearningProgressCardProps {
  learningStats?: LearningProgressStats;
  onStartLearning?: () => void;
  onStartQuiz?: () => void;
}

export const LearningProgressCard: React.FC<LearningProgressCardProps> = ({
  learningStats = emptyStats,
  onStartLearning = () => {},
  onStartQuiz = () => {},
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePercentage = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const masteryPercentage = calculatePercentage(learningStats.mastered, learningStats.total);
  const studiedPercentage = calculatePercentage(learningStats.review, learningStats.total);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        event.target instanceof Node &&
        !tooltipRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Tiến độ học tập
            </h2>
            <div className="relative shrink-0" ref={tooltipRef}>
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-expanded={showTooltip}
                aria-label="Giải thích chỉ số"
              >
                <Info className="h-5 w-5" />
              </button>
              {showTooltip && (
                <div
                  className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,18rem)] rounded-xl bg-gray-900 p-4 text-sm text-white shadow-xl sm:left-auto sm:right-0 sm:w-72"
                  role="tooltip"
                >
                  <ul className="space-y-2.5">
                    <li className="flex gap-2 text-gray-300">
                      <span className="shrink-0 font-medium text-white">Đã học:</span>
                      <span>Đã xem qua ít nhất 1 lần.</span>
                    </li>
                    <li className="flex gap-2 text-gray-300">
                      <span className="shrink-0 font-medium text-white">Đã thuộc:</span>
                      <span>Trả lời đúng nhiều lần.</span>
                    </li>
                    <li className="flex gap-2 text-gray-300">
                      <span className="shrink-0 font-medium text-white">Cần ôn:</span>
                      <span>Sắp quên theo chu kỳ ôn tập.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Mastery bar */}
        <div className="w-full shrink-0 lg:w-72">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4">
            <div className="mb-2 flex items-end justify-between gap-3">
              <span className="text-sm font-semibold text-gray-600">Mức độ thông thạo</span>
              <span className="text-2xl font-bold tabular-nums leading-none text-gray-900">
                {masteryPercentage}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          iconClass="bg-gray-100 text-gray-600"
          label="Tổng số từ"
          borderHover="hover:border-gray-300"
        >
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900">
            {learningStats.total}
          </span>
        </StatCard>

        <StatCard
          icon={<BrainCircuit className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
          label="Đã học"
          borderHover="hover:border-blue-200"
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900">
              {learningStats.review}
            </span>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {studiedPercentage}%
            </span>
          </div>
        </StatCard>

        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Đã thuộc"
          borderHover="hover:border-emerald-200"
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900">
              {learningStats.mastered}
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {masteryPercentage}%
            </span>
          </div>
        </StatCard>

        <StatCard
          icon={<Flame className="h-5 w-5" />}
          iconClass="bg-rose-50 text-rose-600"
          label="Cần ôn lại"
          borderHover="hover:border-rose-200"
          dot={learningStats.needReview > 0}
        >
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900">
            {learningStats.needReview}
          </span>
        </StatCard>
      </div>

      {/* Banner */}
      {learningStats.needReview > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/90 p-4 sm:items-center sm:p-4">
          <Flame className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 sm:mt-0" />
          <p className="text-sm font-medium leading-relaxed text-rose-900">
            Bạn có{' '}
            <span className="font-bold text-rose-600">{learningStats.needReview} từ</span> đang cần
            ôn. Ôn ngay để nhớ lâu hơn.
          </p>
        </div>
      ) : (
        learningStats.total > 0 &&
        learningStats.review > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:items-center">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 sm:mt-0" />
            <p className="text-sm font-medium leading-relaxed text-gray-700">
              Không có từ nào cần ôn gấp. Tiếp tục duy trì nhịp học nhé!
            </p>
          </div>
        )
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={onStartLearning}
          className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
        >
          <span className="absolute inset-0 translate-y-full bg-white/15 transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <PlayCircle className="relative z-10 h-5 w-5" />
          <span className="relative z-10">Tiếp tục học</span>
        </button>

        <button
          type="button"
          onClick={onStartQuiz}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-indigo-200 hover:bg-indigo-50/80 hover:text-indigo-800"
        >
          <span>Làm bài kiểm tra</span>
          <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
        </button>
      </div>
    </div>
  );
};

function StatCard({
  icon,
  iconClass,
  label,
  borderHover,
  dot,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  borderHover: string;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex min-h-[132px] flex-col rounded-2xl border border-gray-200/90 bg-white p-4 transition hover:shadow-md sm:p-5 ${borderHover}`}
    >
      {dot && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]" />
      )}
      <div className="mb-3 flex items-center gap-3">
        <div className={`shrink-0 rounded-lg p-2 ${iconClass}`}>{icon}</div>
        <span className="min-w-0 text-sm font-medium leading-snug text-gray-500">{label}</span>
      </div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}
