import React, { useState, useRef, useEffect } from 'react';
import { Globe, Languages, Plus, Volume2, Star, X } from 'lucide-react';

interface DictionaryHoverTooltipProps {
  word: string;
  children: React.ReactNode;
  className?: string;
}

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

const DictionaryHoverTooltip: React.FC<DictionaryHoverTooltipProps> = ({ 
  word, 
  children, 
  className = '' 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en-en' | 'en-vi'>('en-en');
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPronunciation, setSelectedPronunciation] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  const handleSearch = async (language: 'en-en' | 'en-vi') => {
    setSelectedLanguage(language);
    setShowDictionary(true);
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/vocabulary/search?word=${encodeURIComponent(word)}&langue=${language}`);
      const data = await response.json();
      
      if (data.statusCode === 200 && data.data.status === 'success') {
        setResult(data.data);
        
        // Set default pronunciation
        if (data.data.entries?.[0]?.pronunciations?.[0]?.audio_url) {
          setSelectedPronunciation(data.data.entries[0].pronunciations[0].audio_url);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dictionary data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    
    setIsPlayingAudio(true);
    const audio = new Audio(audioUrl);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play();
  };

  const getCefrColor = (level?: string) => {
    switch (level?.toUpperCase()) {
      case 'A1': return 'bg-green-100 text-green-800 border-green-200';
      case 'A2': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'B1': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B2': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'C1': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'C2': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <span 
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Quick Options Tooltip */}
      {showTooltip && !showDictionary && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-1">
            <button
              onClick={() => handleSearch('en-en')}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors group"
              title="English-English Dictionary"
            >
              <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => handleSearch('en-vi')}
              className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded transition-colors group"
              title="English-Vietnamese Dictionary"
            >
              <Languages className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => {/* TODO: Add to flashcard */}}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors group"
              title="Add to Flashcard"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}

      {/* Dictionary Panel */}
      {showDictionary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Dictionary: {word}
                </h3>
                <button
                  onClick={() => setShowDictionary(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleSearch('en-en')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLanguage === 'en-en' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Globe className="w-4 h-4 inline mr-2" />
                  English-English
                </button>
                <button
                  onClick={() => handleSearch('en-vi')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLanguage === 'en-vi' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Languages className="w-4 h-4 inline mr-2" />
                  English-Vietnamese
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto p-4">
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading dictionary...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Pronunciation and Audio */}
                  {result.entries?.[0]?.pronunciations && (
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <select
                        value={selectedPronunciation}
                        onChange={(e) => setSelectedPronunciation(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-2 bg-white"
                      >
                        {result.entries[0].pronunciations.map((pron, index) => (
                          <option key={index} value={pron.audio_url}>
                            {pron.region.toUpperCase()}: {pron.ipa}
                          </option>
                        ))}
                      </select>
                      {selectedPronunciation && (
                        <button
                          onClick={() => handlePlayAudio(selectedPronunciation)}
                          disabled={isPlayingAudio}
                          className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 rounded-lg hover:bg-blue-50"
                        >
                          <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Entries */}
                  {result.entries?.map((entry, entryIndex) => (
                    <div key={entryIndex} className="border border-gray-200 rounded-lg p-4">
                      {/* Part of Speech */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {entry.part_of_speech}
                        </span>
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="Add to Flashcard"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Meanings */}
                      {entry.meanings?.map((meaning, meaningIndex) => (
                        <div key={meaningIndex} className="mb-4 last:mb-0">
                          {/* CEFR Level */}
                          {meaning.cefr_level && meaning.cefr_level !== 'N/A' && (
                            <div className="mb-2">
                              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getCefrColor(meaning.cefr_level)}`}>
                                <Star className="w-3 h-3 mr-1" />
                                CEFR {meaning.cefr_level}
                              </div>
                            </div>
                          )}

                          {/* Definition */}
                          <div className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Definition:</span> {meaning.english_def}
                          </div>

                          {/* Vietnamese Translation */}
                          {meaning.vietnamese_trans && (
                            <div className="text-sm text-blue-600 mb-2">
                              <span className="font-medium">Translation:</span> {meaning.vietnamese_trans}
                            </div>
                          )}

                          {/* Examples */}
                          {meaning.examples && meaning.examples.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Examples:</span>
                              <ul className="mt-2 space-y-2">
                                {meaning.examples.map((example, exampleIndex) => (
                                  <li key={exampleIndex} className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                                    "{example}"
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default DictionaryHoverTooltip; 