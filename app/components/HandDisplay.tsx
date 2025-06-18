'use client';

import { Tile } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';

interface HandDisplayProps {
  hand: Tile[];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  disabled?: boolean;
}

export default function HandDisplay({ hand, selectedTile, onTileClick, disabled }: HandDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-3 sm:p-4">
      <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
        {hand.map((tile, index) => (
          <MahjongTileImage
            key={tile.id}
            tile={tile}
            isSelected={selectedTile?.id === tile.id}
            onClick={() => onTileClick(tile)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}