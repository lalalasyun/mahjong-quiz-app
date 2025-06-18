'use client';

import { ProfessionalAnalysis } from '@/lib/professionalAnalysis';
import MahjongTileImage from './MahjongTileImage';

interface ProfessionalExplanationProps {
  result: ProfessionalAnalysis;
}

export default function ProfessionalExplanation({ result }: ProfessionalExplanationProps) {
  const sections = result.explanation.split('【').filter(s => s);
  
  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden ${
      result.isCorrect 
        ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-500' 
        : 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-6 ${
        result.isCorrect 
          ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
          : 'bg-gradient-to-r from-red-600 to-red-700'
      }`}>
        <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          {result.isCorrect ? '🎯 優秀！' : '📚 学習ポイント'}
          <span className="text-lg sm:text-xl font-normal bg-black bg-opacity-30 px-3 py-1 rounded">
            プロレベル解析
          </span>
        </h3>
      </div>
      
      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Tile Efficiency Comparison */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-xl sm:text-2xl mb-4 text-gray-900 flex items-center gap-2">
            🎯 牌効率比較
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Top 3 choices */}
            <div>
              <h5 className="font-semibold text-lg mb-3 text-gray-800">効率ランキング TOP3</h5>
              <div className="space-y-3">
                {result.tileEfficiencies.slice(0, 3).map((eff, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                    index === 0 ? 'bg-yellow-50 border-yellow-400' : 
                    index === 1 ? 'bg-gray-50 border-gray-300' : 
                    'bg-orange-50 border-orange-300'
                  }`}>
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-shrink-0">
                      <MahjongTileImage tile={eff.tile} disabled={true} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-base sm:text-lg text-gray-900">
                        スコア: {eff.score.toFixed(1)}点
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm text-gray-800">
                        <span>受け入れ: {eff.acceptanceTiles}枚</span>
                        <span>待ち質: {eff.waitQuality}/10</span>
                        <span>安全度: {eff.safetyLevel}/10</span>
                        <span>速度: {eff.speedRating}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Strategic Info */}
            <div>
              <h5 className="font-semibold text-lg mb-3 text-gray-800">戦略的判断</h5>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                  <h6 className="font-semibold text-blue-900 mb-2">手牌タイプ</h6>
                  <p className="text-blue-800 text-sm sm:text-base">{result.handType}</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-300 rounded-lg p-3">
                  <h6 className="font-semibold text-purple-900 mb-2">想定役</h6>
                  <p className="text-purple-800 text-sm sm:text-base">
                    {result.yaku.length > 0 ? result.yaku.join('、') : '平和・タンヤオなど'}
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                  <h6 className="font-semibold text-green-900 mb-2">戦略アドバイス</h6>
                  <p className="text-green-800 text-sm sm:text-base">{result.strategicAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Sections */}
        {sections.map((section, index) => {
          const [title, ...content] = section.split('】\\n');
          const contentText = content.join('】\\n');
          
          return (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-lg sm:text-xl mb-3 text-gray-900 border-b-2 border-gray-300 pb-2 flex items-center gap-2">
                {title.includes('プロレベル') && '🎓'}
                {title.includes('選択') && '🎯'}
                {title.includes('推奨') && '⭐'}
                {title.includes('評価') && '📊'}
                {title.includes('効率') && '⚡'}
                【{title}】
              </h4>
              <div className="text-gray-900 text-sm sm:text-base leading-relaxed">
                {contentText.split('\\n').map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Situational Factors */}
        {result.situationalFactors.length > 0 && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
            <h4 className="font-bold text-lg sm:text-xl mb-3 text-gray-900 border-b-2 border-gray-300 pb-2 flex items-center gap-2">
              🎮 局面要因
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.situationalFactors.map((factor, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Dangerous Discards Warning */}
        {result.dangerousDiscards.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-6 shadow-lg">
            <h4 className="font-bold text-lg sm:text-xl mb-3 text-red-900 flex items-center gap-2">
              ⚠️ 危険牌情報
            </h4>
            <div className="space-y-2">
              {result.dangerousDiscards.map((danger, index) => (
                <p key={index} className="text-red-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-red-600">🔸</span>
                  {danger}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}