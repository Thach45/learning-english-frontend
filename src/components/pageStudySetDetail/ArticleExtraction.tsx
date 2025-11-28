import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Wand2,
  Plus,
  File as FileIcon,
  Trash2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadArticleFile, analyzeText } from '../../utils/upload';
import { bulkAddVocabularies } from '../../utils/api';
import useNotificationHelper from '../../utils/notification';


interface ExtractedWord {
  word: string;
  pronunciation: string;
  meaning: string;
  definition: string;
  example: string;
  audioUrl: string;
  cefrLevel: string;
  partOfSpeech: string;
  alternativePartOfSpeech: string[];
  isSelected: boolean;
}

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

const DEMO_TEXT = `
The concept of "sustainable development" has become a cornerstone of modern environmental policy. 
It advocates for economic growth that does not compromise the ability of future generations to meet their own needs. 
However, implementing these policies often faces significant hurdles. 
Governments must mitigate the adverse effects of industrialization while fostering innovation. 
Furthermore, ubiquitous plastic pollution poses a detrimental threat to marine ecosystems, requiring immediate and cohesive global action.
`;

interface ArticleExtractionProps {
  onClose?: () => void;
  studySetId?: string;
  onAddSuccess?: () => void;
}

// Helper: Highlight words in text
const highlightText = (text: string, words: ExtractedWord[]) => {
  if (!words.length || !text) return <span>{text}</span>;

  const colorClasses = [
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
  ];

  // Create regex pattern for all words with common variations
  const wordPatterns = words.map((w, idx) => {
    const baseWord = w.word.toLowerCase();
    // Match word with common suffixes (s, es, ed, ing, ion, etc.)
    return { word: baseWord, color: colorClasses[idx % colorClasses.length] };
  });

  // Build regex: \b(word1|word2|word3)(s|es|ed|ing|ion|ions)?\b
  const pattern = new RegExp(
    `\\b(${wordPatterns.map(w => w.word).join('|')})(s|es|ed|ing|ion|ions|tion|ment|ity|ly)?\\b`,
    'gi'
  );

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Find which word this matches
    const matchedText = match[0];
    const baseMatch = match[1].toLowerCase();
    const wordPattern = wordPatterns.find(w => baseMatch === w.word);

    if (wordPattern) {
      parts.push(
        <span
          key={match.index}
          className={`${wordPattern.color} px-1 rounded border-b-2 cursor-pointer hover:opacity-80 transition-opacity`}
          title={`Click to see details`}
        >
          {matchedText}
        </span>
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};

const ArticleExtraction: React.FC<ArticleExtractionProps> = ({ onClose, studySetId, onAddSuccess }) => {
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const [addingToStudySet, setAddingToStudySet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notify } = useNotificationHelper();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type.includes('pdf') ? 'PDF' : 'Image',
      });
      setInputText('');
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setInputText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setStep('processing');
    try {
      const response = await analyzeText(inputText);
      
      const extractedText = response?.text || inputText;
      const vocabulary = response?.vocabulary || [];
      
      if (!vocabulary.length) {
        alert('Không tìm thấy từ vựng nào trong text này!');
        setStep('input');
        return;
      }
      
      // Map vocabulary từ backend sang format của component
      const mappedWords: ExtractedWord[] = vocabulary.map((v: any) => ({
        word: v.word,
        pronunciation: v.pronunciation || '',
        meaning: v.meaning || '',
        definition: v.definition || '',
        example: v.example || '',
        audioUrl: v.audioUrl || '',
        cefrLevel: v.cefrLevel || 'UNKNOWN',
        partOfSpeech: v.partOfSpeech || '',
        alternativePartOfSpeech: v.alternativePartOfSpeech || [],
        isSelected: true, // Mặc định chọn tất cả
      }));
      
      setExtractedWords(mappedWords);
      setStep('result');
    } catch (error) {
      console.error('Analyze text failed', error);
      alert('Không thể phân tích text. Vui lòng thử lại!');
      setStep('input');
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setStep('processing');
    try {
      const response = await uploadArticleFile(file);

      const extractedText = response?.text || response?.text || '';
      const vocabulary = response?.vocabulary || [];
   
      if (!extractedText) {
        throw new Error('No text extracted from PDF');
      }
      
      setInputText(extractedText);
      
      // Map vocabulary từ backend sang format của component
      const mappedWords: ExtractedWord[] = vocabulary.map((v: any) => ({
        word: v.word,
        pronunciation: v.pronunciation || '',
        meaning: v.meaning || '',
        definition: v.definition || '',
        example: v.example || '',
        audioUrl: v.audioUrl || '',
        cefrLevel: v.cefrLevel || 'UNKNOWN',
        partOfSpeech: v.partOfSpeech || '',
        alternativePartOfSpeech: v.alternativePartOfSpeech || [],
        isSelected: true, // Mặc định chọn tất cả
      }));
      
      setExtractedWords(mappedWords);
      setStep('result');
    } catch (error) {
      console.error('Upload article failed', error);
      alert('Không thể trích xuất text từ file. Vui lòng thử lại!');
      setStep('input');
    }
  };

  const toggleSelection = (word: string) => {
    setExtractedWords(prev =>
      prev.map(w => (w.word === word ? { ...w, isSelected: !w.isSelected } : w)),
    );
  };

  const selectedCount = extractedWords.filter(w => w.isSelected).length;

  const handleAddToStudySet = async () => {
    if (!studySetId) {
      alert('Study Set ID không tồn tại!');
      return;
    }

    const selectedVocabs = extractedWords.filter(w => w.isSelected);
    if (selectedVocabs.length === 0) {
      alert('Vui lòng chọn ít nhất 1 từ vựng!');
      return;
    }

    setAddingToStudySet(true);
    try {
      // Map sang format AddVocabularyDto
      const vocabularies = selectedVocabs.map(v => ({
        word: v.word,
        meaning: v.meaning,
        pronunciation: v.pronunciation || '',
        definition: v.definition || '',
        example: v.example || '',
        audioUrl: v.audioUrl || '',
        partOfSpeech: v.partOfSpeech || 'OTHER',
        cefrLevel: v.cefrLevel !== 'UNKNOWN' ? v.cefrLevel : undefined,
      }));

      await bulkAddVocabularies(studySetId, vocabularies);
      notify.custom.success('Thành công', `Đã thêm ${vocabularies.length} từ vựng vào bộ học`);
      
      if (onAddSuccess) {
        onAddSuccess();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to add vocabularies:', error);
      alert(error.response?.data?.message || 'Không thể thêm từ vựng. Vui lòng thử lại!');
    } finally {
      setAddingToStudySet(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-5xl mx-auto flex flex-col md:h-[650px]">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Trích xuất từ vựng AI</h3>
            <p className="text-xs text-gray-500 font-medium">
              Hỗ trợ IELTS Reading, TOEIC Part 7, PDF &amp; Ảnh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step === 'result' && (
            <button
              onClick={() => {
                setStep('input');
                handleClearFile();
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Làm lại
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col p-6"
            >
              <div
                className={`flex-1 border-2 border-dashed rounded-2xl relative group transition-all duration-300 ${
                  uploadedFile
                    ? 'border-indigo-200 bg-indigo-50/30'
                    : 'border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {!uploadedFile ? (
                  <>
                    <textarea
                      className="w-full h-full bg-transparent p-8 resize-none outline-none text-gray-700 leading-relaxed placeholder:text-gray-400 z-10 relative"
                      placeholder="Dán văn bản tiếng Anh vào đây..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                    />
                    {!inputText && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-gray-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300">
                          <Upload className="w-8 h-8" />
                        </div>
                        <h4 className="text-gray-900 font-semibold text-lg mb-1">
                          Nhập văn bản hoặc Tải file
                        </h4>
                        <p className="text-gray-500 text-sm">Hỗ trợ PDF, PNG, JPG (Max 10MB)</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 flex items-center gap-4 max-w-md w-full mx-4"
                    >
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                        <FileIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 truncate">{uploadedFile.name}</h5>
                        <p className="text-xs text-gray-500">
                          {uploadedFile.size} • Đã sẵn sàng phân tích
                        </p>
                      </div>
                      <button
                        onClick={handleClearFile}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  </div>
                )}

                {!uploadedFile && (
                  <div className="absolute bottom-6 right-6 flex gap-3 z-20">
                    <button
                      onClick={() => {
                        setInputText(DEMO_TEXT);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                      Dán mẫu
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Tải tài liệu
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {inputText ? `${inputText.split(' ').length} từ` : '0 từ'}
                </div>
                <button
                  onClick={uploadedFile ? handleUploadAndAnalyze : handleAnalyze}
                  disabled={!inputText.trim() && !uploadedFile}
                  className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95 transform"
                >
                  <Wand2 className="w-5 h-5" />
                  {uploadedFile ? 'Upload file' : 'Phân tích ngay'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/30"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-20" />
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600 shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI đang phân tích tài liệu...</h3>
              <p className="text-gray-500 mb-8">
                Vui lòng đợi trong giây lát, chúng tôi đang tìm kiếm những từ vựng &quot;đắt&quot; nhất.
              </p>
              <div className="flex flex-col gap-3 text-sm text-gray-600 w-full max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {uploadedFile && (
                  <ProcessingStep
                    text={`Đang quét văn bản từ file ${uploadedFile.type}...`}
                    delay={0}
                  />
                )}
                <ProcessingStep
                  text="Loại bỏ từ thông dụng & ngữ pháp cơ bản..."
                  delay={uploadedFile ? 1 : 0}
                />
                <ProcessingStep
                  text="Xác định từ vựng Academic (Band 7.0+)..."
                  delay={uploadedFile ? 2 : 1}
                />
                <ProcessingStep
                  text="Trích xuất ngữ cảnh & nghĩa tiếng Việt..."
                  delay={uploadedFile ? 2.8 : 2}
                />
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Văn bản gốc
                  </h4>
                  {uploadedFile && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Source: {uploadedFile.name}
                    </span>
                  )}
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="prose prose-sm prose-indigo max-w-none text-gray-700 leading-8">
                    <div className="whitespace-pre-line font-serif text-base">
                      {highlightText(inputText, extractedWords)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-indigo-600" />
                      Từ vựng đề xuất
                    </h4>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      Đã chọn:{' '}
                      <span className="text-indigo-600 font-bold">
                        {selectedCount}/{extractedWords.length}
                      </span>
                    </span>
                    <button
                      onClick={() =>
                        setExtractedWords(prev => prev.map(w => ({ ...w, isSelected: true })))
                      }
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      Chọn tất cả
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                  {extractedWords.map((word, index) => (
                    <motion.div
                      key={word.word + index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => toggleSelection(word.word)}
                      className={`relative p-4 rounded-xl border transition-all cursor-pointer group bg-white ${
                        word.isSelected
                          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-100'
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xl text-gray-900 tracking-tight capitalize">
                              {word.word}
                            </h5>
                            {word.pronunciation && (
                              <span className="text-sm font-mono text-gray-500 bg-gray-100 px-1.5 rounded">
                                /{word.pronunciation}/
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                              {word.partOfSpeech}
                            </span>
                            {word.cefrLevel !== 'UNKNOWN' && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  word.cefrLevel === 'C2' || word.cefrLevel === 'C1'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {word.cefrLevel}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            word.isSelected
                              ? 'bg-indigo-600 border-indigo-600 scale-110'
                              : 'border-gray-300 bg-white group-hover:border-indigo-400'
                          }`}
                        >
                          {word.isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>

                      <p className="text-sm text-gray-800 font-medium mb-2 pl-1 border-l-2 border-indigo-100">
                        {word.meaning}
                      </p>

                      {word.definition && word.definition !== 'N/A' && (
                        <p className="text-xs text-gray-600 mb-2 italic">
                          {word.definition}
                        </p>
                      )}

                      {word.example && (
                        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed group-hover:bg-indigo-50/50 transition-colors">
                          <span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
                            Example:
                          </span>
                          {word.example}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                  <button 
                    onClick={handleAddToStudySet}
                    disabled={selectedCount === 0 || addingToStudySet}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {addingToStudySet ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Thêm {selectedCount} từ vào bộ học
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProcessingStep = ({ text, delay }: { text: string; delay: number }) => {
  const [status, setStatus] = useState<'waiting' | 'processing' | 'done'>('waiting');

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('processing'), delay * 1000);
    const timer2 = setTimeout(() => setStatus('done'), (delay + 0.8) * 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay]);

  return (
    <div className="flex items-center gap-3 h-6">
      <div className="w-4 flex items-center justify-center">
        {status === 'waiting' && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
        {status === 'processing' && (
          <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
        )}
        {status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
      </div>
      <span
        className={`transition-colors duration-300 ${
          status === 'waiting'
            ? 'text-gray-400'
            : status === 'processing'
            ? 'text-indigo-600 font-medium'
            : 'text-gray-700'
        }`}
      >
        {text}
      </span>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L14.3 8.2L20.5 10.5L14.3 12.8L12 19L9.7 12.8L3.5 10.5L9.7 8.2L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArticleExtraction;


