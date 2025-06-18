'use client';

import { Tile } from '@/types/mahjong';
import { getTileString } from '@/lib/mahjong';

interface MahjongTileProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MahjongTile({ tile, isSelected, onClick, disabled }: MahjongTileProps) {
  const tileString = getTileString(tile);
  
  const getColorClass = () => {
    if (tile.type === 'man') return 'text-red-600';
    if (tile.type === 'pin') return 'text-blue-600';
    if (tile.type === 'sou') return 'text-green-600';
    return 'text-gray-800';
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-12 h-16 sm:w-14 sm:h-20 rounded-md border-2 
        ${isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-400 bg-white'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-600'}
        shadow-md transition-all duration-200
        ${!disabled && !isSelected ? 'hover:scale-105' : ''}
        ${isSelected ? 'scale-110 z-10' : ''}
        flex items-center justify-center
      `}
    >
      <span className={`text-xl sm:text-2xl font-bold ${getColorClass()}`}>
        {tileString}
      </span>
    </button>
  );
}