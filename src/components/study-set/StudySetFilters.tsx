import React from 'react';
import { Search } from 'lucide-react';

interface StudySetFiltersProps {
  searchTerm: string;
  filterCategory: string;
  filterLevel: string;
  categories: { id: string; name: string }[];
  levels: { id: string; name: string }[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

const StudySetFilters: React.FC<StudySetFiltersProps> = ({
  searchTerm,
  filterCategory,
  filterLevel,
  categories,
  levels,
  onSearchChange,
  onCategoryChange,
  onLevelChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search study sets..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={filterLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {levels.map(level => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>

        {/* Placeholder for future filters */}
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
          More filters coming soon...
        </div>
      </div>
    </div>
  );
};

export default StudySetFilters; 