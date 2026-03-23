import React from 'react';
import { X, RotateCcw, Sparkles, Check } from 'lucide-react';
import type { StudyLearnMode } from './studySetModes';

interface StartLearnModeModalProps {
  open: boolean;
  onClose: () => void;
  selectedMode: StudyLearnMode;
  onSelectMode: (mode: StudyLearnMode) => void;
  onStart: () => void;
}

const options: {
  mode: StudyLearnMode;
  title: string;
  subtitle: string;
  hint: string;
  icon: typeof RotateCcw;
  iconWrap: string;
  ring: string;
}[] = [
  {
    mode: 'review',
    title: 'Ôn tập',
    subtitle: 'Review',
    hint: 'Ưu tiên các từ đang quên, cần ôn theo lịch.',
    icon: RotateCcw,
    iconWrap: 'bg-amber-100 text-amber-700 ring-amber-200/80',
    ring: 'ring-amber-400/60',
  },
  {
    mode: 'practice',
    title: 'Học mới',
    subtitle: 'Practice',
    hint: 'Tập trung vào từ chưa thuộc, mở rộng vốn từ.',
    icon: Sparkles,
    iconWrap: 'bg-indigo-100 text-indigo-700 ring-indigo-200/80',
    ring: 'ring-indigo-400/60',
  },
];

const StartLearnModeModal: React.FC<StartLearnModeModalProps> = ({
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
      aria-labelledby="learn-mode-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200/80">
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-6 pb-5 pt-6 sm:px-8">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Bắt đầu học</p>
          <h3 id="learn-mode-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Chọn chế độ phù hợp
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Mỗi chế độ sắp xếp thứ tự thẻ khác nhau — chọn theo mục tiêu hôm nay của bạn.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 px-6 py-5 sm:px-8">
          {options.map(({ mode, title, subtitle, hint, icon: Icon, iconWrap, ring }) => {
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
                      ? mode === 'review'
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400'
                  }`}
                >
                  <Check className={`h-3.5 w-3.5 ${selected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
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
            Bắt đầu học
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartLearnModeModal;
