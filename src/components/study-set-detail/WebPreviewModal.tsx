import React from 'react';
import { X } from 'lucide-react';

interface WebPreviewModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const WebPreviewModal: React.FC<WebPreviewModalProps> = ({
  url,
  isOpen,
  onClose,
  title = 'Web Preview'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-[1000px] max-w-[90vw] h-[600px] max-h-[90vh] relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full rounded-b-xl"
            sandbox="allow-same-origin allow-scripts"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};

export default WebPreviewModal; 