import React from 'react';
import { Sparkles, PenSquare, Newspaper, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

export type VocabCreationMode = 'manual' | 'ai' | 'article';

interface ModeConfig {
  id: VocabCreationMode;
  label: string;
  description: string;
  helper: string;
  cta: string;
  badge?: string;
  badgeColor?: string;
  icon: typeof Sparkles;
  suitableFor: string;
  targetAudience: string;
}

interface OptionalAddVocabProps {
  selectedMode: VocabCreationMode | null;
  onSelect: (mode: VocabCreationMode) => void;
  onClose?: () => void;
}

const modeConfigs: ModeConfig[] = [
  {
    id: 'ai',
    label: 'Tạo bằng AI',
    description: 'Nhập vài gợi ý, AI sẽ đề xuất danh sách từ phù hợp với chủ đề.',
    helper: 'Tốc độ cao',
    cta: 'Thử Demo',
    badge: 'Beta',
    badgeColor: 'bg-purple-100 text-purple-700',
    icon: Sparkles,
    suitableFor: 'Cần ý tưởng nhanh, mở rộng vốn từ theo topic.',
    targetAudience: 'Người bận rộn, bí ý tưởng.',
  },
  {
    id: 'manual',
    label: 'Thủ công',
    description: 'Tự nhập từng từ với nghĩa, phát âm, ví dụ và chi tiết khác.',
    helper: 'Chính xác 100%',
    cta: 'Nhập từ',
    icon: PenSquare,
    suitableFor: 'Muốn ghi chú chi tiết, kiểm soát nội dung.',
    targetAudience: 'Người học tỉ mỉ, thích tự soạn.',
  },
  {
    id: 'article',
    label: 'Trích từ báo',
    description: 'Dán link hoặc tải nội dung, hệ thống sẽ lọc từ theo ngữ cảnh.',
    helper: 'Học ngữ cảnh',
    cta: 'Khám phá',
    badge: 'Soon',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: Newspaper,
    suitableFor: 'Học từ vựng qua văn bản thực tế, tin tức.',
    targetAudience: 'Trình độ trung cấp trở lên.',
  },
];

const OptionalAddVocab: React.FC<OptionalAddVocabProps> = ({ selectedMode, onSelect, onClose }) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {onClose && (
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      )}
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-blue-600"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Phương thức tạo</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
            Linh hoạt theo nhu cầu
          </h3>
          <p className="text-gray-500 mt-2 max-w-xl">
            Giao diện được thiết kế tối ưu cho trải nghiệm người dùng, giúp bạn dễ dàng lựa chọn cách học phù hợp nhất.
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-white border border-gray-200 pl-1 pr-4 py-1 shadow-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
            V2
          </span>
          <span className="text-xs font-medium text-gray-600">Prototype Mode</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {modeConfigs.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <motion.div
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              whileHover={{ y: -4 }}
              className={`
                relative flex flex-col h-full cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300
                ${isSelected
                  ? 'border-blue-500 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10'
                  : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-gray-200/50'
                }
              `}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  rounded-xl p-3 transition-colors duration-300
                  ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'}
                `}>
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                
                {mode.badge && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${mode.badgeColor || 'bg-gray-100 text-gray-600'}`}>
                    {mode.badge}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col gap-1 mb-3">
                  <h4 className={`text-lg font-bold transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                    {mode.label}
                  </h4>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600/80">
                    {mode.helper}
                  </p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {mode.description}
                </p>

                {/* Suitability Info - Note Style with Bullet Points */}
                <div className="mt-auto">
                   <div className={`
                     rounded-lg p-3 text-xs leading-relaxed transition-colors
                     ${isSelected 
                       ? 'bg-blue-50 text-blue-900 border border-blue-100' 
                       : 'bg-gray-50 text-gray-600 border border-gray-100'
                     }
                   `}>
                     <div className="flex items-center gap-1.5 mb-2 font-semibold opacity-90">
                       <Info className="w-3.5 h-3.5" />
                       <span>Gợi ý sử dụng:</span>
                     </div>
                     <ul className="list-disc pl-4 space-y-1 opacity-85 marker:text-current">
                       <li>
                         <span className="font-medium opacity-75 mr-1">Tình huống:</span>
                         {mode.suitableFor}
                       </li>
                       <li>
                         <span className="font-medium opacity-75 mr-1">Dành cho:</span>
                         {mode.targetAudience}
                       </li>
                     </ul>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionalAddVocab;