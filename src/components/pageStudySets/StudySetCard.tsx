import React from 'react';
import { BookOpen, User, Globe, Lock, Calendar, Eye, Pencil, Trash2 } from 'lucide-react';
import { StudySet } from '../types';

interface StudySetCardProps {
  studySet: StudySet;
  onStudySetClick: (studySet: StudySet) => void;
  onEditClick: (studySetId: string) => void;
  onDeleteClick: (studySetId: string) => void;
}

const StudySetCard: React.FC<StudySetCardProps> = ({
  studySet,
  onStudySetClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div
      onClick={() => onStudySetClick(studySet)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group relative flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {studySet.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {studySet.description}
          </p>
        </div>
        <div className="ml-4">
          {studySet.isPublic ? (
            <Globe className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-1" />
          {studySet.vocabularyCount} terms
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-1" />
          {studySet.author?.name || 'User'}
        </div>
      </div>

      {/* Tags and Level */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            studySet.level === 'beginner' ? 'bg-green-100 text-green-800' :
            studySet.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {studySet.level}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {typeof studySet.category === 'object' && studySet.category !== null
              ? studySet.category.name
              : studySet.category || ''}
          </span>
        </div>
      </div>

      {/* Tags */}
      {studySet.tags && studySet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {studySet.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {studySet.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{studySet.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Updated {new Date(studySet.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
            title="Chỉnh sửa"
            onClick={e => { e.stopPropagation(); onEditClick(studySet.id); }}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition"
            title="Xoá"
            onClick={e => { e.stopPropagation(); onDeleteClick(studySet.id); }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button 
            className="flex items-center ml-2 text-gray-500 hover:text-blue-600" 
            onClick={e => { e.stopPropagation(); onStudySetClick(studySet); }} 
            title="Học ngay"
          >
            <Eye className="h-3 w-3 mr-1" />
            Study
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudySetCard; 