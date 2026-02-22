import React, { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, X, ExternalLink, Volume2, Star, Globe, Languages, Plus, ArrowRight } from 'lucide-react';
import { fetchDictionary } from '../config/api';

// --- STYLE DEFINITIONS FOR ANIMATIONS ---
const animationStyles = `
  /* Keyframe for the dynamic scroll-in animation */
  @keyframes item-in-view {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Keyframe for initial content fade-in */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }

  /* Class to apply to items that will animate on scroll */
  .scroll-animate {
    opacity: 0;
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  /* Class added by IntersectionObserver when item is visible */
  .scroll-animate.is-visible {
    opacity: 1;
    transform: none;
  }
  
  /* Staggered animation for the result list */
  .stagger-in > .scroll-animate {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    animation: item-in-view 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;

// Props Interface - remains the same
interface DictionaryShortcutProps {
  className?: string;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

// Data Structure Interfaces - remain the same
interface DictionaryEntry {
  part_of_speech: string;
  pronunciation?: string;
  pronunciations?: Array<{
    region: string;
    ipa: string;
    audio_url: string;
  }>;
  meanings: Array<{
    cefr_level?: string;
    english_def: string;
    vietnamese_trans?: string;
    examples: string[];
  }>;
}

interface DictionaryResult {
  status: string;
  word: string;
  entries: DictionaryEntry[];
}

// Main Component
const DictionaryShortcut: React.FC<DictionaryShortcutProps> = ({ 
  className = '',
  position = 'bottom-right'
}) => {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'vi'>('en');
  const [selectedPronunciation, setSelectedPronunciation] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // --- API & DATA HANDLING ---
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      // Replace with your actual API endpoint
      const data = await fetchDictionary(searchTerm, selectedLanguage);
      if (data.statusCode === 200 && data.data.status === 'success') {
        setResult(data.data);
        if (data.data.entries?.[0]?.pronunciations?.[0]?.audio_url) {
          setSelectedPronunciation(data.data.entries[0].pronunciations[0].audio_url);
        }
      } else {
        setError('Không tìm thấy từ. Vui lòng kiểm tra lại chính tả.');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Không thể tải dữ liệu từ điển. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // --- UI & UX HANDLERS ---
  const handlePlayAudio = (audioUrl: string) => {
    if (!audioUrl || isPlayingAudio) return;
    setIsPlayingAudio(true);
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("Audio play failed:", e));
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => { setIsPlayingAudio(false); console.error("Error playing audio."); };
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const fabButton = document.getElementById('dictionary-fab');
        if (fabButton && !fabButton.contains(event.target as Node)) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- SCROLL ANIMATION OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { root: resultsContainerRef.current, threshold: 0.1 }
    );
    const elements = resultsContainerRef.current?.querySelectorAll('.scroll-animate');
    elements?.forEach((el) => observer.observe(el));
    return () => elements?.forEach((el) => observer.unobserve(el));
  }, [result]);

  // --- STYLE & LAYOUT HELPERS ---
  const getCefrColor = (level?: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 border-green-200', 'A2': 'bg-sky-100 text-sky-800 border-sky-200',
      'B1': 'bg-blue-100 text-blue-800 border-blue-200', 'B2': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'C1': 'bg-purple-100 text-purple-800 border-purple-200', 'C2': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[level?.toUpperCase() as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getPositionClasses = () => {
    const positionMap = {
      'top-right': 'top-5 right-5', 'bottom-right': 'bottom-5 right-5',
      'top-left': 'top-5 left-5', 'bottom-left': 'bottom-5 left-5',
    };
    return positionMap[position] || positionMap['bottom-right'];
  };

  // --- RENDER ---
  return (
    <>
      <style>{animationStyles}</style>
      <div className={`fixed ${getPositionClasses()} z-50 font-sans ${className}`}>
        {/* FAB - Floating Action Button */}
        <button id="dictionary-fab" onClick={() => setIsOpen(!isOpen)} className={`w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} title="Mở Từ điển nhanh" aria-expanded={isOpen}>
          <BookOpen className="w-6 h-6" />
        </button>

        {/* Dictionary Panel with 3D Flip Animation */}
        <div 
          ref={panelRef} 
          style={{
            transformOrigin: 'bottom right',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out',
            transform: isOpen ? 'none' : 'scale(0.7) rotateX(15deg) rotateY(-15deg)',
            opacity: isOpen ? 1 : 0,
          }}
          className={`absolute bottom-0 right-0 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col ${!isOpen && 'pointer-events-none'}`}
        >
          
          <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" />Từ điển nhanh</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-all p-1.5 rounded-full hover:bg-slate-100 hover:rotate-90" title="Đóng Từ điển"><X className="w-5 h-5" /></button>
          </header>

          <div className="p-4 bg-slate-50/70 border-b border-slate-200">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-lg mb-4">
              {(['en', 'vi'] as const).map(lang => (<button key={lang} onClick={() => { setSelectedLanguage(lang); setResult(null); setError(''); }} className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedLanguage === lang ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-300/50'}`}>{lang === 'en' ? <Globe className="w-4 h-4" /> : <Languages className="w-4 h-4" />}{lang === 'en' ? 'Anh - Anh' : 'Anh - Việt'}</button>))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Nhập từ cần tra..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-12 pr-14 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" /><button onClick={handleSearch} disabled={isLoading || !searchTerm.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-transform active:scale-95" title="Tìm kiếm">{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <ArrowRight className="w-5 h-5" />}</button>
            </div>
          </div>

          <div ref={resultsContainerRef} className="flex-1 overflow-y-auto max-h-[55vh] min-h-[200px]">
            {!result && !isLoading && !error && (<div className="p-8 text-center text-slate-500 animate-fade-in"><BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4"/><h4 className="font-semibold text-slate-700">Sẵn sàng học hỏi?</h4><p className="text-sm">Nhập một từ vào ô tìm kiếm để bắt đầu.</p></div>)}
            {isLoading && (<div className="p-8 text-center animate-fade-in"><div className="flex justify-center items-center space-x-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0s]"></div><div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0.2s]"></div><div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0.4s]"></div></div><p className="text-slate-600 mt-4 text-sm">Đang tìm kiếm "{searchTerm}"...</p></div>)}
            {error && (<div className="p-8 text-center animate-fade-in"><div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><X className="w-8 h-8 text-red-500" /></div><p className="text-red-600 font-semibold">{error}</p><p className="text-slate-500 text-sm mt-1">Vui lòng thử một từ khác.</p></div>)}
            {result && (<div className="p-4 space-y-5 stagger-in">
              <div className="text-center scroll-animate" style={{animationDelay: '100ms'}}><h4 className="text-3xl font-bold text-slate-800 tracking-tight">{result.word}</h4>{result.entries?.[0]?.pronunciations && (<div className="flex items-center justify-center flex-wrap gap-2 mt-3">{result.entries[0].pronunciations.map((pron, index) => (<button key={index} onClick={() => setSelectedPronunciation(pron.audio_url)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedPronunciation === pron.audio_url ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}>{pron.region.toUpperCase()} <span className="text-slate-400 ml-1">{pron.ipa}</span></button>))} {selectedPronunciation && (<button onClick={() => handlePlayAudio(selectedPronunciation)} disabled={isPlayingAudio} className="p-2.5 text-blue-600 hover:bg-blue-100 disabled:text-slate-400 disabled:bg-slate-100 rounded-full transition-colors" title="Nghe phát âm"><Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} /></button>)}</div>)}</div>
              {result.entries?.map((entry, entryIndex) => (<div key={entryIndex} className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 scroll-animate" style={{animationDelay: `${200 + entryIndex * 100}ms`}}><div className="flex items-center justify-between mb-4"><span className="text-sm font-semibold italic text-indigo-600">{entry.part_of_speech}</span><button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Thêm vào Flashcard"><Plus className="w-4 h-4" /></button></div><div className="space-y-4">{entry.meanings?.map((meaning, meaningIndex) => (<div key={meaningIndex} className="border-t border-slate-200 pt-4 first:pt-0 first:border-t-0">{meaning.cefr_level && meaning.cefr_level !== 'N/A' && <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${getCefrColor(meaning.cefr_level)}`}><Star className="w-3.5 h-3.5 mr-1.5" />CEFR {meaning.cefr_level}</div>}<p className="text-base text-slate-800 mb-2">{meaning.english_def}</p>{meaning.vietnamese_trans && <p className="text-base text-green-700 bg-green-50 p-3 rounded-lg border border-green-200"><span className="font-semibold">Nghĩa:</span> {meaning.vietnamese_trans}</p>}{meaning.examples?.map((example, exIndex) => <div key={exIndex} className="mt-3 text-slate-600 italic border-l-4 border-blue-200 pl-4 py-1">"{example}"</div>)}</div>))}</div></div>))}
              <div className="pt-4 border-t border-slate-200 scroll-animate" style={{animationDelay: `${200 + result.entries.length * 100}ms`}}><p className="text-xs text-slate-500 mb-2 text-center">Xem trên các từ điển khác:</p><div className="flex gap-2"><a href={`https://dictionary.cambridge.org/dictionary/english/${result.word}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-sm transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Cambridge</a><a href={`https://www.oxfordlearnersdictionaries.com/definition/english/${result.word}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-sm transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Oxford</a></div></div>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default DictionaryShortcut;
