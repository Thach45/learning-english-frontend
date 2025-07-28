import React from 'react';
import DictionaryHoverTooltip from './DictionaryHoverTooltip';

const DictionaryDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dictionary Tooltip Demo</h1>
      
      <div className="prose prose-lg">
        <p className="text-gray-700 leading-relaxed">
          Hover over the word <DictionaryHoverTooltip word="address">address</DictionaryHoverTooltip> to see the dictionary tooltip. 
          You can also try hovering over <DictionaryHoverTooltip word="conduct">conduct</DictionaryHoverTooltip> or 
          <DictionaryHoverTooltip word="beautiful"> beautiful</DictionaryHoverTooltip> to test different words.
        </p>
        
        <p className="text-gray-700 leading-relaxed mt-4">
          The tooltip will show three options: English-English dictionary, English-Vietnamese dictionary, and add to flashcard. 
          Click on any option to see the detailed dictionary information.
        </p>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use:</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Hover over any highlighted word for 300ms</li>
            <li>• Click the globe icon for English-English dictionary</li>
            <li>• Click the languages icon for English-Vietnamese dictionary</li>
            <li>• Click the plus icon to add to flashcard (coming soon)</li>
            <li>• Use the audio button to hear pronunciation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DictionaryDemo; 