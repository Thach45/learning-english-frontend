import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Brain, BookOpen, Edit, Share2, Users, Calendar, Globe, Lock, Star, X, Lightbulb, BookOpen as BookOpenIcon, PlusCircle, Speaker, Speech } from 'lucide-react';
import { AddVocabulary, StudySet, UpdateVocabulary, Vocabulary } from '../types';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AddVocabularyForm from '../components/pageStudySetDetail/AddVocabularyForm';



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

  useEffect(() => {
    // Simulate API call
    const loadStudySet = async () => {
      setLoading(true);
      const res = await api.get(`/study-sets/${id}`);
      console.log(res.data.data);
      setStudySet(res.data.data);
      setVocabularies(res.data.data.vocabularies);
      setLoading(false);
    };

    loadStudySet();
  }, [id, navigate]);

  const handleStartFlashcards = () => {
    navigate(`/learn/${id}/flashcards`);
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

  const handleAddVocabulary = async () => {
    setAddLoading(true);
    try {
      
      const res = await api.post(`/study-sets/${id}/vocabularies`, newVocab);
      
      setVocabularies((prev) => [...prev, res.data.data]);
      setShowAddVocabModal(false);
      setNewVocab({ word: '', meaning: '', pronunciation: '', definition: '', example: '', imageUrl: '' });
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
  const handleAutoFillVocabulary = async () => {
    if (!newVocab.word) return;
    try {
      const res = await api.get(`/vocabulary?word=${encodeURIComponent(newVocab.word)}`);
      const data = res.data.data || res.data;
      // Xử lý definition dạng "noun: ...; verb: ..."
      let posDefs: Record<string, string> = {};
      let posList: string[] = [];
      if (data.definition && data.definition.includes(':')) {
        const parts = data.definition.split(';').map((s: string) => s.trim()).filter(Boolean);
        parts.forEach((part: string) => {
          const [pos, ...defArr] = part.split(':');
          if (pos && defArr.length) {
            posDefs[pos.trim()] = defArr.join(':').trim();
            posList.push(pos.trim());
          }
        });
      }
      if (posList.length > 1) {
        setPartOfSpeechOptions(posList);
        setDefinitionMap(posDefs);
        setSelectedPartOfSpeech(posList[0]);
        setNewVocab(v => ({
          ...v,
          meaning: data.meaning || '',
          pronunciation: data.pronunciation || '',
          definition: posDefs[posList[0]] || '',
          example: data.example || '',
          audioUrl: data.audioUrl || '',
        }));
        setNotificationMessage(
          `Từ "${newVocab.word}" có nhiều dạng từ: ${posList.join(', ')}. Vui lòng chọn đúng loại từ!`
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        setPartOfSpeechOptions([]);
        setDefinitionMap({});
        setSelectedPartOfSpeech('');
        setNewVocab(v => ({
          ...v,
          meaning: data.meaning || '',
          pronunciation: data.pronunciation || '',
          definition: data.definition || '',
          example: data.example || '',
          audioUrl: data.audioUrl || '',
        }));
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
                  Updated {studySet.updatedAt.toLocaleString()}
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
                  {studySet.category.name}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Vocabulary Terms ({vocabularies.length})
            </h2>
            {isOwner && (
              <button
                onClick={() => setShowAddVocabModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                + Add Vocabulary
              </button>
            )}
          </div>
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
                        {vocab.audioUrl && (
                          <Speech 
                            className="w-4 h-4 text-blue-500 cursor-pointer"
                            onClick={() => handlePlayAudio(vocab.audioUrl || '')}
                          />
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
                  <div className="flex flex-col items-end ml-4 space-y-2">
                    {vocab.imageUrl && (
                      <img
                        src={vocab.imageUrl}
                        alt={vocab.word}
                        className="w-16 h-16 object-cover rounded-lg mb-2"
                      />
                    )}
                    {isOwner && (
                      <div className="flex space-x-2">
                        <button
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          onClick={() => handleEditVocab(vocab)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs text-red-700 disabled:opacity-60"
                          onClick={() => setDeleteConfirmVocab(vocab)}
                          disabled={deleteLoadingId === vocab.id}
                        >
                          {deleteLoadingId === vocab.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
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
                onClick={() => setShowAddVocabModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                + Add Vocabulary
              </button>
            )}
            </div>
          )}
        </div>

        {/* Add Vocabulary Modal */}
        {showAddVocabModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              {/* Notification UI */}
              {showNotification && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in z-50">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{notificationMessage}</span>
                </div>
              )}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddVocabModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
 
              <AddVocabularyForm
                newVocab={newVocab}
                setNewVocab={setNewVocab}
                partOfSpeechOptions={partOfSpeechOptions}
                selectedPartOfSpeech={selectedPartOfSpeech}
                setSelectedPartOfSpeech={setSelectedPartOfSpeech}
                handleAutoFillVocabulary={handleAutoFillVocabulary}
                addLoading={addLoading}
                onSubmit={handleAddVocabulary}
                definitionMap={definitionMap}
              />
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