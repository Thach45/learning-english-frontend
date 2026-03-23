import React from 'react';
import { X, ListChecks, PenLine, Check } from 'lucide-react';
import type { QuizMode } from './studySetModes';

interface StartQuizModeModalProps {
  open: boolean;
  onClose: () => void;
  selectedMode: QuizMode;
  onSelectMode: (mode: QuizMode) => void;
  onStart: () => void;
}

const options: {
  mode: QuizMode;
  title: string;
  subtitle: string;
  hint: string;
  icon: typeof ListChecks;
  iconWrap: string;
  ring: string;
  check: string;
}[] = [
  {
    mode: 'multiple_choice',
    title: 'Trắc nghiệm',
    subtitle: 'Multiple choice',
    hint: 'Chọn một đáp án đúng trong các lựa chọn sẵn — phù hợp khi muốn luyện nhận diện nhanh.',
    icon: ListChecks,
    iconWrap: 'bg-blue-100 text-blue-700 ring-blue-200/80',
    ring: 'ring-blue-400/60',
    check: 'border-blue-600 bg-blue-600',
  },
  {
    mode: 'fill_in_the_blank',
    title: 'Điền từ',
    subtitle: 'Fill in the blank',
    hint: 'Tự gõ từ hoặc cụm để điền chỗ trống — luyện ghi nhớ và chính tả tốt hơn.',
    icon: PenLine,
    iconWrap: 'bg-emerald-100 text-emerald-700 ring-emerald-200/80',
    ring: 'ring-emerald-400/60',
    check: 'border-emerald-600 bg-emerald-600',
  },
];

const StartQuizModeModal: React.FC<StartQuizModeModalProps> = ({
  open,
  onClose,
  selectedMode,
  onSelectMode,
  onStart,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-mode-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200/80">
        <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-6 pb-5 pt-6 sm:px-8">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Làm quiz</p>
          <h3 id="quiz-mode-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Chọn dạng câu hỏi
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Mỗi dạng đánh giá kỹ năng khác nhau — chọn theo cách bạn muốn luyện hôm nay.
          </p>
        </div>

        <div className="space-y-3 px-6 py-5 sm:px-8">
          {options.map(({ mode, title, subtitle, hint, icon: Icon, iconWrap, ring, check }) => {
            const selected = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onSelectMode(mode)}
                className={`group relative flex w-full gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                  selected
                    ? `border-transparent bg-white shadow-md ring-2 ${ring} ring-offset-2 ring-offset-white`
                    : 'border-slate-200/90 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-2 ring-inset ${iconWrap}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{title}</span>
                    <span className="text-xs font-medium text-slate-400">{subtitle}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{hint}</p>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    selected
                      ? `${check} text-white`
                      : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400'
                  }`}
                >
                  <Check className={`h-3.5 w-3.5 ${selected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <button
            type="button"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200/80 hover:text-slate-900"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={onStart}
          >
            Bắt đầu quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartQuizModeModal;
