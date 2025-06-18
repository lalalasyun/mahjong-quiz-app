'use client';

import { useState, useEffect } from 'react';
import { Tile, GameMode } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';
import OpponentHand from './OpponentHand';
import DiscardArea from './DiscardArea';
import { generateHand } from '@/lib/tileGeneration';

interface EnhancedGameTableProps {
  hand: Tile[];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
  turn: number;
}

export default function EnhancedGameTable({ 
  hand, 
  selectedTile, 
  onTileClick, 
  disabled, 
  mode, 
  turn 
}: EnhancedGameTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [discards, setDiscards] = useState<{
    top: Tile[];
    left: Tile[];
    right: Tile[];
    bottom: Tile[];
  }>({ top: [], left: [], right: [], bottom: [] });

  useEffect(() => {
    setIsClient(true);
    
    // より現実的な捨て牌シミュレーション
    const generateRealisticDiscards = (playerIndex: number, seed: number) => {
      // シードベースの疑似ランダム生成
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      
      // 巡目に応じた現実的な捨て牌数
      // 各プレイヤーは毎巡1枚ずつ捨てるので、大体turn-1から turn+2の範囲
      const baseDiscardCount = Math.max(1, turn - 2);
      const variation = Math.floor(random() * 4) - 1; // -1 to +2の変動
      const discardCount = Math.max(1, Math.min(18, baseDiscardCount + variation));
      
      // より多様な牌を含む捨て牌を生成
      const availableTiles = generateHand(mode, 1); // 基本的な牌セット
      const discardedTiles: Tile[] = [];
      
      // 字牌を優先的に捨てるシミュレーション（序盤）
      if (turn <= 6) {
        const honorTiles = availableTiles.filter(t => t.type === 'honor');
        const shuffledHonors = honorTiles.sort(() => random() - 0.5);
        const honorCount = Math.min(Math.floor(discardCount * 0.4), shuffledHonors.length);
        discardedTiles.push(...shuffledHonors.slice(0, honorCount));
      }
      
      // 端牌を捨てるシミュレーション
      const edgeTiles = availableTiles.filter(t => 
        t.type !== 'honor' && (t.number === 1 || t.number === 9)
      );
      const shuffledEdges = edgeTiles.sort(() => random() - 0.5);
      const edgeCount = Math.min(Math.floor(discardCount * 0.3), shuffledEdges.length);
      discardedTiles.push(...shuffledEdges.slice(0, edgeCount));
      
      // 残りは中張牌
      const middleTiles = availableTiles.filter(t => 
        t.type !== 'honor' && t.number! >= 2 && t.number! <= 8
      );
      const shuffledMiddles = middleTiles.sort(() => random() - 0.5);
      const remainingCount = Math.max(0, discardCount - discardedTiles.length);
      discardedTiles.push(...shuffledMiddles.slice(0, remainingCount));
      
      // IDを一意にする
      return discardedTiles.slice(0, discardCount).map((tile, index) => ({
        ...tile,
        id: `discard-${playerIndex}-${index}-${tile.id}`
      }));
    };

    setDiscards({
      top: generateRealisticDiscards(1, turn * 1000 + 1),
      left: generateRealisticDiscards(2, turn * 1000 + 2),
      right: mode === '4players' ? generateRealisticDiscards(3, turn * 1000 + 3) : [],
      bottom: generateRealisticDiscards(0, turn * 1000 + 4)
    });
  }, [mode, turn]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-xl shadow-xl p-3">
          {/* Top section: 対面の手牌と河 */}
          <div className="flex flex-col items-center space-y-1 mb-3">
            <OpponentHand position="top" tileCount={13} playerName="対面" />
            {isClient && <DiscardArea playerName="対面" discards={discards.top} position="top" />}
          </div>
          
          {/* Middle section: 左右の家と中央テーブル */}
          <div className="flex justify-between items-center mb-3">
            {/* 左家（上家）*/}
            <div className="flex flex-row items-center space-x-2">
              <OpponentHand position="left" tileCount={13} playerName="上家" />
              {isClient && <DiscardArea playerName="上家" discards={discards.left} position="left" />}
            </div>
            
            {/* 中央テーブル */}
            <div className="bg-black bg-opacity-70 rounded-lg px-3 py-2 backdrop-blur-sm mx-1 flex-shrink-0">
              <div className="text-center">
                <p className="text-green-400 text-sm font-bold">{turn}巡目</p>
                <p className="text-green-300 text-xs whitespace-nowrap">
                  {mode === '4players' ? '四人麻雀' : '三人麻雀'}
                </p>
              </div>
            </div>
            
            {/* 右家（下家）*/}
            {mode === '4players' ? (
              <div className="flex flex-row-reverse items-center space-x-reverse space-x-2">
                <OpponentHand position="right" tileCount={13} playerName="下家" />
                {isClient && <DiscardArea playerName="下家" discards={discards.right} position="right" />}
              </div>
            ) : (
              <div className="w-12"></div>
            )}
          </div>
          
          {/* Bottom section: 自家の河と手牌 */}
          <div className="flex flex-col items-center space-y-1">
            {isClient && <DiscardArea playerName="自家" discards={discards.bottom} position="bottom" />}
            
            {/* Player's hand */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-3 shadow-2xl border-2 border-white w-full">
              <div className="text-center mb-2">
                <span className="text-gray-900 font-semibold text-sm bg-white bg-opacity-80 px-2 py-1 rounded">
                  自家の手牌
                </span>
              </div>
              <div className="bg-white bg-opacity-50 rounded-md p-2 shadow-inner">
                <div className="flex justify-center items-center gap-0.5 overflow-x-auto pb-1">
                  {hand.map((tile) => (
                    <div key={tile.id} className="flex-shrink-0">
                      <MahjongTileImage
                        tile={tile}
                        isSelected={selectedTile?.id === tile.id}
                        onClick={() => onTileClick(tile)}
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="relative w-full aspect-[4/3] max-h-[700px] mx-auto">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-2xl shadow-2xl">
            {/* Inner table */}
            <div className="absolute inset-8 bg-green-600 rounded-xl shadow-inner">
              {/* Table center */}
              <div className="absolute inset-16 bg-gradient-to-br from-green-700 to-green-800 rounded-lg shadow-xl">
                {/* Center info display */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-black bg-opacity-70 rounded-lg px-8 py-6 backdrop-blur-sm border-2 border-yellow-500">
                    <div className="text-center">
                      <p className="text-yellow-400 text-3xl font-bold">{turn}巡目</p>
                      <p className="text-yellow-300 text-lg mt-2">
                        {mode === '4players' ? '四人麻雀' : '三人麻雀'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 対面（上）: 手牌→河の順 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
            <OpponentHand position="top" tileCount={13} playerName="対面" />
            {isClient && <DiscardArea playerName="対面" discards={discards.top} position="top" />}
          </div>

          {/* 上家（左）: 手牌→河の順（横並び） */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-row items-center space-x-3">
            <OpponentHand position="left" tileCount={13} playerName="上家" />
            {isClient && <DiscardArea playerName="上家" discards={discards.left} position="left" />}
          </div>

          {/* 下家（右）: 手牌→河の順（横並び） - 4人麻雀のみ */}
          {mode === '4players' && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-row-reverse items-center space-x-reverse space-x-3">
              <OpponentHand position="right" tileCount={13} playerName="下家" />
              {isClient && <DiscardArea playerName="下家" discards={discards.right} position="right" />}
            </div>
          )}

          {/* 自家（下）: 河→手牌の順 */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-transparent p-6">
              {/* 自家の河 */}
              <div className="flex justify-center mb-3">
                {isClient && <DiscardArea playerName="自家" discards={discards.bottom} position="bottom" />}
              </div>
              
              <div className="text-center mb-3">
                <span className="text-white font-bold text-xl bg-black bg-opacity-70 px-4 py-2 rounded border-2 border-yellow-500">
                  自家の手牌
                </span>
              </div>
              
              {/* Player's hand */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-2xl p-4 max-w-[900px] mx-auto border-4 border-white">
                <div className="bg-white bg-opacity-50 rounded-md p-2 shadow-inner">
                  <div className="flex justify-center items-center gap-1">
                    {hand.map((tile) => (
                      <div key={tile.id} className="flex-shrink-0">
                        <MahjongTileImage
                          tile={tile}
                          isSelected={selectedTile?.id === tile.id}
                          onClick={() => onTileClick(tile)}
                          disabled={disabled}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}