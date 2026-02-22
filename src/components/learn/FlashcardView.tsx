import React, { useState } from 'react';
import { Volume2, RotateCcw, Eye, EyeOff, Star, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { ReviewVocabulary, CefrLevel } from '../../types';

interface FlashcardProps {
  vocabulary: ReviewVocabulary;
  onNext: () => void;
  onResult: (result: 'easy' | 'good' | 'hard') => void;
  showResult?: boolean;
  currentIndex?: number;
  totalCards?: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  vocabulary, 
  onNext, 
  onResult, 
  showResult = false,
  currentIndex = 0,
  totalCards = 1
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [userRating, setUserRating] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [showResultFeedback, setShowResultFeedback] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowDefinition(false);
    }
  };

  const handlePlayAudio = () => {
    if (!vocabulary.audioUrl) return;
    
    setIsPlayingAudio(true);
    const audio = new Audio(vocabulary.audioUrl);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play();
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (isAnimating) return;
    
    setSelectedDifficulty(difficulty);
    setIsAnimating(true);
    
    setTimeout(() => {
      setUserRating(difficulty);
      setShowResultFeedback(true);
      setIsAnimating(false);
      
      const resultMap = {
        'easy': 'easy' as const,
        'medium': 'good' as const,
        'hard': 'hard' as const
      };
      
      onResult(resultMap[difficulty]);
      
      setTimeout(() => {
        handleNext();
      }, 1500);
    }, 600);
  };

  // Reset states when moving to next card
  const handleNext = () => {
    setIsFlipped(false);
    setShowDefinition(false);
    setUserRating(null);
    setShowResultFeedback(false);
    setSelectedDifficulty(null);
    setIsAnimating(false);
    setIsPlayingAudio(false);
    onNext();
  };

  const getDifficultyConfig = (difficulty: 'easy' | 'medium' | 'hard') => {
    const configs = {
      easy: {
        label: 'Easy',
        emoji: '😊',
        color: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        description: 'I knew this well',
        hoverAnimation: 'group-hover:animate-bounce-gentle'
      },
      medium: {
        label: 'Medium', 
        emoji: '🤔',
        color: 'bg-yellow-500 hover:bg-yellow-600',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        description: 'I hesitated a bit',
        hoverAnimation: 'group-hover:animate-wiggle'
      },
      hard: {
        label: 'Hard',
        emoji: '😅', 
        color: 'bg-red-500 hover:bg-red-600',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        description: 'I need more practice',
        hoverAnimation: 'group-hover:animate-shake'
      }
    };
    return configs[difficulty];
  };

  const getCefrColor = (level?: CefrLevel) => {
    switch (level) {
      case CefrLevel.A1: return 'bg-green-100 text-green-800 border-green-200';
      case CefrLevel.A2: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case CefrLevel.B1: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CefrLevel.B2: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case CefrLevel.C1: return 'bg-purple-100 text-purple-800 border-purple-200';
      case CefrLevel.C2: return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Card {currentIndex + 1} of {totalCards}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(((currentIndex + 1) / totalCards) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <div 
          className={`relative w-full min-h-96 transition-transform duration-700 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Side */}
          <div 
            className={`absolute inset-0 w-full ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-200 p-8 min-h-96 transition-shadow duration-300">
              <div className="flex flex-col items-center justify-center h-full text-center">
                {/* Image Section */}
                {vocabulary?.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={vocabulary.imageUrl}
                      alt={vocabulary.word}
                      className="w-40 h-40 object-cover rounded-xl shadow-lg hover-scale"
                    />
                  </div>
                )}
                
                {/* Word Section */}
                <div className="mb-6">
                  <h2 className="text-5xl font-bold text-gray-900 mb-3">
                    {vocabulary.word}
                  </h2>
                  {vocabulary.pronunciation && (
                    <p className="text-xl text-gray-600 font-mono mb-3">
                      {vocabulary.pronunciation}
                    </p>
                  )}
                  
                  {/* Part of Speech */}
                  {vocabulary.partOfSpeech && (
                    <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      <Tag className="w-4 h-4 mr-1.5" />
                      {vocabulary.partOfSpeech.toLowerCase()}
                    </div>
                  )}
                </div>

                {/* Audio Button */}
                {vocabulary.audioUrl && (
                  <button
                    onClick={handlePlayAudio}
                    disabled={isPlayingAudio}
                    className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 mb-8 disabled:opacity-50 shadow-lg hover-scale disabled:hover:scale-100"
                  >
                    <Volume2 className={`h-7 w-7 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                  </button>
                )}

                {/* Level Tags */}
                <div className="flex items-center space-x-3 mb-6">
                  
                  {vocabulary.cefrLevel && (
                    <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getCefrColor(vocabulary.cefrLevel)}`}>
                      <Star className="w-4 h-4 mr-1.5" />
                      CEFR {vocabulary.cefrLevel}
                    </div>
                  )}
                </div>

                {/* Flip Button */}
                <button
                  onClick={handleFlip}
                  className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 hover-scale"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Show Meaning
                </button>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div 
            className={`absolute inset-0 w-full ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-200 p-8 min-h-96 transition-shadow duration-300">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {vocabulary.word}
                  </h3>
                  <p className="text-2xl text-blue-600 font-semibold mb-2">
                    {vocabulary.meaning}
                  </p>
                  
                  {/* Pronunciation and Part of Speech */}
                  <div className="flex justify-center items-center space-x-4 mb-3">
                    {vocabulary.pronunciation && (
                      <span className="text-lg text-gray-600 font-mono">
                        {vocabulary.pronunciation}
                      </span>
                    )}
                    {vocabulary.partOfSpeech && (
                      <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                        <Tag className="w-3 h-3 mr-1" />
                        {vocabulary.partOfSpeech.toLowerCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* CEFR Level */}
                  {vocabulary.cefrLevel && (
                    <div className="flex justify-center mt-2">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getCefrColor(vocabulary.cefrLevel)}`}>
                        <Star className="w-4 h-4 mr-1.5" />
                        <span>CEFR Level: {vocabulary.cefrLevel}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  {/* Definition Section */}
                  {vocabulary.definition && (
                    <div>
                      <button
                        onClick={() => setShowDefinition(!showDefinition)}
                        className="flex items-center text-gray-700 hover:text-gray-900 font-medium mb-3 transition-colors duration-200"
                      >
                        {showDefinition ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                        Definition
                      </button>
                      {showDefinition && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div 
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{ __html: vocabulary.definition }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Example Section */}
                  {vocabulary.example && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                        Example:
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div 
                          className="text-gray-700 italic text-lg"
                          dangerouslySetInnerHTML={{ __html: vocabulary.example }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Flip Back Button */}
                <div className="text-center mt-6">
                  <button
                    onClick={handleFlip}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium mx-auto transition-colors duration-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Show Word
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      {isFlipped && !showResultFeedback && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-10">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
            <div className="flex items-center space-x-4 relative">
              {(['hard', 'medium', 'easy'] as const).map((difficulty, index) => {
                const config = getDifficultyConfig(difficulty);
                const isSelected = selectedDifficulty === difficulty;
                const otherSelected = selectedDifficulty !== null && selectedDifficulty !== difficulty;

                let animationClass = '';
                if (isAnimating) {
                  if (isSelected) {
                    if (index === 0) {
                      animationClass = 'animate-slide-left-to-center scale-110';
                    } else if (index === 2) {
                      animationClass = 'animate-slide-right-to-center scale-110';
                    } else {
                      animationClass = 'scale-110 translate-y-0';
                    }
                  } else {
                    if (selectedDifficulty === 'hard') {
                      animationClass = 'animate-slide-out-right';
                    } else if (selectedDifficulty === 'easy') {
                      animationClass = 'animate-slide-out-left';
                    } else {
                      animationClass = index === 0 ? 'animate-slide-out-left' : 'animate-slide-out-right';
                    }
                  }
                }

                return (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultySelect(difficulty)}
                    className={`group w-12 h-12 rounded-full ${config.color} text-white font-bold text-lg 
                      transition-all duration-300 shadow-md
                      ${animationClass}
                      ${!isAnimating && 'hover:scale-110'}
                      ${otherSelected ? 'pointer-events-none' : ''}
                      relative
                    `}
                    style={{
                      visibility: otherSelected && isAnimating ? 'hidden' : 'visible',
                      zIndex: isSelected ? 10 : 0
                    }}
                    disabled={isAnimating}
                    title={`${config.label} - ${config.description}`}
                  >
                    <span className={`inline-block transition-transform ${config.hoverAnimation}`}>
                      {config.emoji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Result Feedback */}
      {showResultFeedback && userRating && (
        <div className="mt-8">
          <div className={`max-w-md mx-auto p-6 rounded-xl ${getDifficultyConfig(userRating).bgColor} border border-gray-200`}>
            <div className="text-center">
              <div className="text-4xl mb-3">{getDifficultyConfig(userRating).emoji}</div>
              <h4 className={`text-lg font-bold mb-2 ${getDifficultyConfig(userRating).textColor}`}>
                Marked as {getDifficultyConfig(userRating).label}
              </h4>
              <p className="text-gray-600 mb-4">
                {userRating === 'easy' && "Great! This card will appear less frequently."}
                {userRating === 'medium' && "Good! This card will appear at regular intervals."}
                {userRating === 'hard' && "No worries! This card will appear more often until you master it."}
              </p>
              
              <div className="flex items-center justify-center text-blue-600">
                <span className="mr-2">Moving to next card</span>
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Next Button (if needed) */}
      {showResultFeedback && (
        <div className="text-center mt-6">
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover-scale"
          >
            Next Card
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;