'use client';

import { QuizResult } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';

interface DetailedExplanationProps {
  result: QuizResult;
}

export default function DetailedExplanation({ result }: DetailedExplanationProps) {
  const sections = result.explanation.split('【').filter(s => s);
  
  return (
    <div className={`rounded-xl shadow-xl overflow-hidden ${
      result.isCorrect 
        ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400' 
        : 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400'
    }`}>
      {/* Header */}
      <div className={`p-4 ${
        result.isCorrect 
          ? 'bg-gradient-to-r from-green-500 to-green-600' 
          : 'bg-gradient-to-r from-red-500 to-red-600'
      }`}>
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          {result.isCorrect ? '🎉 正解！' : '❌ 不正解'}
          <span className="text-lg font-normal">
            (シャンテン数変化: {result.shantenChange >= 0 ? '+' : ''}{result.shantenChange})
          </span>
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
        {sections.map((section, index) => {
          const [title, ...content] = section.split('】\\n');
          const contentText = content.join('】\\n');
          
          return (
            <div key={index} className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
              <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 border-b pb-2">
                【{title}】
              </h4>
              <div className="text-gray-900 text-sm sm:text-base whitespace-pre-line">
                {contentText.split('\\n').map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-1">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Alternative choices with tile images */}
        {result.alternativeChoices.length > 0 && (
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 border-b pb-2">
              他の選択肢との比較
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {result.alternativeChoices.slice(0, 5).map((alt, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <MahjongTileImage tile={alt.tile} disabled={true} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm sm:text-base">
                      シャンテン数変化: {alt.shantenChange >= 0 ? '+' : ''}{alt.shantenChange}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800 break-words">{alt.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}