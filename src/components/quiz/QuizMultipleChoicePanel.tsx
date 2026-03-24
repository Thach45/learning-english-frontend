import React from 'react';
import { Check, X, Volume2 } from 'lucide-react';
import type { QuizQuestion } from '../../config/api';
import { quizBtnIcon } from './quizUi';

export interface QuizMultipleChoicePanelProps {
  question: QuizQuestion;
  selectedAnswer: string;
  isAnswered: boolean;
  onSelectOption: (option: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

const QuizMultipleChoicePanel: React.FC<QuizMultipleChoicePanelProps> = ({
  question: q,
  selectedAnswer,
  isAnswered,
  onSelectOption,
}) => {
  return (
    <>
      <div className="border-b border-slate-100/80 px-6 py-6 sm:px-8 sm:py-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Chọn nghĩa đúng</p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-800 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
            {q.word}
          </h1>
          {q.pronunciation && (
            <span className="rounded-lg border border-slate-100/80 bg-slate-50/90 px-3 py-1 font-mono text-sm text-slate-500">
              {q.pronunciation}
            </span>
          )}
          <button type="button" className={quizBtnIcon} aria-label="Phát âm">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-6 pb-5 pt-4 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {q.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === q.correctAnswer;
            const showCorrect = isAnswered && isCorrectOption;
            const showWrong = isAnswered && isSelected && !isCorrectOption;

            let ring = 'ring-0';
            let border = 'border-slate-200/80';
            let bg = 'bg-white/50';
            let textColor = 'text-slate-700';

            if (showCorrect) {
              border = 'border-emerald-300/90';
              bg = 'bg-emerald-50/90';
              textColor = 'text-emerald-900';
              ring = 'ring-2 ring-emerald-400/30';
            } else if (showWrong) {
              border = 'border-rose-300/90';
              bg = 'bg-rose-50/90';
              textColor = 'text-rose-900';
              ring = 'ring-2 ring-rose-400/25';
            } else if (isSelected) {
              border = 'border-indigo-300/50';
              bg = 'bg-indigo-50/80';
              textColor = 'text-indigo-900';
              ring = 'ring-2 ring-indigo-400/50';
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectOption(option)}
                disabled={isAnswered}
                className={`relative rounded-2xl border px-4 py-4 text-left shadow-sm transition-all ${border} ${bg} ${ring} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      showCorrect
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : showWrong
                          ? 'bg-rose-500 text-white shadow-sm'
                          : isSelected
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {LABELS[index]}
                  </span>
                  <span className={`font-medium leading-snug ${textColor}`}>{option}</span>
                </div>
                {showCorrect && (
                  <div className="absolute right-3 top-3">
                    <Check className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
                  </div>
                )}
                {showWrong && (
                  <div className="absolute right-3 top-3">
                    <X className="h-5 w-5 text-rose-500" strokeWidth={2.5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default QuizMultipleChoicePanel;
