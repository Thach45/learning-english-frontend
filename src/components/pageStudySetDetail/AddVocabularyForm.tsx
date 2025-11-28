import React from 'react';
import { Lightbulb, BookOpen as BookOpenIcon, PlusCircle, Speaker, Tag, RefreshCw, ExternalLink, Star } from 'lucide-react';
import { AddVocabulary, CefrLevel, PartOfSpeech } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import WebPreviewModal from './WebPreviewModal';

interface AddVocabularyFormProps {
  newVocab: AddVocabulary;
  setNewVocab: React.Dispatch<React.SetStateAction<AddVocabulary>>;
  handleAutoFillVocabulary: (partOfSpeech?: PartOfSpeech) => Promise<void>;
  addLoading: boolean;
  onSubmit: () => void;
}

const AddVocabularyForm: React.FC<AddVocabularyFormProps> = ({
  newVocab,
  setNewVocab,
  handleAutoFillVocabulary,
  addLoading,
  onSubmit,
}) => {
  const [audioError, setAudioError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'definition' | 'example'>('definition');
  const [tempDefinition, setTempDefinition] = React.useState(newVocab.definition || '');
  const [tempExample, setTempExample] = React.useState(newVocab.example || '');

  // Cập nhật temp state khi newVocab thay đổi từ bên ngoài
  React.useEffect(() => {
    setTempDefinition(newVocab.definition || '');
    setTempExample(newVocab.example || '');
  }, [newVocab.definition, newVocab.example]);

  // Thêm hàm xử lý submit để cập nhật giá trị cuối cùng
  const handleSubmit = () => {
    setNewVocab(v => ({ 
      ...v, 
      definition: tempDefinition,
      example: tempExample
    }));
    onSubmit();
  };

  const handlePlayAudio = () => {
    if (!newVocab.audioUrl) return;
    const audio = new Audio(newVocab.audioUrl);
    audio.onerror = () => setAudioError('Không phát được audio. Đường dẫn không hợp lệ hoặc file không tồn tại.');
    audio.onplay = () => setAudioError('');
    audio.play();
  };

  const handleSelectAlternative = (selectedPos: PartOfSpeech) => {
    // Gọi API với loại từ mới
    handleAutoFillVocabulary(selectedPos);
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const [webPreview, setWebPreview] = React.useState({
    isOpen: false,
    url: '',
    title: ''
  });

  // Thêm các URL cho từ điển và dịch thuật
  const dictionaryUrl = `https://dictionary.cambridge.org/vi/dictionary/english/${encodeURIComponent(newVocab.word)}`;

  const handleOpenDictionary = (url: string, title: string) => {
    setWebPreview({
      isOpen: true,
      url,
      title
    });
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Add New Vocabulary</h2>
        </div>
      </div>

      {/* Main Form */}
      <div className="space-y-6">
        {/* Word Input with Auto-fill */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">English word *</label>
            <div className="relative">
              <input
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg pr-24"
                placeholder="Enter a word..."
                value={newVocab.word}
                onChange={e => setNewVocab(v => ({ ...v, word: e.target.value }))}
                required
              />
              {newVocab.word && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <a
                    onClick={() => handleOpenDictionary(dictionaryUrl, newVocab.word)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    title="Open in Cambridge Dictionary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs">Cambridge</span>
                  </a>
                </div>
              )}
            </div>
           
          </div>
          <div className="flex items-end">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition disabled:opacity-60 text-base"
              onClick={() => handleAutoFillVocabulary()}
              disabled={!newVocab.word}
              type="button"
            >
              <Lightbulb className="w-5 h-5" />
              Auto Fill
            </button>
          </div>
        </div>

        {/* Part of Speech Selection */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpenIcon className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-blue-700">Part of Speech</span>
          </div>
          <select
            className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg bg-white"
            value={newVocab.partOfSpeech}
            onChange={e => setNewVocab(v => ({ ...v, partOfSpeech: e.target.value as PartOfSpeech }))}
          >
            {Object.values(PartOfSpeech).map(pos => (
              <option key={pos} value={pos}>{pos.toLowerCase()}</option>
            ))}
          </select>

          {/* Alternative Parts of Speech */}
          {newVocab.alternativePartOfSpeech.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Alternative Parts of Speech</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {newVocab.alternativePartOfSpeech.map(pos => (
                  <button
                    key={pos}
                    onClick={() => handleSelectAlternative(pos)}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-1"
                  >
                    {pos.toLowerCase()}
                    <RefreshCw className="w-3 h-3" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-600 mt-2">
                Click to switch meaning
              </p>
            </div>
          )}
        </div>

        {/* Vietnamese Meaning, Pronunciation and CEFR Level */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vietnamese meaning * 
              <span className="text-xs text-gray-500 ml-1">
                (for {newVocab.partOfSpeech.toLowerCase()})
              </span>
            </label>
            <input
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              placeholder="Nghĩa tiếng Việt"
              value={newVocab.meaning}
              onChange={e => setNewVocab(v => ({ ...v, meaning: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
            <input
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-mono"
              placeholder="/fəʊ̯n/"
              value={newVocab.pronunciation}
              onChange={e => setNewVocab(v => ({ ...v, pronunciation: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
            <div className="relative">
              <select
                className="w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white appearance-none"
                value={newVocab.cefrLevel || ''}
                onChange={e => setNewVocab(v => ({ ...v, cefrLevel: e.target.value as CefrLevel }))}
              >
                <option value="">Select level</option>
                <option value={CefrLevel.A1} className="text-green-700">A1 - Beginner</option>
                <option value={CefrLevel.A2} className="text-emerald-700">A2 - Elementary</option>
                <option value={CefrLevel.B1} className="text-blue-700">B1 - Intermediate</option>
                <option value={CefrLevel.B2} className="text-indigo-700">B2 - Upper Intermediate</option>
                <option value={CefrLevel.C1} className="text-purple-700">C1 - Advanced</option>
                <option value={CefrLevel.C2} className="text-pink-700">C2 - Mastery</option>
              </select>
              <Star className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                newVocab.cefrLevel ? 'text-yellow-500' : 'text-gray-400'
              }`} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {newVocab.cefrLevel && (
              <div className="mt-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  newVocab.cefrLevel === CefrLevel.A1 ? 'bg-green-100 text-green-800' :
                  newVocab.cefrLevel === CefrLevel.A2 ? 'bg-emerald-100 text-emerald-800' :
                  newVocab.cefrLevel === CefrLevel.B1 ? 'bg-blue-100 text-blue-800' :
                  newVocab.cefrLevel === CefrLevel.B2 ? 'bg-indigo-100 text-indigo-800' :
                  newVocab.cefrLevel === CefrLevel.C1 ? 'bg-purple-100 text-purple-800' :
                  newVocab.cefrLevel === CefrLevel.C2 ? 'bg-pink-100 text-pink-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <Star className="w-3 h-3 mr-1" />
                  {newVocab.cefrLevel}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Definition and Example Tabs */}
        <div className="border rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'definition'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('definition')}
              type="button"
            >
              Definition
            </button>
            <button
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === 'example'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('example')}
              type="button"
            >
              Example
            </button>
          </div>
          <div className="p-4">
            <div className={activeTab === 'definition' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">English Definition</label>
              <ReactQuill
                theme="snow"
                value={newVocab.definition || ''}
                onChange={value => setNewVocab(v => ({ ...v, definition: value }))}
                modules={quillModules}
                placeholder="Enter the English definition..."
                className="h-32"
              />
            </div>
            <div className={activeTab === 'example' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Example Sentence</label>
              <ReactQuill
                theme="snow"
                value={newVocab.example || ''}
                onChange={value => setNewVocab(v => ({ ...v, example: value }))}
                modules={quillModules}
                placeholder="Enter an example sentence..."
                className="h-32"
              />
            </div>
          </div>
        </div>

        {/* Media URLs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://..."
              value={newVocab.imageUrl}
              onChange={e => setNewVocab(v => ({ ...v, imageUrl: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://..."
                value={newVocab.audioUrl}
                onChange={e => setNewVocab(v => ({ ...v, audioUrl: e.target.value }))}
              />
              {newVocab.audioUrl && (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="px-4 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600"
                >
                  <Speaker className="w-5 h-5" />
                </button>
              )}
            </div>
            {audioError && <div className="text-xs text-red-500 mt-1">{audioError}</div>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-4 mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg transition disabled:opacity-60"
        onClick={handleSubmit}
        disabled={addLoading || !newVocab.word || !newVocab.meaning}
        type="button"
      >
        <PlusCircle className="w-6 h-6" />
        {addLoading ? 'Adding...' : 'Add vocabulary'}
      </button>

      {/* Web Preview Modal */}
      <WebPreviewModal
        isOpen={webPreview.isOpen}
        url={webPreview.url}
        title={webPreview.title}
        onClose={() => setWebPreview(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AddVocabularyForm;
