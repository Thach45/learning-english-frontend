import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Volume2,
  BookOpen,
  Sparkles,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Star,
  Keyboard,
} from 'lucide-react';
import { ReviewVocabulary, CefrLevel } from '../../types';

export type DifficultyId = 'easy' | 'medium' | 'hard';

interface FlashcardProps {
  vocabulary: ReviewVocabulary;
  onNext: () => void;
  onResult: (result: 'easy' | 'good' | 'hard') => void;
  showResult?: boolean;
  currentIndex?: number;
  totalCards?: number;
}

const RESULT_MAP: Record<DifficultyId, 'easy' | 'good' | 'hard'> = {
  easy: 'easy',
  medium: 'good',
  hard: 'hard',
};

const FEEDBACK_COPY: Record<
  DifficultyId,
  { title: string; subtitle: string }
> = {
  hard: { title: 'Đã ghi nhận: Khó', subtitle: 'Sẽ ôn lại thẻ này sớm hơn.' },
  medium: { title: 'Đã ghi nhận: Vừa', subtitle: 'Tiếp tục duy trì nhịp ôn nhé.' },
  easy: { title: 'Đã ghi nhận: Dễ', subtitle: 'Tuyệt — thẻ sẽ xuất hiện ít hơn.' },
};

const FEEDBACK_PARTICLE_COLORS: Record<DifficultyId, string[]> = {
  hard: ['#fb7185', '#f43f5e', '#fda4af', '#e11d48'],
  medium: ['#fbbf24', '#f59e0b', '#fcd34d', '#d97706'],
  easy: ['#34d399', '#10b981', '#6ee7b7', '#059669'],
};

const FEEDBACK_RIPPLE: Record<DifficultyId, string> = {
  hard: 'border-rose-400/55',
  medium: 'border-amber-400/55',
  easy: 'border-emerald-400/55',
};

function FeedbackParticles({ difficulty }: { difficulty: DifficultyId }) {
  const particles = useMemo(() => {
    const n = 32;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 + (i % 3) * 0.08;
      const dist = 72 + (i % 8) * 11;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        delay: i * 0.012,
        size: 5 + (i % 5),
        color: FEEDBACK_PARTICLE_COLORS[difficulty][i % 4],
      };
    });
  }, [difficulty]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="animate-feedback-particle absolute rounded-full motion-reduce:hidden"
          style={
            {
              left: `calc(50% - ${p.size / 2}px)`,
              top: `calc(44% - ${p.size / 2}px)`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${Math.max(4, p.size)}px ${p.color}`,
              animationDelay: `${p.delay}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function cefrBadgeClass(level?: CefrLevel): string {
  switch (level) {
    case CefrLevel.A1:
      return 'bg-green-100 text-green-800 border-green-200';
    case CefrLevel.A2:
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case CefrLevel.B1:
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case CefrLevel.B2:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case CefrLevel.C1:
      return 'bg-violet-100 text-violet-800 border-violet-200';
    case CefrLevel.C2:
      return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

const difficultyConfigs: Array<{
  id: DifficultyId;
  label: string;
  hint: string;
  emoji: string;
  glow: string;
  bg: string;
  text: string;
  ring: string;
}> = [
  {
    id: 'hard',
    label: 'Khó',
    hint: '1',
    emoji: '🔥',
    glow: 'shadow-rose-500/40',
    bg: 'bg-rose-500',
    text: 'text-rose-600',
    ring: 'ring-rose-200',
  },
  {
    id: 'medium',
    label: 'Vừa',
    hint: '2',
    emoji: '🤔',
    glow: 'shadow-amber-500/40',
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    ring: 'ring-amber-200',
  },
  {
    id: 'easy',
    label: 'Dễ',
    hint: '3',
    emoji: '✨',
    glow: 'shadow-emerald-500/40',
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
];

export default function Flashcard({
  vocabulary,
  onNext,
  onResult,
  currentIndex = 0,
  totalCards = 1,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const progress =
    totalCards > 0 ? Math.min(100, Math.round(((currentIndex + 1) / totalCards) * 100)) : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFlip = useCallback(() => {
    if (selectedDifficulty) return;
    setIsFlipped((f) => !f);
    setShowDefinition(false);
  }, [selectedDifficulty]);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!vocabulary.audioUrl || isPlayingAudio) return;
    setIsPlayingAudio(true);
    const audio = new Audio(vocabulary.audioUrl);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    void audio.play().catch(() => setIsPlayingAudio(false));
  };

  const handleDifficultySelect = useCallback(
    (difficulty: DifficultyId) => {
      if (selectedDifficulty) return;
      setSelectedDifficulty(difficulty);
      onResult(RESULT_MAP[difficulty]);
      window.setTimeout(() => {
        setIsFlipped(false);
        setShowDefinition(false);
        setSelectedDifficulty(null);
        setIsPlayingAudio(false);
        onNext();
      }, 1200);
    },
    [onNext, onResult, selectedDifficulty]
  );

  /* Reset khi chuyển từ vựng */
  useEffect(() => {
    setIsFlipped(false);
    setShowDefinition(false);
    setSelectedDifficulty(null);
    setIsPlayingAudio(false);
  }, [vocabulary.vocabularyId]);

  /* Keyboard: Space = flip, 1/2/3 = difficulty when back */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;

      if (e.code === 'Space') {
        if (!selectedDifficulty) {
          e.preventDefault();
          handleFlip();
        }
        return;
      }

      if (isFlipped && !selectedDifficulty) {
        if (e.key === '1') {
          e.preventDefault();
          handleDifficultySelect('hard');
        } else if (e.key === '2') {
          e.preventDefault();
          handleDifficultySelect('medium');
        } else if (e.key === '3') {
          e.preventDefault();
          handleDifficultySelect('easy');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFlipped, selectedDifficulty, handleFlip, handleDifficultySelect]);

  /* Swipe: horizontal on card to flip */
  const onTouchStart = (e: React.TouchEvent) => {
    if (selectedDifficulty) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || selectedDifficulty) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    handleFlip();
  };

  const cfgForSelected = selectedDifficulty
    ? difficultyConfigs.find((c) => c.id === selectedDifficulty)
    : null;
  const feedback = selectedDifficulty ? FEEDBACK_COPY[selectedDifficulty] : null;

  const dockVisible = isFlipped && !selectedDifficulty;

  return (
    <div className="relative mx-auto flex  min-h-0 w-full max-w-md flex-1 flex-col font-sans lg:max-w-none lg:px-4">
      {/* Ambient orbs — desktop: rộng hơn, nhẹ hơn */}
      <div
        className="animate-blob motion-reduce:animate-none absolute left-[10%] top-0 h-[28rem] w-[28rem] rounded-full bg-purple-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:left-0 lg:h-[34rem] lg:w-[34rem] lg:opacity-25"
        aria-hidden
      />
      <div
        className="animate-blob animation-delay-2000 motion-reduce:animate-none absolute right-[10%] top-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:right-0 lg:h-[34rem] lg:w-[34rem] lg:opacity-25"
        aria-hidden
      />
      <div
        className="animate-blob animation-delay-4000 motion-reduce:animate-none absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-pink-400 opacity-35 mix-blend-multiply blur-[100px] filter lg:bottom-8 lg:opacity-20"
        aria-hidden
      />

      {/* Cột: progress (cố định) + thẻ (co theo viewport) + dock (ngay dưới thẻ, không fixed) */}
      <div className="relative z-10 flex  min-h-0 w-full min-w-0 flex-1 flex-col items-center lg:mx-auto lg:w-full lg:max-w-4xl">
        {/* Progress */}
        <div className="mb-4 flex w-full max-w-[360px] shrink-0 items-center gap-3 rounded-full border border-white/80 bg-white/60 px-5 py-2.5 shadow-sm backdrop-blur-md sm:mb-5 lg:max-w-2xl">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-sm font-bold text-transparent">
            Thẻ {currentIndex + 1} / {totalCards}
          </span>
          <div className="h-1.5 min-w-[5rem] flex-1 overflow-hidden rounded-full bg-slate-200/50 lg:min-w-[8rem]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-slate-500">{progress}%</span>
        </div>

        {/* Shortcuts — chỉ mobile / tablet */}
        <button
          type="button"
          onClick={() => setShowShortcuts((v) => !v)}
          className="relative z-10 mb-3 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur-sm transition hover:bg-white/70 lg:hidden"
          aria-expanded={showShortcuts}
        >
          <Keyboard className="h-3.5 w-3.5" />
          Phím tắt
        </button>
        {showShortcuts && (
          <div className="relative z-10 mb-4 w-full max-w-[360px] rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-left text-[11px] text-slate-600 shadow-md backdrop-blur-md lg:hidden">
            <p>
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono">Space</kbd> — lật thẻ
            </p>
            <p className="mt-1.5">
              Mặt sau: <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono">1</kbd> Khó ·{' '}
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono">2</kbd> Vừa ·{' '}
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono">3</kbd> Dễ
            </p>
            <p className="mt-1.5 text-slate-500">Vuốt ngang trên thẻ để lật.</p>
          </div>
        )}

        {/* 3D card — ngắn hơn một chút, vẫn theo viewport */}
        <div
          className="group relative z-10 w-full max-w-[360px] shrink-0 cursor-pointer animate-float-card motion-reduce:animate-none lg:max-w-[560px] lg:animate-none xl:max-w-[600px]"
          style={{
            perspective: '1600px',
            height: 'min(520px, max(280px, calc(100dvh - 12rem)))',
          }}
          onClick={handleFlip}
          onMouseMove={handleMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlip();
            }
          }}
          aria-label={isFlipped ? 'Xem mặt trước' : 'Lật xem nghĩa'}
        >
        <div
          className="relative h-full w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg) scale(1.03)' : 'rotateY(0deg) scale(1)',
          }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-2xl lg:rounded-[36px] lg:p-10"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(520px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.55), transparent 42%)`,
              }}
            />
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                {vocabulary.partOfSpeech && (
                  <span className="rounded-full border border-indigo-100 bg-indigo-50/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                    {vocabulary.partOfSpeech}
                  </span>
                )}
                {vocabulary.cefrLevel && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${cefrBadgeClass(vocabulary.cefrLevel)}`}
                  >
                    <Star className="h-3 w-3" />
                    {vocabulary.cefrLevel}
                  </span>
                )}
              </div>

              {vocabulary.imageUrl && (
                <div className="mb-4 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white/80">
                  <img
                    src={vocabulary.imageUrl}
                    alt=""
                    className="h-28 w-28 object-cover sm:h-32 sm:w-32 lg:h-40 lg:w-40"
                  />
                </div>
              )}

              <h2 className="mb-3 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-800 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent drop-shadow-sm sm:text-5xl lg:text-6xl">
                {vocabulary.word}
              </h2>

              {vocabulary.pronunciation && (
                <span className="mb-8 rounded-lg border border-slate-100/80 bg-slate-50 px-4 py-1 font-mono text-base font-medium text-slate-500 sm:text-lg">
                  {vocabulary.pronunciation}
                </span>
              )}

              {vocabulary.audioUrl && (
                <div className="relative">
                  {isPlayingAudio && (
                    <>
                      <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-indigo-400 opacity-20" />
                      <div className="absolute inset-0 scale-125 animate-pulse rounded-full bg-purple-400 opacity-20" />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handlePlayAudio}
                    className={`relative z-10 rounded-full p-5 shadow-xl transition-all duration-300 ${
                      isPlayingAudio
                        ? 'scale-110 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/40'
                        : 'bg-white text-indigo-500 hover:scale-110 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-indigo-500/30'
                    }`}
                    aria-label="Phát âm"
                  >
                    <Volume2 className="h-7 w-7" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-auto w-full text-center">
              <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-semibold text-slate-400">
                <span className="lg:hidden">Chạm để xem nghĩa</span>
                <span className="hidden lg:inline">Click hoặc Space để lật</span>
                <ChevronRight className="h-4 w-4 animate-bounce-x motion-reduce:animate-none lg:inline" />
              </span>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-white bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-2xl lg:rounded-[36px]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedDifficulty && cfgForSelected && feedback && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden bg-white/[0.97] backdrop-blur-[2px]">
                <FeedbackParticles difficulty={selectedDifficulty} />
                <div
                  className="pointer-events-none absolute inset-0 bg-[length:220%_100%] opacity-35 motion-reduce:opacity-0 motion-reduce:animate-none animate-feedback-shimmer"
                  style={{
                    backgroundImage:
                      'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.92) 50%, transparent 62%)',
                  }}
                />
                <div className={`absolute inset-0 opacity-[0.09] ${cfgForSelected.bg}`} />
                <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 motion-reduce:hidden">
                  <div
                    className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${FEEDBACK_RIPPLE[selectedDifficulty]} animate-feedback-ripple`}
                  />
                  <div
                    className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${FEEDBACK_RIPPLE[selectedDifficulty]} animate-feedback-ripple`}
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
                <div
                  className={`relative z-10 mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl ${cfgForSelected.glow} ring-4 ${cfgForSelected.ring} animate-feedback-pop motion-reduce:animate-none`}
                >
                  <Check className={`h-10 w-10 ${cfgForSelected.text}`} />
                </div>
                <p
                  className="relative z-10 text-lg font-black text-slate-800 opacity-0 motion-reduce:opacity-100 lg:text-xl"
                  style={{ animation: 'feedback-fade-up 0.5s ease-out 0.12s forwards' }}
                >
                  {feedback.title}
                </p>
                <p
                  className="relative z-10 mt-1 max-w-[280px] px-4 text-center text-sm text-slate-600 opacity-0 motion-reduce:opacity-100"
                  style={{ animation: 'feedback-fade-up 0.5s ease-out 0.22s forwards' }}
                >
                  {feedback.subtitle}
                </p>
                <p
                  className="relative z-10 mt-5 flex items-center gap-2 text-xs font-semibold text-indigo-500 opacity-0 motion-reduce:opacity-100"
                  style={{ animation: 'feedback-fade-up 0.45s ease-out 0.34s forwards' }}
                >
                  <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                  Thẻ tiếp theo…
                </p>
                <div
                  className={`pointer-events-none absolute left-1/2 top-[40%] h-32 w-32 -translate-x-1/2 rounded-full blur-3xl motion-reduce:hidden ${cfgForSelected.bg} animate-feedback-glow-pulse opacity-30`}
                />
              </div>
            )}

            <div className="custom-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto p-6 sm:p-8 lg:p-10">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0 text-left">
                  <h3 className="mb-1 text-2xl font-black text-slate-800 sm:text-3xl">{vocabulary.word}</h3>
                  {vocabulary.pronunciation && (
                    <div className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 font-mono text-xs text-indigo-600">
                      {vocabulary.pronunciation}
                    </div>
                  )}
                </div>
                {vocabulary.audioUrl && (
                  <button
                    type="button"
                    onClick={handlePlayAudio}
                    className="shrink-0 rounded-full bg-slate-100 p-3 text-slate-600 transition-all hover:bg-indigo-500 hover:text-white"
                    aria-label="Phát âm"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="relative mb-5 overflow-hidden rounded-2xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl" />
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Nghĩa tiếng Việt
                </span>
                <p className="text-2xl font-bold leading-tight text-indigo-800">{vocabulary.meaning}</p>
              </div>

              {vocabulary.example && (
                <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <span className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <BookOpen className="h-3.5 w-3.5" /> Ví dụ
                  </span>
                  <div
                    className="text-base leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: vocabulary.example }}
                  />
                </div>
              )}

              {vocabulary.definition && (
                <div className="mt-auto border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDefinition((v) => !v)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-indigo-600"
                  >
                    {showDefinition ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showDefinition ? 'Ẩn định nghĩa tiếng Anh' : 'Xem định nghĩa tiếng Anh'}
                  </button>
                  {showDefinition && (
                    <div
                      className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 transition-opacity duration-200"
                      dangerouslySetInnerHTML={{ __html: vocabulary.definition }}
                    />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleFlip}
                className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-indigo-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Quay lại mặt trước
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Dock: luôn ngay dưới thẻ (trong layout), không fixed — khỏi cuộn trang để tới */}
        <div
          className={`z-50 mt-3 flex w-full shrink-0 justify-center pb-[env(safe-area-inset-bottom,0px)] transition-all duration-300 motion-reduce:transition-none lg:mt-4 lg:max-w-[600px] ${
            dockVisible
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none h-0 overflow-hidden opacity-0 lg:hidden'
          }`}
        >
          <div className="flex w-full max-w-[min(100vw-1.5rem,400px)] items-center gap-1 rounded-[28px] border border-white/60 bg-white/90 p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:max-w-[600px] lg:gap-3 lg:rounded-3xl lg:p-3">
            {difficultyConfigs.map((config) => (
              <button
                key={config.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDifficultySelect(config.id);
                }}
                className="group relative flex h-[84px] w-[min(28vw,104px)] flex-col items-center justify-center overflow-hidden rounded-[20px] transition-all duration-300 hover:bg-slate-50 active:scale-95 lg:h-[92px] lg:min-w-[7.5rem] lg:flex-1 lg:rounded-2xl"
              >
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-[0.12] ${config.bg}`}
                />
                <span className="relative z-10 mb-1 text-2xl transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-125 lg:text-3xl">
                  {config.emoji}
                </span>
                <span className={`relative z-10 text-[12px] font-bold lg:text-sm ${config.text}`}>{config.label}</span>
                <span className="relative z-10 mt-0.5 rounded bg-slate-100/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400 lg:text-[10px]">
                  {config.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Gợi ý phím — chỉ desktop, gọn để không đẩy dock xuống xa */}
        <div className="mt-2 hidden w-full max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-slate-500 lg:flex">
          <span className="inline-flex items-center gap-1.5">
            <Keyboard className="h-3.5 w-3.5 text-indigo-400" />
            <kbd className="rounded-md bg-slate-200/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold">Space</kbd>
            lật
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <kbd className="rounded-md bg-slate-200/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold">1</kbd> Khó ·{' '}
            <kbd className="rounded-md bg-slate-200/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold">2</kbd> Vừa ·{' '}
            <kbd className="rounded-md bg-slate-200/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold">3</kbd> Dễ
          </span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 9999px; }
      `}</style>
    </div>
  );
}
