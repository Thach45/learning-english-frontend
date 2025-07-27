import React from 'react';
import { motion } from 'framer-motion';
import { Speech, Edit, Trash, Star } from 'lucide-react';
import { Vocabulary } from '../../types';
import PartOfSpeechTags from './PartOfSpeechTags';


interface VocabularyCardProps {
  vocab: Vocabulary;
  index: number;
  currentPage: number;
  itemsPerPage: number;
  viewMode: 'list' | 'grid';
  isOwner: boolean;
  deleteLoadingId: string | null;
  onEdit: (vocab: Vocabulary) => void;
  onDelete: (vocab: Vocabulary) => void;
  onPlayAudio: (url: string) => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocab,
  index,
  currentPage,
  itemsPerPage,
  viewMode,
  isOwner,
  deleteLoadingId,
  onEdit,
  onDelete,
  onPlayAudio,
}) => {
  // Helper function to get CEFR level color
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

  return (
    <motion.div
      key={vocab.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        border border-gray-200 rounded-lg p-4 
        ${viewMode === 'grid' ? 'h-full' : ''}
        hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <span className="text-sm font-medium text-gray-500">
              #{(currentPage - 1) * itemsPerPage + index + 1}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
            {vocab.pronunciation && (
              <span className="text-sm text-gray-600 font-mono">{vocab.pronunciation}</span>
            )}
            {vocab.audioUrl && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-blue-500 hover:text-blue-600"
                onClick={() => onPlayAudio(vocab.audioUrl || '')}
              >
                <Speech className="w-4 h-4" />
              </motion.button>
            )}
            {vocab.cefrLevel && (
              <div className={`flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getCefrColor(vocab.cefrLevel)}`}>
                <Star className="w-3 h-3 mr-1" />
                CEFR {vocab.cefrLevel.toUpperCase()}
              </div>
            )}
          </div>

          <PartOfSpeechTags
            mainPos={vocab.partOfSpeech}
            alternativePos={vocab.alternativePartOfSpeech}
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Vietnamese:</p>
              <p className="text-blue-600 font-medium">{vocab.meaning}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Definition:</p>
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: vocab.definition }}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
            <div 
              className="text-gray-600 italic"
              dangerouslySetInnerHTML={{ __html: vocab.example ? `"${vocab.example}"` : '' }}
            />
          </div>
        </div>
        
        {vocab.imageUrl && (
          <motion.img
            src={vocab.imageUrl}
            alt={vocab.word}
            className="w-16 h-16 object-cover rounded-lg ml-4"
            whileHover={{ scale: 1.1 }}
          />
        )}
      </div>

      {isOwner && (
        <motion.div 
          className="flex justify-end mt-4 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600"
            onClick={() => onEdit(vocab)}
          >
            <Edit className="w-4 h-4 inline mr-1" />
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium text-red-600 disabled:opacity-60"
            onClick={() => onDelete(vocab)}
            disabled={deleteLoadingId === vocab.id}
          >
            <Trash className="w-4 h-4 inline mr-1" />
            {deleteLoadingId === vocab.id ? 'Deleting...' : 'Delete'}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VocabularyCard; 