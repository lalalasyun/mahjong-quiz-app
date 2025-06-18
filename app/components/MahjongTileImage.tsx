'use client';

import { Tile } from '@/types/mahjong';
import Image from 'next/image';

interface MahjongTileImageProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MahjongTileImage({ tile, isSelected, onClick, disabled }: MahjongTileImageProps) {
  // Map tile to SVG filename
  const getTileFilename = (): string => {
    if (tile.type === 'honor') {
      const honorMap: Record<string, string> = {
        east: 'Ton',
        south: 'Nan',
        west: 'Shaa',
        north: 'Pei',
        white: 'Haku',
        green: 'Hatsu',
        red: 'Chun'
      };
      return `${honorMap[tile.honor!]}.svg`;
    }

    // Number tiles
    const typeMap: Record<string, string> = {
      man: 'Man',
      pin: 'Pin',
      sou: 'Sou'
    };

    return `${typeMap[tile.type]}${tile.number}.svg`;
  };

  const filename = getTileFilename();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative transition-all duration-200 transform-gpu
        ${!disabled && !isSelected ? 'hover:scale-110 hover:-translate-y-2 hover:rotate-1' : ''}
        ${isSelected ? 'scale-125 -translate-y-4 z-20 rotate-2' : ''}
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 rounded-lg shadow-2xl' : ''}
      `}
    >
      <div className="relative w-[40px] h-[56px] xs:w-[45px] xs:h-[63px] sm:w-[50px] sm:h-[70px] md:w-[55px] md:h-[77px] lg:w-[60px] lg:h-[84px]">
        {/* White tile background */}
        <div className="absolute inset-0 bg-white border-2 border-gray-300 rounded-sm shadow-lg"></div>
        
        {/* Tile image */}
        <div className="absolute inset-1">
          <Image
            src={`/tiles/${filename}`}
            alt={`Mahjong tile: ${filename}`}
            fill
            className="object-contain filter drop-shadow-md transition-all duration-200"
            priority
          />
        </div>
        
        {/* Inner shadow effect */}
        <div className="absolute inset-0 rounded-sm shadow-inner pointer-events-none"></div>
      </div>
    </button>
  );
}