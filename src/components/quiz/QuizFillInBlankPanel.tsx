import React from 'react';
import type { QuizQuestion } from '../../config/api';

export interface QuizFillInBlankPanelProps {
  question: QuizQuestion;
  selectedAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean;
  onChange: (value: string) => void;
}

const QuizFillInBlankPanel: React.FC<QuizFillInBlankPanelProps> = ({
  question: q,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onChange,
}) => {
  return (
    <>
      <div className="border-b border-slate-100/80 px-6 py-5 sm:px-8">
        <p className="text-sm font-semibold text-slate-700">Nghĩa tiếng Việt → điền từ tiếng Anh</p>
        <p className="mt-1 text-xs text-slate-500">Không gợi ý từ gốc — chỉ dựa vào nghĩa bên dưới.</p>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <p className="mb-6 whitespace-pre-wrap text-lg leading-relaxed text-slate-800">{q.question}</p>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Từ tiếng Anh</label>
        <input
          type="text"
          value={selectedAnswer}
          onChange={(e) => onChange(e.target.value)}
          disabled={isAnswered}
          autoComplete="off"
          spellCheck={false}
          className={`w-full rounded-2xl border px-4 py-3.5 text-lg text-slate-900 shadow-inner transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 ${
            isAnswered
              ? isCorrect
                ? 'border-emerald-300 bg-emerald-50/80'
                : 'border-rose-300 bg-rose-50/80'
              : 'border-slate-200/90 bg-white/80 hover:border-indigo-200'
          }`}
          placeholder="Nhập từ tiếng Anh…"
        />
      </div>
    </>
  );
};

export default QuizFillInBlankPanel;
