import React from 'react';
import { Tag } from 'lucide-react';
import { PartOfSpeech } from '../../types';

interface PartOfSpeechTagsProps {
  mainPos: PartOfSpeech;
  alternativePos?: PartOfSpeech[];
  onSelectPos?: (pos: PartOfSpeech) => void;
  showIcon?: boolean;
}

const PartOfSpeechTags: React.FC<PartOfSpeechTagsProps> = ({
  mainPos,
  alternativePos = [],
  onSelectPos,
  showIcon = false
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="flex items-center gap-1">
        {showIcon && <Tag className="w-4 h-4 text-blue-500" />}
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {mainPos?.toLowerCase() || ''}
        </span>
      </div>
      
      {alternativePos.map(pos => (
        <div key={pos} className="flex items-center gap-1">
          {showIcon && <Tag className="w-4 h-4 text-purple-500" />}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full 
              ${onSelectPos 
                ? 'bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200' 
                : 'bg-gray-100 text-gray-700'
              }`}
            onClick={() => onSelectPos?.(pos)}
          >
            {pos.toLowerCase()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PartOfSpeechTags; 