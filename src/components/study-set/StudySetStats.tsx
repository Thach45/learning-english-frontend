import React from 'react';
import { StudySet } from '../../types';

interface StudySetStatsProps {
  studySets: StudySet[];
  total: number;
}

const StudySetStats: React.FC<StudySetStatsProps> = ({ studySets, total }) => {
  const publicSets = studySets.filter(s => s.isPublic).length;
  const userSets = studySets.filter(s => s.author?.id === 'mockUser.id').length;
  const totalTerms = studySets.reduce((sum, set) => sum + set.vocabularyCount, 0);

  return (
    <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-600">Total Study Sets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{publicSets}</div>
          <div className="text-sm text-gray-600">Public Sets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{userSets}</div>
          <div className="text-sm text-gray-600">Your Sets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{totalTerms}</div>
          <div className="text-sm text-gray-600">Total Terms</div>
        </div>
      </div>
    </div>
  );
};

export default StudySetStats; 