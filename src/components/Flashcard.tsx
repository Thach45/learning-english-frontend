import React, { useState } from 'react';
import { Volume2, RotateCcw, Eye, EyeOff, Star } from 'lucide-react';
import { Vocabulary } from '../types';
import { useAudio } from '../hooks/useAudio';

interface FlashcardProps {
  vocabulary: Vocabulary;
  onNext: () => void;
  onResult: (result: 'correct' | 'incorrect' | 'partial') => void;
  showResult?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  vocabulary, 
  onNext, 
  onResult, 
  showResult = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const { speak, isPlaying, isLoading } = useAudio();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAudio = () => {
    speak(vocabulary.word, 'en-US');
  };

  const handleResult = (result: 'correct' | 'incorrect' | 'partial') => {
    setUserRating(result === 'correct' ? 5 : result === 'partial' ? 3 : 1);
    onResult(result);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowDefinition(false);
    setUserRating(null);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Flashcard */}
        <div 
          className={`bg-white rounded-2xl shadow-xl border border-gray-200 min-h-96 p-8 transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* Front Side */}
          <div 
            className={`absolute inset-0 p-8 backface-hidden ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              {vocabulary.imageUrl && (
                <img
                  src={vocabulary.imageUrl}
                  alt={vocabulary.word}
                  className="w-32 h-32 object-cover rounded-lg mb-6 shadow-md"
                />
              )}
              
              <div className="mb-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {vocabulary.word}
                </h2>
                <p className="text-lg text-gray-600 font-mono">
                  {vocabulary.pronunciation}
                </p>
              </div>

              <button
                onClick={handleAudio}
                disabled={isLoading}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors mb-6 disabled:opacity-50"
              >
                <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              </button>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vocabulary.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  vocabulary.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vocabulary.level}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {vocabulary.category}
                </span>
              </div>

              <button
                onClick={handleFlip}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Show Meaning
              </button>
            </div>
          </div>

          {/* Back Side */}
          <div 
            className={`absolute inset-0 p-8 backface-hidden transform rotate-y-180 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {vocabulary.word}
                </h3>
                <p className="text-xl text-blue-600 font-semibold mb-4">
                  {vocabulary.meaning}
                </p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <button
                    onClick={() => setShowDefinition(!showDefinition)}
                    className="flex items-center text-gray-700 hover:text-gray-900 font-medium mb-2"
                  >
                    {showDefinition ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    Definition
                  </button>
                  {showDefinition && (
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {vocabulary.definition}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Example:</h4>
                  <p className="text-gray-600 italic bg-blue-50 p-3 rounded-lg">
                    "{vocabulary.example}"
                  </p>
                </div>

                {vocabulary.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {vocabulary.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={handleFlip}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center mx-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Show Word
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-600 font-medium">How well did you know this word?</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleResult('incorrect')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Don't Know
              </button>
              <button
                onClick={() => handleResult('partial')}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
              >
                Partially
              </button>
              <button
                onClick={() => handleResult('correct')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Know Well
              </button>
            </div>

            {showResult && userRating !== null && (
              <button
                onClick={handleNext}
                className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Next Word
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;