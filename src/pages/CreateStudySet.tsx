import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Globe, Lock, Trash2, Image, Volume2, X } from 'lucide-react';
import { StudySet, Vocabulary } from '../types';

const CreateStudySet: React.FC = () => {
  const navigate = useNavigate();
  const [studySetData, setStudySetData] = useState<Partial<StudySet>>({
    title: '',
    description: '',
    category: 'daily-life',
    level: 'beginner',
    tags: [],
    isPublic: false
  });

  const [vocabularies, setVocabularies] = useState<Partial<Vocabulary>[]>([
    { word: '', pronunciation: '', meaning: '', definition: '', example: '', imageUrl: '' },
    { word: '', pronunciation: '', meaning: '', definition: '', example: '', imageUrl: '' }
  ]);

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'business', name: 'Business' },
    { id: 'travel', name: 'Travel' },
    { id: 'technology', name: 'Technology' },
    { id: 'daily-life', name: 'Daily Life' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health' }
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const handleStudySetChange = (field: keyof StudySet, value: any) => {
    setStudySetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVocabularyChange = (index: number, field: keyof Vocabulary, value: string) => {
    const newVocabularies = [...vocabularies];
    newVocabularies[index] = {
      ...newVocabularies[index],
      [field]: value
    };
    setVocabularies(newVocabularies);
  };

  const addVocabulary = () => {
    setVocabularies([
      ...vocabularies,
      { word: '', pronunciation: '', meaning: '', definition: '', example: '', imageUrl: '' }
    ]);
  };

  const removeVocabulary = (index: number) => {
    if (vocabularies.length > 2) {
      const newVocabularies = vocabularies.filter((_, i) => i !== index);
      setVocabularies(newVocabularies);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !studySetData.tags?.includes(tagInput.trim())) {
      const newTags = [...(studySetData.tags || []), tagInput.trim()];
      handleStudySetChange('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = studySetData.tags?.filter(tag => tag !== tagToRemove) || [];
    handleStudySetChange('tags', newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate
      if (!studySetData.title?.trim()) {
        alert('Please enter a title for your study set');
        return;
      }

      const validVocabularies = vocabularies.filter(v => 
        v.word?.trim() && v.meaning?.trim() && v.definition?.trim() && v.example?.trim()
      );

      if (validVocabularies.length < 2) {
        alert('Please add at least 2 complete vocabulary terms');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newStudySet: StudySet = {
        id: Date.now().toString(),
        title: studySetData.title || '',
        description: studySetData.description || '',
        category: studySetData.category || 'daily-life',
        level: studySetData.level as 'beginner' | 'intermediate' | 'advanced' || 'beginner',
        tags: studySetData.tags || [],
        vocabularyCount: validVocabularies.length,
        createdBy: 'current-user',
        isPublic: studySetData.isPublic || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('New study set created:', newStudySet);
      console.log('Vocabularies:', validVocabularies);

      alert(`Study set "${newStudySet.title}" created successfully with ${validVocabularies.length} terms!`);
      navigate('/study-sets');
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create study set. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/study-sets')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Study Sets
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create Study Set</h1>
          <div></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Study Set Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Study Set Information</h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={studySetData.title}
                  onChange={(e) => handleStudySetChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter study set title (e.g., Business English Essentials)"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={studySetData.description}
                  onChange={(e) => handleStudySetChange('description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe what this study set covers..."
                />
              </div>

              {/* Category and Level */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={studySetData.category}
                    onChange={(e) => handleStudySetChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    value={studySetData.level}
                    onChange={(e) => handleStudySetChange('level', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                {studySetData.tags && studySetData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {studySetData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy Settings */}
              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={studySetData.isPublic}
                    onChange={(e) => handleStudySetChange('isPublic', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    {studySetData.isPublic ? (
                      <Globe className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-600" />
                    )}
                    <span className="font-medium text-gray-700">
                      {studySetData.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </label>
                <p className="text-sm text-gray-600 mt-1 ml-8">
                  {studySetData.isPublic 
                    ? 'Other users can discover and study your vocabulary set'
                    : 'Only you can access this study set'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Vocabulary Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Vocabulary Terms ({vocabularies.length})
              </h2>
              <button
                type="button"
                onClick={addVocabulary}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Term
              </button>
            </div>

            <div className="space-y-6">
              {vocabularies.map((vocab, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Term {index + 1}
                    </h3>
                    {vocabularies.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeVocabulary(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Word */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Word *
                      </label>
                      <input
                        type="text"
                        value={vocab.word || ''}
                        onChange={(e) => handleVocabularyChange(index, 'word', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the word"
                      />
                    </div>

                    {/* Pronunciation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pronunciation
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={vocab.pronunciation || ''}
                          onChange={(e) => handleVocabularyChange(index, 'pronunciation', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="/prəˌnʌn.siˈeɪ.ʃən/"
                        />
                        <Volume2 className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Meaning */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meaning (Vietnamese) *
                      </label>
                      <input
                        type="text"
                        value={vocab.meaning || ''}
                        onChange={(e) => handleVocabularyChange(index, 'meaning', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nghĩa tiếng Việt"
                      />
                    </div>

                    {/* Definition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Definition (English) *
                      </label>
                      <input
                        type="text"
                        value={vocab.definition || ''}
                        onChange={(e) => handleVocabularyChange(index, 'definition', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="English definition"
                      />
                    </div>
                  </div>

                  {/* Example */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Example Sentence *
                    </label>
                    <textarea
                      value={vocab.example || ''}
                      onChange={(e) => handleVocabularyChange(index, 'example', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Provide an example sentence using this word"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={vocab.imageUrl || ''}
                        onChange={(e) => handleVocabularyChange(index, 'imageUrl', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        placeholder="https://example.com/image.jpg"
                      />
                      <Image className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Study Set...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Study Set
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">💡 Study Set Tips</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Clear Titles:</strong> Use descriptive titles that explain the content.
            </div>
            <div>
              <strong>Quality Examples:</strong> Provide context-rich example sentences.
            </div>
            <div>
              <strong>Consistent Level:</strong> Keep all terms at a similar difficulty level.
            </div>
            <div>
              <strong>Visual Aids:</strong> Add images to improve memory retention.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudySet;