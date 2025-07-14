import { useState, useEffect } from 'react';
import { Vocabulary, StudySession } from '../types';

interface SpacedRepetitionResult {
  nextReviewDate: Date;
  newDifficulty: number;
  intervalDays: number;
}

export const useSpacedRepetition = () => {
  const calculateNextReview = (
    vocabulary: Vocabulary,
    result: 'correct' | 'incorrect' | 'partial'
  ): SpacedRepetitionResult => {
    const { difficulty, reviewCount } = vocabulary;
    
    // SM-2 Algorithm adaptation
    let newDifficulty = difficulty;
    let intervalDays = 1;

    switch (result) {
      case 'correct':
        if (reviewCount === 0) {
          intervalDays = 1;
        } else if (reviewCount === 1) {
          intervalDays = 6;
        } else {
          intervalDays = Math.round(intervalDays * (2.5 + (0.13 * (5 - difficulty) * (5 - difficulty))));
        }
        newDifficulty = Math.max(0.1, difficulty - 0.1);
        break;
      
      case 'partial':
        intervalDays = Math.max(1, Math.round(intervalDays * 0.5));
        break;
      
      case 'incorrect':
        intervalDays = 1;
        newDifficulty = Math.min(1, difficulty + 0.2);
        break;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    return {
      nextReviewDate,
      newDifficulty,
      intervalDays
    };
  };

  const getVocabularyForReview = (vocabularyList: Vocabulary[]): Vocabulary[] => {
    const now = new Date();
    return vocabularyList.filter(vocab => 
      !vocab.nextReview || vocab.nextReview <= now
    ).sort((a, b) => {
      // Prioritize by difficulty (harder words first) and review count
      const difficultyDiff = (b.difficulty || 0) - (a.difficulty || 0);
      if (difficultyDiff !== 0) return difficultyDiff;
      return (a.reviewCount || 0) - (b.reviewCount || 0);
    });
  };

  const updateVocabularyAfterStudy = (
    vocabulary: Vocabulary,
    result: 'correct' | 'incorrect' | 'partial'
  ): Vocabulary => {
    const reviewResult = calculateNextReview(vocabulary, result);
    
    return {
      ...vocabulary,
      nextReview: reviewResult.nextReviewDate,
      difficulty: reviewResult.newDifficulty,
      reviewCount: vocabulary.reviewCount + 1
    };
  };

  return {
    calculateNextReview,
    getVocabularyForReview,
    updateVocabularyAfterStudy
  };
};