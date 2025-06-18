'use client';

import { Tile } from '@/types/mahjong';

interface MahjongTileSVGProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MahjongTileSVG({ tile, isSelected, onClick, disabled }: MahjongTileSVGProps) {
  const getTileContent = () => {
    if (tile.type === 'honor') {
      const honorMap: Record<string, { text: string; color: string }> = {
        east: { text: '東', color: '#000000' },
        south: { text: '南', color: '#000000' },
        west: { text: '西', color: '#000000' },
        north: { text: '北', color: '#000000' },
        white: { text: '白', color: '#000000' },
        green: { text: '發', color: '#10B981' },
        red: { text: '中', color: '#EF4444' }
      };
      return honorMap[tile.honor!];
    }

    // Number tiles
    const colors = {
      man: '#DC2626', // Red for man
      pin: '#2563EB', // Blue for pin
      sou: '#16A34A'  // Green for sou
    };

    return {
      text: tile.number!.toString(),
      color: colors[tile.type as 'man' | 'pin' | 'sou'],
      subtitle: tile.type === 'man' ? '萬' : tile.type === 'pin' ? '筒' : '索'
    };
  };

  const content = getTileContent();
  const isHonor = tile.type === 'honor';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative transition-all duration-200
        ${!disabled && !isSelected ? 'hover:scale-105 hover:-translate-y-1' : ''}
        ${isSelected ? 'scale-110 -translate-y-2 z-10' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      <svg
        width="60"
        height="80"
        viewBox="0 0 60 80"
        className="filter drop-shadow-lg"
      >
        {/* Tile background */}
        <rect
          x="2"
          y="2"
          width="56"
          height="76"
          rx="4"
          fill="#FFFFFF"
          stroke={isSelected ? '#3B82F6' : '#D1D5DB'}
          strokeWidth={isSelected ? '3' : '2'}
        />
        
        {/* Inner border */}
        <rect
          x="6"
          y="6"
          width="48"
          height="68"
          rx="2"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        
        {isHonor ? (
          // Honor tile
          <text
            x="30"
            y="50"
            fontSize="28"
            fontWeight="bold"
            textAnchor="middle"
            fill={content.color}
            style={{ fontFamily: 'sans-serif' }}
          >
            {content.text}
          </text>
        ) : (
          // Number tile
          <>
            <text
              x="30"
              y="38"
              fontSize="32"
              fontWeight="bold"
              textAnchor="middle"
              fill={content.color}
              style={{ fontFamily: 'sans-serif' }}
            >
              {content.text}
            </text>
            <text
              x="30"
              y="60"
              fontSize="16"
              fontWeight="600"
              textAnchor="middle"
              fill={content.color}
              style={{ fontFamily: 'sans-serif' }}
            >
              {'subtitle' in content ? content.subtitle : ''}
            </text>
          </>
        )}
        
        {/* Highlight effect */}
        <rect
          x="6"
          y="6"
          width="48"
          height="20"
          rx="2"
          fill="url(#highlight)"
          opacity="0.4"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}