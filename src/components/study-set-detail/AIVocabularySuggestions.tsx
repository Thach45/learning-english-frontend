import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2, Play, Star, X } from 'lucide-react';
import { Vocabulary, CefrLevel, PartOfSpeech } from '../../types';
import PartOfSpeechTags from './PartOfSpeechTags';

interface AIVocabularySuggestionsProps {
  suggestions: Vocabulary[];
  loading?: boolean;
  onAddSelected: (selectedIds: string[]) => void;
  onPlayAudio?: (url: string) => void;
  adding?: boolean;
  onClose?: () => void;
}

const AIVocabularySuggestions: React.FC<AIVocabularySuggestionsProps> = ({
  suggestions,
  loading = false,
  onAddSelected,
  onPlayAudio,
  adding = false,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === suggestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suggestions.map((v) => (v as any).id || v.word)));
    }
  };

  const handleAddSelected = () => {
    onAddSelected(Array.from(selectedIds));
  };

  const getCefrColor = (level?: CefrLevel) => {
    switch (level) {
      case CefrLevel.A1:
        return 'bg-green-100 text-green-800 border-green-200';
      case CefrLevel.A2:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case CefrLevel.B1:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CefrLevel.B2:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case CefrLevel.C1:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case CefrLevel.C2:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">AI đang phân tích và đề xuất từ vựng...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Chưa có từ vựng nào được đề xuất</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {onClose && (
        <button
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      )}
      {/* Header with select all */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {suggestions.length} từ vựng được đề xuất
            </h3>
          </div>
          {selectedIds.size > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              Đã chọn {selectedIds.size}/{suggestions.length}
            </span>
          )}
        </div>
        <button
          onClick={toggleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedIds.size === suggestions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </button>
      </div>

      {/* Vocabulary List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {suggestions.map((vocab, index) => {
          const vocabId = (vocab as any).id || vocab.word;
          const isSelected = selectedIds.has(vocabId);

          return (
            <motion.div
              key={vocabId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`
                relative border-2 rounded-xl p-4 transition-all cursor-pointer
                ${isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50'
                }
              `}
              onClick={() => toggleSelect(vocabId)}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4">
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 bg-white'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="pr-10">
                {/* Word Header */}
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{vocab.word}</h4>
                  {vocab.pronunciation && (
                    <span className="text-sm text-gray-600 font-mono">
                      /{vocab.pronunciation}/
                    </span>
                  )}
                  {vocab.audioUrl && onPlayAudio && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayAudio(vocab.audioUrl || '');
                      }}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  {vocab.cefrLevel && (
                    <div
                      className={`flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${getCefrColor(
                        vocab.cefrLevel
                      )}`}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {vocab.cefrLevel}
                    </div>
                  )}
                </div>

                {/* Part of Speech */}
                <div className="mb-3">
                  <PartOfSpeechTags
                    mainPos={vocab.partOfSpeech}
                    alternativePos={vocab.alternativePartOfSpeech}
                  />
                </div>

                {/* Meaning & Definition */}
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Nghĩa tiếng Việt:</p>
                    <p className="text-blue-600 font-medium">{vocab.meaning}</p>
                  </div>
                  {vocab.definition && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Định nghĩa:</p>
                      <div
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: vocab.definition }}
                      />
                    </div>
                  )}
                </div>

                {/* Example */}
                {vocab.example && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ví dụ:</p>
                    <div
                      className="text-sm text-gray-600 italic"
                      dangerouslySetInnerHTML={{
                        __html: vocab.example.includes('"') ? vocab.example : `"${vocab.example}"`,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 pt-4 bg-white border-t border-gray-200"
        >
          <button
            onClick={handleAddSelected}
            disabled={adding || selectedIds.size === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Thêm {selectedIds.size} từ đã chọn vào bộ học</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AIVocabularySuggestions;

