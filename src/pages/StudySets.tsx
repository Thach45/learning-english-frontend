import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, Users, Lock, Globe, Calendar, User, Eye } from 'lucide-react';
import { mockStudySets, mockUser } from '../data/mockData';
import { StudySet } from '../types';

const StudySets: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showMyStudySets, setShowMyStudySets] = useState(false);

  const filteredStudySets = mockStudySets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || set.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || set.level === filterLevel;
    const matchesOwnership = !showMyStudySets || set.createdBy === mockUser.id;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesOwnership;
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'business', name: 'Business' },
    { id: 'travel', name: 'Travel' },
    { id: 'technology', name: 'Technology' },
    { id: 'daily-life', name: 'Daily Life' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const handleStudySetClick = (studySet: StudySet) => {
    navigate(`/study-sets/${studySet.id}`);
  };

  const handleCreateStudySet = () => {
    navigate('/study-sets/create');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Sets</h1>
          <p className="text-gray-600">Discover and create vocabulary study sets</p>
        </div>
        
        <button
          onClick={handleCreateStudySet}
          className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Study Set
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search study sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>

          {/* My Study Sets Toggle */}
          <label className="flex items-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showMyStudySets}
              onChange={(e) => setShowMyStudySets(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">My Study Sets</span>
          </label>
        </div>
      </div>

      {/* Study Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudySets.map((studySet) => (
          <div
            key={studySet.id}
            onClick={() => handleStudySetClick(studySet)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
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
                {studySet.createdBy === mockUser.id ? 'You' : 'Other user'}
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
                  {studySet.category}
                </span>
              </div>
            </div>

            {/* Tags */}
            {studySet.tags.length > 0 && (
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
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Updated {studySet.updatedAt.toLocaleDateString()}
              </div>
              
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                Study
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudySets.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study sets found</h3>
          <p className="text-gray-600 mb-6">
            {showMyStudySets 
              ? "You haven't created any study sets yet."
              : "Try adjusting your search or filters."
            }
          </p>
          {showMyStudySets && (
            <button
              onClick={handleCreateStudySet}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Study Set
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mockStudySets.length}</div>
            <div className="text-sm text-gray-600">Total Study Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockStudySets.filter(s => s.isPublic).length}
            </div>
            <div className="text-sm text-gray-600">Public Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mockStudySets.filter(s => s.createdBy === mockUser.id).length}
            </div>
            <div className="text-sm text-gray-600">Your Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {mockStudySets.reduce((sum, set) => sum + set.vocabularyCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Terms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySets;