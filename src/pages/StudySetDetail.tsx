import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Users, Calendar, Globe, Lock, Star, X, Search, List, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddVocabulary, StudySet, StudySetStats, UpdateVocabulary, Vocabulary, PartOfSpeech, CefrLevel } from '../types';
import api, { fetchStudySetStats } from '../config/api';
import { useAuth } from '../context/AuthContext';
import AddVocabularyForm from '../components/study-set-detail/AddVocabularyForm';
import OptionalAddVocab, { VocabCreationMode } from '../components/study-set-detail/OptionalAddVocab';
import AIVocabularySuggestions from '../components/study-set-detail/AIVocabularySuggestions';
import ArticleExtraction from '../components/study-set-detail/ArticleExtraction';
import { motion } from 'framer-motion';
import { LearningProgressCard } from '../components/study-set-detail/LearningProgressCard';
import StartLearnModeModal from '../components/study-set-detail/StartLearnModeModal';
import StartQuizModeModal from '../components/study-set-detail/StartQuizModeModal';
import type { StudyLearnMode, QuizMode } from '../components/study-set-detail/studySetModes';
import VocabularyCard from '../components/study-set-detail/VocabularyCard';
import { useNotificationHelper } from '../config/notification';

const StudySetDetail: React.FC = () => {
  const { notify } = useNotificationHelper();
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
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('');
  const [definitionMap, setDefinitionMap] = useState<Record<string, string>>({});
  const [learningStats, setLearningStats] = useState<StudySetStats>({
    total: 0,
    review: 0,
    needReview: 0,
    mastered: 0,
   
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [creationMode, setCreationMode] = useState<VocabCreationMode | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Vocabulary[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [addingSelected, setAddingSelected] = useState(false);
  const itemsPerPage = 5;

  const [showStartLearnModeModal, setShowStartLearnModeModal] = useState(false);
  const [selectedStartLearnMode, setSelectedStartLearnMode] = useState<StudyLearnMode>('practice');

  const openStartLearnModeModal = () => setShowStartLearnModeModal(true);
  const closeStartLearnModeModal = () => setShowStartLearnModeModal(false);

  const [showStartQuizModeModal, setShowStartQuizModeModal] = useState(false);
  const [selectedStartQuizMode, setSelectedStartQuizMode] = useState<QuizMode>('multiple_choice');

  const openStartQuizModeModal = () => setShowStartQuizModeModal(true);
  const closeStartQuizModeModal = () => setShowStartQuizModeModal(false);

  const handleCloseModal = () => {
    setShowAddVocabModal(false);
    setCreationMode(null);
    setAiSuggestions([]);
  };

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
      notify.custom.error('Lỗi', 'Không thể tải thông tin study set');
    }
    setLoading(false);
  };
  useEffect(() => {

    loadData();
  }, [id, navigate]);

  

  const handleStartQuiz = (quizMode: QuizMode) => {
    navigate(`/learn/quiz?studySetId=${id}&mode=${quizMode}`);
  };



  const handleShare = () => {
    const shareUrl = `${window.location.origin}/study-sets/${id}`;
    const shareText = `Xem bộ học: "${studySet?.title}" với ${vocabularies.length} từ vựng!`;
    
    if (navigator.share) {
      navigator.share({
        title: studySet?.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      notify.studySetLinkCopied();
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
      notify.vocabularyAdded();
      loadData();
    } catch (error: any) {
      notify.vocabularyAddFailed(error?.response?.data?.message);
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
        cefrLevel: editVocab.cefrLevel || CefrLevel.UNKNOWN,
      }
      console.log("updatedVocab", updatedVocab);
      const res = await api.put(`/study-sets/${id}/vocabularies/${editVocab.id}`, updatedVocab);
      
  
      setVocabularies((prev) => prev.map(v => v.id === editVocab.id ? res.data.data : v));
      setShowEditVocabModal(false);
      setEditVocab(null);
      notify.vocabularyUpdated();
    } catch (error: any) {
      notify.vocabularyUpdateFailed(error?.response?.data?.message);
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
      notify.vocabularyDeleted();
      loadData();
    } catch (error: any) {
      notify.vocabularyDeleteFailed(error?.response?.data?.message);
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
        cefrLevel: data.cefrLevel || CefrLevel.UNKNOWN,
        partOfSpeech: data.partOfSpeech || PartOfSpeech.OTHER,
        alternativePartOfSpeech: data.alternativePartOfSpeech || []
      }));

      if (data.partOfSpeech) {
        notify.custom.info(
          'Tự động điền thành công', 
          `Từ "${newVocab.word}" được xác định là ${data.partOfSpeech.toLowerCase()}`
        );
      }
    } catch (err) {
      notify.autoSuggestionFailed();
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

  const handleCreationModeInfo = async (mode: VocabCreationMode) => {
    if (mode === 'ai') {
      setAiLoading(true);
      try {
        const res = await api.post(`/vocabulary/generate/ai`, {
          idStudySet: id,
        });
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
          setAiSuggestions(data);
        } else {
          notify.custom.error('Lỗi', 'Không thể tải đề xuất từ AI');
        }
      } catch (error: any) {
        notify.custom.error('Lỗi', error?.response?.data?.message || 'Không thể tải đề xuất từ AI');
        setAiSuggestions([]);
      } finally {
        setAiLoading(false);
      }
    }

    if (mode === 'article') {
      notify.custom.info(
        'Trích từ bài báo',
        'Bạn có thể kết nối service NLP để phân tích bài viết và chọn ra từ vựng nổi bật.'
      );
    }
  };

  const handleCreationModeSelect = (mode: VocabCreationMode) => {
    setCreationMode(mode);
    if (mode !== 'manual') {
      handleCreationModeInfo(mode);
    }
  };

  const handleOpenAddVocabulary = () => {
    setCreationMode(null);
    setAiSuggestions([]);
    setShowAddVocabModal(true);
  };

  const handleAddSelectedVocabularies = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;
    
    setAddingSelected(true);
    try {
      const selectedVocabs = aiSuggestions.filter((v) => selectedIds.includes((v as any).id || v.word));
      
      // Prepare vocabularies array for bulk add
      const vocabularies = selectedVocabs.map((vocab) => ({
        word: vocab.word,
        meaning: vocab.meaning,
        pronunciation: vocab.pronunciation || '',
        definition: vocab.definition || '',
        example: vocab.example || '',
        imageUrl: vocab.imageUrl || '',
        audioUrl: vocab.audioUrl || '',
        partOfSpeech: vocab.partOfSpeech || PartOfSpeech.OTHER,
       
      }));

      // Bulk add in single request
      const res = await api.post(`/study-sets/${id}/vocabularies/bulk`, {
        vocabularies,
      });
      
      // Remove added vocabularies from suggestions
      setAiSuggestions((prev) => prev.filter((v) => !selectedIds.includes((v as any).id || v.word)));
      
      const addedCount = res.data?.data?.success || selectedVocabs.length;
      notify.custom.success('Thành công', `Đã thêm ${addedCount} từ vựng vào bộ học`);
      loadData();
    } catch (error: any) {
      notify.vocabularyAddFailed(error?.response?.data?.message || 'Không thể thêm từ vựng');
    } finally {
      setAddingSelected(false);
    }
  };

  const handleStartLearning = (studyMode: StudyLearnMode) => {
    navigate(`/learn/${id}/flashcards?mode=${studyMode}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bộ học...</p>
        </div>
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bộ học</h2>
          <p className="text-gray-600 mb-4">Bộ học bạn tìm không tồn tại.</p>
          <button
            onClick={() => navigate('/study-sets')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Quay lại Học phần
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
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/study-sets')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại Học phần
          </button>
        </div>

        {/* Thông tin học phần — tách riêng khỏi tiến độ học */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{studySet.title}</h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  type="button"
                  className="flex shrink-0 items-center self-start rounded-lg px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                  aria-label="Chia sẻ"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                </motion.button>
              </div>

              <p className="mb-4 text-lg text-gray-600">{studySet.description}</p>

              <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="mr-1 h-4 w-4 shrink-0" />
                  {vocabularies.length} từ
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-1 h-4 w-4 shrink-0" />
                  {isOwner ? 'Do bạn tạo' : 'Do người khác tạo'}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-1 h-4 w-4 shrink-0" />
                  Cập nhật {new Date(studySet.updatedAt).toLocaleDateString()}
                </div>

                {studySet.isPublic ? (
                  <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                    <Globe className="mr-1 h-3 w-3" />
                    Công khai
                  </div>
                ) : (
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                    <Lock className="mr-1 h-3 w-3" />
                    Riêng tư
                  </div>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    studySet.level === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : studySet.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {studySet.level}
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  {studySet.category.name}
                </span>
              </div>

              {studySet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {studySet.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="cursor-pointer rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tiến độ học — card riêng, cùng lề với khối trên & danh sách từ */}
        <LearningProgressCard
          learningStats={learningStats}
          onStartLearning={openStartLearnModeModal}
          onStartQuiz={openStartQuizModeModal}
        />
      </div>

      {/* Bottom Section - Vocabulary List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vocabulary Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Từ vựng ({vocabularies.length})
              </h2>
              
              {/* Search and Controls */}
              <div className="flex flex-1 md:flex-none md:w-96 items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm từ vựng..."
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
                  <>
                    <button
                      onClick={handleOpenAddVocabulary}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      + Thêm từ vựng
                    </button>
                    

                  </>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có từ vựng nào</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Không tìm thấy. Thử từ khóa khác.' : 'Bộ học này chưa có từ vựng.'}
                </p>
                {isOwner && !searchTerm && (
                  <button
                    onClick={handleOpenAddVocabulary}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    + Thêm từ vựng
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Mẹo học</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start">
                <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Thẻ ghi nhớ:</strong> Giúp ghi nhớ nghĩa và phát âm từ vựng</span>
              </div>
              <div className="flex items-start">
                <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Chế độ Quiz:</strong> Kiểm tra kiến thức với nhiều dạng câu hỏi</span>
              </div>
              <div className="flex items-start">
                <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Ôn tập đều:</strong> Học mỗi ngày để củng cố kiến thức</span>
              </div>
              <div className="flex items-start">
                <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Luyện nói:</strong> Dùng hướng dẫn phát âm để cải thiện kỹ năng nói</span>
              </div>
            </div>
          </div>
      </div>

      {showAddVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="w-full max-w-5xl mx-auto">
            {!creationMode && (
              <OptionalAddVocab
                selectedMode={creationMode}
                onSelect={handleCreationModeSelect}
                onClose={handleCloseModal}
              />
            )}

            {creationMode === 'manual' && (
              <div className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={handleCloseModal}
            >
                  <X className="w-5 h-5" />
            </button>
              <AddVocabularyForm
                newVocab={newVocab}
                setNewVocab={setNewVocab}
                handleAutoFillVocabulary={handleAutoFillVocabulary}
                addLoading={addLoading}
                onSubmit={handleAddVocabulary}
              />
            </div>
            )}

            {creationMode === 'ai' && (
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
                <AIVocabularySuggestions
                  suggestions={aiSuggestions}
                  loading={aiLoading}
                  onAddSelected={handleAddSelectedVocabularies}
                  onPlayAudio={handlePlayAudio}
                  adding={addingSelected}
                  onClose={handleCloseModal}
                />
              </div>
            )}

            {creationMode === 'article' && (
              <ArticleExtraction 
                onClose={handleCloseModal} 
                studySetId={id}
                onAddSuccess={loadData}
              />
            )}
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
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa từ vựng</h3>
            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Từ tiếng Anh *"
                value={editVocab.word}
                onChange={e => setEditVocab(v => v ? { ...v, word: e.target.value } : v)}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nghĩa tiếng Việt *"
                value={editVocab.meaning}
                onChange={e => setEditVocab(v => v ? { ...v, meaning: e.target.value } : v)}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Phát âm"
                value={editVocab.pronunciation}
                onChange={e => setEditVocab(v => v ? { ...v, pronunciation: e.target.value } : v)}
              />
              <div className="relative">
                <select
                  className="w-full border rounded pl-9 pr-3 py-2 appearance-none bg-white"
                  value={editVocab.cefrLevel || ''}
                  onChange={e => setEditVocab(v => v ? { ...v, cefrLevel: e.target.value as CefrLevel } : v)}
                >
                  <option value="">Chọn trình độ CEFR</option>
                  <option value={CefrLevel.A1} className="text-green-700">A1 - Sơ cấp</option>
                  <option value={CefrLevel.A2} className="text-emerald-700">A2 - Cơ bản</option>
                  <option value={CefrLevel.B1} className="text-blue-700">B1 - Trung cấp</option>
                  <option value={CefrLevel.B2} className="text-indigo-700">B2 - Trung cao cấp</option>
                  <option value={CefrLevel.C1} className="text-purple-700">C1 - Cao cấp</option>
                  <option value={CefrLevel.C2} className="text-pink-700">C2 - Thành thạo</option>
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
                placeholder="Định nghĩa"
                value={editVocab.definition}
                onChange={e => setEditVocab(v => v ? { ...v, definition: e.target.value } : v)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Ví dụ"
                value={editVocab.example}
                onChange={e => setEditVocab(v => v ? { ...v, example: e.target.value } : v)}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Ảnh (URL)"
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
              {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      )}

      <StartLearnModeModal
        open={showStartLearnModeModal}
        onClose={closeStartLearnModeModal}
        selectedMode={selectedStartLearnMode}
        onSelectMode={setSelectedStartLearnMode}
        onStart={() => {
          handleStartLearning(selectedStartLearnMode);
          closeStartLearnModeModal();
        }}
      />

      <StartQuizModeModal
        open={showStartQuizModeModal}
        onClose={closeStartQuizModeModal}
        selectedMode={selectedStartQuizMode}
        onSelectMode={setSelectedStartQuizMode}
        onStart={() => {
          handleStartQuiz(selectedStartQuizMode);
          closeStartQuizModeModal();
        }}
      />

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
            <h3 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa từ vựng</h3>
            <p className="mb-6">Bạn có chắc muốn xóa từ <span className="font-semibold">"{deleteConfirmVocab.word}"</span>? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setDeleteConfirmVocab(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                onClick={handleDeleteVocab}
                disabled={deleteLoadingId === deleteConfirmVocab.id}
              >
                {deleteLoadingId === deleteConfirmVocab.id ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySetDetail;