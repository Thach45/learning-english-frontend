import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Brain, BookOpen, Edit, Share2, Users, Calendar, Globe, Lock, Star } from 'lucide-react';
import { mockStudySets, mockVocabulary, mockUser } from '../data/mockData';
import { StudySet, Vocabulary } from '../types';

const StudySetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadStudySet = async () => {
      setLoading(true);
      
      // Find study set
      const foundStudySet = mockStudySets.find(set => set.id === id);
      if (!foundStudySet) {
        navigate('/study-sets');
        return;
      }

      // Get vocabularies for this study set
      const studySetVocabs = mockVocabulary.filter(vocab => vocab.studySetId === id);
      
      setStudySet(foundStudySet);
      setVocabularies(studySetVocabs);
      setLoading(false);
    };

    loadStudySet();
  }, [id, navigate]);

  const handleStartFlashcards = () => {
    navigate(`/learn/flashcards?studySetId=${id}`);
  };

  const handleStartQuiz = () => {
    navigate(`/learn/quiz?studySetId=${id}`);
  };

  const handleEdit = () => {
    navigate(`/study-sets/${id}/edit`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/study-sets/${id}`;
    const shareText = `Check out this study set: "${studySet?.title}" with ${vocabularies.length} vocabulary terms!`;
    
    if (navigator.share) {
      navigator.share({
        title: studySet?.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Study set link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study set...</p>
        </div>
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Set Not Found</h2>
          <p className="text-gray-600 mb-4">The study set you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/study-sets')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Study Sets
          </button>
        </div>
      </div>
    );
  }

  const isOwner = studySet.createdBy === mockUser.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/study-sets')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Study Sets
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            
            {isOwner && (
              <button
                onClick={handleEdit}
                className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Study Set Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{studySet.title}</h1>
              <p className="text-gray-600 text-lg mb-4">{studySet.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {vocabularies.length} terms
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {isOwner ? 'Created by you' : 'Created by other user'}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated {studySet.updatedAt.toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  studySet.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  studySet.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {studySet.level}
                </span>
                
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {studySet.category}
                </span>

                <div className="flex items-center">
                  {studySet.isPublic ? (
                    <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </div>
                  )}
                </div>
              </div>

              {studySet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {studySet.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Study Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleStartFlashcards}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              Study with Flashcards
            </button>
            
            <button
              onClick={handleStartQuiz}
              className="flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Take Quiz
            </button>
          </div>
        </div>

        {/* Vocabulary Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Vocabulary Terms ({vocabularies.length})
          </h2>
          
          {vocabularies.length > 0 ? (
            <div className="space-y-4">
              {vocabularies.map((vocab, index) => (
                <div key={vocab.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
                        {vocab.pronunciation && (
                          <span className="text-sm text-gray-600 font-mono">{vocab.pronunciation}</span>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Vietnamese:</p>
                          <p className="text-blue-600 font-medium">{vocab.meaning}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Definition:</p>
                          <p className="text-gray-600">{vocab.definition}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                        <p className="text-gray-600 italic">"{vocab.example}"</p>
                      </div>
                    </div>
                    
                    {vocab.imageUrl && (
                      <img
                        src={vocab.imageUrl}
                        alt={vocab.word}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vocabulary terms yet</h3>
              <p className="text-gray-600 mb-4">This study set doesn't have any vocabulary terms.</p>
              {isOwner && (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Vocabulary Terms
                </button>
              )}
            </div>
          )}
        </div>

        {/* Study Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Study Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Flashcards:</strong> Great for memorizing word meanings and pronunciation</span>
            </div>
            <div className="flex items-start">
              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Quiz Mode:</strong> Test your knowledge with various question types</span>
            </div>
            <div className="flex items-start">
              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Regular Review:</strong> Come back daily to reinforce your learning</span>
            </div>
            <div className="flex items-start">
              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Practice Speaking:</strong> Use the pronunciation guide to improve speaking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySetDetail;