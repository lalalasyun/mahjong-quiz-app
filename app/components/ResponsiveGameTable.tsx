'use client';

import { Tile, GameMode } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';
import OpponentHand from './OpponentHand';

interface ResponsiveGameTableProps {
  hand: Tile[];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
  turn: number;
}

export default function ResponsiveGameTable({ 
  hand, 
  selectedTile, 
  onTileClick, 
  disabled, 
  mode, 
  turn 
}: ResponsiveGameTableProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-xl shadow-xl p-3">
          {/* Top player */}
          <div className="flex justify-center mb-4">
            <OpponentHand position="top" tileCount={13} playerName="対面" />
          </div>
          
          {/* Middle row with left/right players and center info */}
          <div className="flex justify-between items-center mb-4 px-2">
            <OpponentHand position="left" tileCount={13} playerName="上家" />
            
            {/* Center info */}
            <div className="bg-black bg-opacity-60 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-green-400 text-lg font-bold">{turn}巡目</p>
                <p className="text-green-300 text-xs">
                  {mode === '4players' ? '四人麻雀' : '三人麻雀'}
                </p>
              </div>
            </div>
            
            {mode === '4players' && (
              <OpponentHand position="right" tileCount={13} playerName="下家" />
            )}
          </div>
          
          {/* Player's hand */}
          <div className="bg-white bg-opacity-95 rounded-lg p-2">
            <div className="text-center mb-2">
              <span className="text-gray-800 font-semibold text-sm">自家</span>
            </div>
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

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="relative w-full aspect-[4/3] max-h-[600px] mx-auto">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-2xl shadow-2xl">
            {/* Inner table */}
            <div className="absolute inset-6 bg-green-600 rounded-xl shadow-inner">
              {/* Table center */}
              <div className="absolute inset-12 bg-gradient-to-br from-green-700 to-green-800 rounded-lg shadow-xl">
                {/* Center info display */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-black bg-opacity-50 rounded-lg px-8 py-6 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-green-400 text-3xl font-bold">{turn}巡目</p>
                      <p className="text-green-300 text-lg mt-2">
                        {mode === '4players' ? '四人麻雀' : '三人麻雀'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top player (対面) */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
            <OpponentHand position="top" tileCount={13} playerName="対面" />
          </div>

          {/* Left player (上家) */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
            <OpponentHand position="left" tileCount={13} playerName="上家" />
          </div>

          {/* Right player (下家) - only in 4-player mode */}
          {mode === '4players' && (
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
              <OpponentHand position="right" tileCount={13} playerName="下家" />
            </div>
          )}

          {/* Player's area (自家) */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-t from-gray-900 to-transparent p-6">
              <div className="text-center mb-3">
                <span className="text-white font-bold text-xl bg-black bg-opacity-50 px-4 py-2 rounded">
                  自家
                </span>
              </div>
              
              {/* Player's hand */}
              <div className="bg-white bg-opacity-95 rounded-lg shadow-2xl p-4 max-w-[900px] mx-auto">
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
  );
}