'use client';

import { Tile } from '@/types/mahjong';
import MahjongTileImage from './MahjongTileImage';

interface DiscardAreaProps {
  playerName: string;
  discards: Tile[];
  position: 'top' | 'left' | 'right' | 'bottom';
}

export default function DiscardArea({ playerName, discards, position }: DiscardAreaProps) {
  const getContainerClass = () => {
    const baseClass = "bg-green-900 bg-opacity-40 rounded-lg p-2 border border-green-600";
    switch (position) {
      case 'top':
        return `${baseClass} w-full max-w-sm mx-auto`;
      case 'left':
        return `${baseClass} w-16 min-h-[120px]`;
      case 'right':
        return `${baseClass} w-16 min-h-[120px]`;
      case 'bottom':
        return `${baseClass} w-full max-w-lg mx-auto`;
      default:
        return baseClass;
    }
  };

  const getGridClass = () => {
    switch (position) {
      case 'top':
        return "grid grid-cols-6 gap-1 justify-items-center";
      case 'bottom':
        return "grid grid-cols-8 gap-1 justify-items-center";
      case 'left':
      case 'right':
        return "flex flex-col gap-1 items-center";
      default:
        return "grid grid-cols-6 gap-1 justify-items-center";
    }
  };

  const getTileSize = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return "w-5 h-7";
      case 'left':
      case 'right':
        return "w-6 h-8";
      default:
        return "w-5 h-7";
    }
  };

  const getMaxTileCount = () => {
    switch (position) {
      case 'bottom':
        return 18; // 自家は最大18枚まで表示
      case 'top':
        return 15; // 対面は15枚まで
      case 'left':
      case 'right':
        return 12; // 左右は12枚まで（縦に並ぶため）
      default:
        return 12;
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className="text-center mb-1">
        <span className="text-green-200 text-xs font-semibold bg-green-800 bg-opacity-60 px-2 py-0.5 rounded">
          {playerName}河
        </span>
      </div>
      <div className={getGridClass()}>
        {discards.length > 0 ? (
          discards.slice(0, getMaxTileCount()).map((tile, index) => (
            <div key={`${tile.id}-${index}`} className={getTileSize()}>
              <SmallMahjongTile tile={tile} position={position} />
            </div>
          ))
        ) : (
          <div className="text-center text-green-300 text-xs py-2" style={{ gridColumn: '1 / -1' }}>
            まだ捨て牌なし
          </div>
        )}
      </div>
    </div>
  );
}

// 捨て牌用の小さな牌コンポーネント
interface SmallMahjongTileProps {
  tile: Tile;
  position?: 'top' | 'left' | 'right' | 'bottom';
}

function SmallMahjongTile({ tile, position = 'top' }: SmallMahjongTileProps) {
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

    const typeMap: Record<string, string> = {
      man: 'Man',
      pin: 'Pin',
      sou: 'Sou'
    };

    return `${typeMap[tile.type]}${tile.number}.svg`;
  };

  const filename = getTileFilename();
  
  const getRotation = () => {
    switch (position) {
      case 'left':
        return 'rotate-90';
      case 'right':
        return '-rotate-90';
      default:
        return '';
    }
  };

  return (
    <div className={`relative w-full h-full ${getRotation()}`}>
      {/* White tile background */}
      <div className="absolute inset-0 bg-white border border-gray-400 rounded-sm shadow-sm"></div>
      
      {/* Tile image */}
      <div className="absolute inset-0.5">
        <img
          src={`/tiles/${filename}`}
          alt={`${filename}`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}