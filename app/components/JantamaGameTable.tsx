'use client';

import { Tile, GameMode } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';
import OpponentHand from './OpponentHand';

interface JantamaGameTableProps {
  hand: Tile[];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
  turn: number;
}

export default function JantamaGameTable({ 
  hand, 
  selectedTile, 
  onTileClick, 
  disabled, 
  mode, 
  turn 
}: JantamaGameTableProps) {
  return (
    <div className="relative w-full max-w-[900px] mx-auto aspect-square min-h-[600px]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-2xl shadow-2xl">
        {/* Inner table */}
        <div className="absolute inset-4 bg-green-600 rounded-xl shadow-inner">
          {/* Table center */}
          <div className="absolute inset-8 bg-gradient-to-br from-green-700 to-green-800 rounded-lg shadow-xl">
            {/* Center info display */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black bg-opacity-50 rounded-lg px-6 py-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-green-400 text-2xl font-bold">{turn}巡目</p>
                  <p className="text-green-300 text-sm mt-1">
                    {mode === '4players' ? '四人麻雀' : '三人麻雀'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top player (対面) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <OpponentHand position="top" tileCount={13} playerName="対面" />
      </div>

      {/* Left player (上家) */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <OpponentHand position="left" tileCount={13} playerName="上家" />
      </div>

      {/* Right player (下家) - only in 4-player mode */}
      {mode === '4players' && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <OpponentHand position="right" tileCount={13} playerName="下家" />
        </div>
      )}

      {/* Player's area (自家) */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-gradient-to-t from-gray-900 to-transparent p-4">
          <div className="text-center mb-2">
            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
              自家
            </span>
          </div>
          
          {/* Player's hand */}
          <div className="bg-white bg-opacity-95 rounded-lg shadow-2xl p-3 max-w-[800px] mx-auto">
            <div className="flex justify-center items-center gap-1 overflow-x-auto">
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
  );
}