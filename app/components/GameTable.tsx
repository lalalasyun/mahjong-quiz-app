'use client';

import { Tile, GameMode } from '@/types/mahjong';
import HandDisplay from './HandDisplay';
import OpponentHand from './OpponentHand';

interface GameTableProps {
  hand: Tile[];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
  turn: number;
}

export default function GameTable({ hand, selectedTile, onTileClick, disabled, mode, turn }: GameTableProps) {
  // Calculate tiles remaining for opponents based on turn
  const getOpponentTileCount = () => {
    const tilesDrawn = Math.min(turn, 14);
    return 13; // Opponents always have 13 tiles in hand
  };

  const opponentTiles = getOpponentTileCount();

  return (
    <div className="bg-green-600 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      {/* Center area - table */}
      <div className="bg-green-700 rounded-xl p-4 sm:p-6 relative min-h-[400px] sm:min-h-[500px]">
        
        {/* Top player */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <OpponentHand position="top" tileCount={opponentTiles} playerName="対面" />
        </div>

        {/* Left player */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <OpponentHand position="left" tileCount={opponentTiles} playerName="上家" />
        </div>

        {/* Right player (only in 4-player mode) */}
        {mode === '4players' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <OpponentHand position="right" tileCount={opponentTiles} playerName="下家" />
          </div>
        )}

        {/* Center display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-green-800 rounded-lg p-4 shadow-inner">
            <p className="text-white text-center font-bold">{turn}巡目</p>
            <p className="text-green-300 text-center text-sm">{mode === '4players' ? '四人麻雀' : '三人麻雀'}</p>
          </div>
        </div>

        {/* Player's hand at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
          <div className="text-center mb-2">
            <span className="text-white font-semibold">自家</span>
          </div>
          <HandDisplay
            hand={hand}
            selectedTile={selectedTile}
            onTileClick={onTileClick}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}