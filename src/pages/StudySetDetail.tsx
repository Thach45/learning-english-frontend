import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Brain, BookOpen, Share2, Users, Calendar, Globe, Lock, Star, X, Lightbulb, BookOpen as BookOpenIcon, PlusCircle, Speaker, Speech, RotateCcw, Search, List, Grid, ChevronLeft, ChevronRight, Edit, Trash } from 'lucide-react';
import { AddVocabulary, StudySet, StudySetStats, UpdateVocabulary, Vocabulary, PartOfSpeech } from '../types';
import api, { fetchStudySetStats } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AddVocabularyForm from '../components/pageStudySetDetail/AddVocabularyForm';
import { motion } from 'framer-motion';
import VocabularyCard from '../components/pageStudySetDetail/VocabularyCard';


const StudySetDetail: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVocabModal, setShowAddVocabModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newVocab, setNewVocab] = useState<AddVocabulary>({
    word: '',
    meaning: '',
    pronunciation: '',
    definition: '',
    example: '',
    imageUrl: '',
    audioUrl: '',
    partOfSpeech: PartOfSpeech.OTHER,
    alternativePartOfSpeech: []
  });
  const [editVocab, setEditVocab] = useState<UpdateVocabulary | null>(null);
  const [showEditVocabModal, setShowEditVocabModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [deleteConfirmVocab, setDeleteConfirmVocab] = useState<Vocabulary | null>(null);
  // Thêm state cho notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  // Thêm state cho các loại từ khi có nhiều loại
  const [partOfSpeechOptions, setPartOfSpeechOptions] = useState<string[]>([]);
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('');
  const [definitionMap, setDefinitionMap] = useState<Record<string, string>>({});
  const [learningStats, setLearningStats] = useState<StudySetStats>({
    total: 0,
    learned: 0,
    needReview: 0,
    mastered: 0,
    allReview: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [studySetRes, statsRes] = await Promise.all([
          api.get(`/study-sets/${id}`),
          fetchStudySetStats(id || '')
        ]);
        
        setStudySet(studySetRes.data.data);
        setVocabularies(studySetRes.data.data.vocabularies);
        setLearningStats(statsRes);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    loadData();
  }, [id, navigate]);

  

  const handleStartQuiz = () => {
    navigate(`/learn/quiz?studySetId=${id}`);
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

  const handleAddVocabulary = async () => {
    setAddLoading(true);
    try {
      const { alternativePartOfSpeech, alternativeMeanings, ...rest } = newVocab;
      const res = await api.post(`/study-sets/${id}/vocabularies`, rest);
      
      setVocabularies((prev) => [...prev, res.data.data]);
      setShowAddVocabModal(false);
      setNewVocab({ word: '', meaning: '', pronunciation: '', definition: '', example: '', imageUrl: '', audioUrl: '', partOfSpeech: PartOfSpeech.OTHER, alternativePartOfSpeech: [] });
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || 'Thêm từ vựng thất bại.');
    }
    setAddLoading(false);
  };

  const handleEditVocab = (vocab: Vocabulary) => {
    setEditVocab(vocab);
    setShowEditVocabModal(true);
  };

  const handleUpdateVocab = async () => {
    if (!editVocab) return;
    setEditLoading(true);
    try {
      const updatedVocab = {
        word: editVocab.word,
        meaning: editVocab.meaning,
        pronunciation: editVocab.pronunciation,
        definition: editVocab.definition,
        example: editVocab.example,
        imageUrl: editVocab.imageUrl,
        audioUrl: editVocab.audioUrl,
        partOfSpeech: editVocab.partOfSpeech || PartOfSpeech.OTHER,
        alternativePartOfSpeech: editVocab.alternativePartOfSpeech || []
      }
      console.log("editVocab", updatedVocab);
      const res = await api.put(`/study-sets/${id}/vocabularies/${editVocab.id}`, updatedVocab);
      console.log(res);
      setVocabularies((prev) => prev.map(v => v.id === editVocab.id ? res.data.data : v));
      setShowEditVocabModal(false);
      setEditVocab(null);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Cập nhật từ vựng thất bại.');
    }
    setEditLoading(false);
  };

  const handleDeleteVocab = async () => {
    if (!deleteConfirmVocab) return;
    setDeleteLoadingId(deleteConfirmVocab.id);
    try {
      await api.delete(`/study-sets/${id}/vocabularies/${deleteConfirmVocab.id}`);
      setVocabularies((prev) => prev.filter(v => v.id !== deleteConfirmVocab.id));
      setDeleteConfirmVocab(null);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Xoá từ vựng thất bại.');
    }
    setDeleteLoadingId(null);
  };

  // Sửa lại hàm tự động điền từ API
  const handleAutoFillVocabulary = async (partOfSpeech?: PartOfSpeech) => {
    if (!newVocab.word) return;
    try {
      const queryParams = new URLSearchParams({
        word: newVocab.word
      });
      
      if (partOfSpeech) {
        queryParams.append('partOfSpeech', partOfSpeech);
      }

      const res = await api.get(`/vocabulary?${queryParams.toString()}`);
      const data = res.data.data || res.data;
      
      setNewVocab(v => ({
        ...v,
        meaning: data.meaning || '',
        pronunciation: data.pronunciation || '',
        definition: data.definition || '',
        example: data.example || '',
        audioUrl: data.audioUrl || '',
        cefrLevel: data.cefrLevel || '',
        partOfSpeech: data.partOfSpeech || PartOfSpeech.OTHER,
        alternativePartOfSpeech: data.alternativePartOfSpeech || []
      }));

      if (data.partOfSpeech) {
        setNotificationMessage(
          `Từ "${newVocab.word}" được xác định là ${data.partOfSpeech.toLowerCase()}`
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (err) {
      setNotificationMessage('Không lấy được gợi ý tự động!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };
  const handlePlayAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // Khi chọn loại từ, cập nhật definition
  useEffect(() => {
    if (selectedPartOfSpeech && definitionMap[selectedPartOfSpeech]) {
      setNewVocab(v => ({
        ...v,
        definition: definitionMap[selectedPartOfSpeech],
      }));
    }
  }, [selectedPartOfSpeech]);

  const handleStartLearning = () => {
    // Nếu số từ cần ôn tập bằng số từ đã học, tự động chuyển sang review mode
    const mode = learningStats.total === learningStats.allReview ? 'review' : 'practice';
    console.log("mode", mode);
    navigate(`/learn/${id}/flashcards?mode=${mode}`);
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

  const isOwner = studySet.author?.id === user?.id;

  const filteredVocabularies = vocabularies.filter(vocab => 
    vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vocab.definition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVocabularies.length / itemsPerPage);
  const paginatedVocabularies = filteredVocabularies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Top Section - Learning Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/study-sets')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Study Sets
          </button>
          
          
        </div>
        {/* Study Set Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-7 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-3xl">{studySet.title}</h1>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 mr-2" />    
                  </motion.button>
                 
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-4">{studySet.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
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
                  Updated {new Date(studySet.updatedAt).toLocaleDateString()}
                </div>

                {studySet.isPublic ? (
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </div>
                ) : (
                  <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </div>
                )}

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  studySet.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  studySet.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {studySet.level}
                </span>
                
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {studySet.category.name}
                </span>
              </div>

              {studySet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {studySet.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Learning Stats Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
              <div className="text-sm text-gray-500">
                Last studied: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Words */}
              <div className="bg-white rounded-xl p-4 border-l-4 border border-blue-500 border-l-blue-500 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <BookOpenIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    TOTAL
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-gray-800">{learningStats.total}</div>
                  <div className="text-sm text-blue-600 font-medium">Total Words</div>
                </div>
              </div>

              {/* All Review Words */}
              <div className="bg-white rounded-xl p-4 border-l-4 border border-indigo-500 border-l-indigo-500 hover:border-indigo-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="h-6 w-6 text-indigo-500" />
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    STUDIED
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-gray-800">{learningStats.allReview}</div>
                  <div className="text-sm text-indigo-600 font-medium">
                    {Math.round((learningStats.allReview / learningStats.total) * 100)}% Started
                  </div>
                </div>
              </div>

              {/* Mastered Words */}
              <div className="bg-white rounded-xl p-4 border-l-4 border border-purple-500 border-l-purple-500 hover:border-purple-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-6 w-6 text-purple-500" />
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    MASTERED
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-gray-800">{learningStats.mastered}</div>
                  <div className="text-sm text-purple-600 font-medium">
                    {Math.round((learningStats.mastered / learningStats.total) * 100)}% Complete
                  </div>
                </div>
              </div>

              {/* Learning Words */}
              <div className="bg-white rounded-xl p-4 border-l-4 border border-green-500 border-l-green-500 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="h-6 w-6 text-green-500" />
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    LEARNING
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-gray-800">{learningStats.learned}</div>
                  <div className="text-sm text-green-600 font-medium">In Progress</div>
                </div>
              </div>
            </div>

           
            {/* Need Review Alert */}
            {learningStats.needReview > 0 && (
              <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-100 p-2 rounded-lg">
                    <RotateCcw className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-amber-800">
                      You have <span className="font-semibold">{learningStats.needReview} words</span> that need review. 
                      Keep your memory fresh by reviewing them now!
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={handleStartLearning}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action when no reviews needed */}
            {learningStats.needReview === 0 && learningStats.total > 0 && learningStats.allReview > 0  && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-green-800">
                      Great job! You're all caught up. Want to learn some new words?
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={handleStartLearning}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Study Actions */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <button
                onClick={handleStartLearning}
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
        </div>
      </div>

      {/* Bottom Section - Vocabulary List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vocabulary Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Vocabulary Terms ({vocabularies.length})
              </h2>
              
              {/* Search and Controls */}
              <div className="flex flex-1 md:flex-none md:w-96 items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vocabulary..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setShowAddVocabModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    + Add Vocabulary
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {vocabularies.length > 0 ? (
              <motion.div 
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}
              >
                {paginatedVocabularies.map((vocab, index) => (
                  <VocabularyCard
                    key={vocab.id}
                    vocab={vocab}
                    index={index}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    viewMode={viewMode}
                    isOwner={isOwner}
                    deleteLoadingId={deleteLoadingId}
                    onEdit={handleEditVocab}
                    onDelete={setDeleteConfirmVocab}
                    onPlayAudio={handlePlayAudio}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vocabulary terms yet</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No results found. Try different search terms.' : 'This study set doesn\'t have any vocabulary terms.'}
                </p>
                {isOwner && !searchTerm && (
                  <button
                    onClick={() => setShowAddVocabModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    + Add Vocabulary
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-10 h-10 rounded-lg border font-medium
                        ${currentPage === page 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
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

      {/* Add Vocabulary Modal */}
      {showAddVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative">
            {/* Notification UI */}
            {showNotification && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in z-50">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{notificationMessage}</span>
              </div>
            )}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddVocabModal(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <AddVocabularyForm
                newVocab={newVocab}
                setNewVocab={setNewVocab}
                handleAutoFillVocabulary={handleAutoFillVocabulary}
                addLoading={addLoading}
                onSubmit={handleAddVocabulary}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Vocabulary Modal */}
      {showEditVocabModal && editVocab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowEditVocabModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit vocabulary</h3>
            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="English word *"
                value={editVocab.word}
                onChange={e => setEditVocab(v => v ? { ...v, word: e.target.value } : v)}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Vietnamese meaning *"
                value={editVocab.meaning}
                onChange={e => setEditVocab(v => v ? { ...v, meaning: e.target.value } : v)}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Pronunciation"
                value={editVocab.pronunciation}
                onChange={e => setEditVocab(v => v ? { ...v, pronunciation: e.target.value } : v)}
              />
              <div className="relative">
                <select
                  className="w-full border rounded pl-9 pr-3 py-2 appearance-none bg-white"
                  value={editVocab.cefrLevel || ''}
                  onChange={e => setEditVocab(v => v ? { ...v, cefrLevel: e.target.value } : v)}
                >
                  <option value="">Select CEFR level</option>
                  <option value="A1" className="text-green-700">A1 - Beginner</option>
                  <option value="A2" className="text-emerald-700">A2 - Elementary</option>
                  <option value="B1" className="text-blue-700">B1 - Intermediate</option>
                  <option value="B2" className="text-indigo-700">B2 - Upper Intermediate</option>
                  <option value="C1" className="text-purple-700">C1 - Advanced</option>
                  <option value="C2" className="text-pink-700">C2 - Mastery</option>
                </select>
                <Star className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  editVocab.cefrLevel ? 'text-yellow-500' : 'text-gray-400'
                }`} />
              </div>
              <select
                className="w-full border rounded px-3 py-2"
                value={editVocab.partOfSpeech || PartOfSpeech.OTHER}
                onChange={e => setEditVocab(v => v ? { ...v, partOfSpeech: e.target.value as PartOfSpeech } : v)}
              >
                {Object.values(PartOfSpeech).map(pos => (
                  <option key={pos} value={pos}>{pos.toLowerCase()}</option>
                ))}
              </select>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Definition"
                value={editVocab.definition}
                onChange={e => setEditVocab(v => v ? { ...v, definition: e.target.value } : v)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Example"
                value={editVocab.example}
                onChange={e => setEditVocab(v => v ? { ...v, example: e.target.value } : v)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Image (URL)"
                value={editVocab.imageUrl}
                onChange={e => setEditVocab(v => v ? { ...v, imageUrl: e.target.value } : v)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Audio (URL)"
                value={editVocab.audioUrl}
                onChange={e => setEditVocab(v => v ? { ...v, audioUrl: e.target.value } : v)}
              />
            </div>
            <button
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg disabled:opacity-60"
              onClick={handleUpdateVocab}
              disabled={editLoading || !editVocab.word || !editVocab.meaning}
            >
              {editLoading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmVocab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setDeleteConfirmVocab(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-red-600">Confirm delete vocabulary</h3>
            <p className="mb-6">Are you sure you want to delete the word <span className="font-semibold">"{deleteConfirmVocab.word}"</span> ? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setDeleteConfirmVocab(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                onClick={handleDeleteVocab}
                disabled={deleteLoadingId === deleteConfirmVocab.id}
              >
                {deleteLoadingId === deleteConfirmVocab.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySetDetail;