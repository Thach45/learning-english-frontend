import React from 'react';
import { Lightbulb, BookOpen as BookOpenIcon, PlusCircle, Speaker } from 'lucide-react';
import { AddVocabulary } from '../../types';

interface AddVocabularyFormProps {
  newVocab: AddVocabulary;
  setNewVocab: React.Dispatch<React.SetStateAction<AddVocabulary>>;
  partOfSpeechOptions: string[];
  selectedPartOfSpeech: string;
  setSelectedPartOfSpeech: React.Dispatch<React.SetStateAction<string>>;
  handleAutoFillVocabulary: () => void;
  addLoading: boolean;
  onSubmit: () => void;
  definitionMap: Record<string, string>;
}

const AddVocabularyForm: React.FC<AddVocabularyFormProps> = ({
  newVocab,
  setNewVocab,
  partOfSpeechOptions,
  selectedPartOfSpeech,
  setSelectedPartOfSpeech,
  handleAutoFillVocabulary,
  addLoading,
  onSubmit,
  definitionMap,
}) => {
  const [audioError, setAudioError] = React.useState('');
  const handlePlayAudio = () => {
    if (!newVocab.audioUrl) return;
    const audio = new Audio(newVocab.audioUrl);
    audio.onerror = () => setAudioError('Không phát được audio. Đường dẫn không hợp lệ hoặc file không tồn tại.');
    audio.onplay = () => setAudioError('');
    audio.play();
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <BookOpenIcon className="w-5 h-5 text-blue-500" />
        <span className="text-lg font-semibold text-gray-800">Add a new vocabulary</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">English word *</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="E.g. phone"
            value={newVocab.word}
            onChange={e => setNewVocab(v => ({ ...v, word: e.target.value }))}
            required
          />
        </div>
        <div className="flex items-end">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition disabled:opacity-60"
            onClick={handleAutoFillVocabulary}
            disabled={!newVocab.word}
            type="button"
          >
            <Lightbulb className="w-4 h-4" />
            Gợi ý tự động
          </button>
        </div>
      </div>
      {partOfSpeechOptions.length > 1 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm mb-2">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-blue-700">Select word type</span>
          </div>
          <select
            className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedPartOfSpeech}
            onChange={e => setSelectedPartOfSpeech(e.target.value)}
          >
            {partOfSpeechOptions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <div className="mt-2">
            <span className="text-xs text-blue-600">Definition for <b>{selectedPartOfSpeech}</b>:</span>
            <div className="p-3 bg-white border border-blue-100 rounded-lg mt-1 text-gray-700 font-mono text-sm shadow-inner">
              {definitionMap[selectedPartOfSpeech]}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vietnamese meaning *</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nghĩa tiếng Việt"
            value={newVocab.meaning}
            onChange={e => setNewVocab(v => ({ ...v, meaning: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="/fəʊ̯n/"
            value={newVocab.pronunciation}
            onChange={e => setNewVocab(v => ({ ...v, pronunciation: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Definition</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
            placeholder="English definition"
            value={newVocab.definition}
            onChange={e => setNewVocab(v => ({ ...v, definition: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Example</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Example sentence"
            value={newVocab.example}
            onChange={e => setNewVocab(v => ({ ...v, example: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
        <input
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="https://..."
          value={newVocab.imageUrl}
          onChange={e => setNewVocab(v => ({ ...v, imageUrl: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Audio (URL)</label>
        <div className="flex items-center gap-2">
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://..."
            value={newVocab.audioUrl}
            onChange={e => setNewVocab(v => ({ ...v, audioUrl: e.target.value }))}
          />
          {newVocab.audioUrl && (
            <button type="button" onClick={handlePlayAudio} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600">
              <Speaker className="w-5 h-5" />
            </button>
          )}
        </div>
        {audioError && <div className="text-xs text-red-500 mt-1">{audioError}</div>}
      </div>
      <button
        className="mt-6 w-full py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg transition disabled:opacity-60"
        onClick={onSubmit}
        disabled={addLoading || !newVocab.word || !newVocab.meaning}
        type="button"
      >
        <PlusCircle className="w-5 h-5" />
        {addLoading ? 'Adding...' : 'Add vocabulary'}
      </button>
    </div>
  );
};

export default AddVocabularyForm;
