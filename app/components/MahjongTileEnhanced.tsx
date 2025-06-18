'use client';

import React from 'react';
import { Tile } from '@/types/mahjong';
import PinTileDesign from './PinTileDesign';

interface MahjongTileEnhancedProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MahjongTileEnhanced({ tile, isSelected, onClick, disabled }: MahjongTileEnhancedProps) {
  const renderTileContent = () => {
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
      const honor = honorMap[tile.honor!];
      
      return (
        <text
          x="35"
          y="50"
          fontSize="36"
          fontWeight="bold"
          textAnchor="middle"
          fill={honor.color}
          style={{ fontFamily: 'sans-serif' }}
        >
          {honor.text}
        </text>
      );
    }

    if (tile.type === 'pin') {
      return <PinTileDesign number={tile.number!} />;
    }

    // Man and Sou tiles
    const colors = {
      man: '#DC2626',
      sou: '#16A34A'
    };

    if (tile.type === 'sou') {
      // Sou design
      const getSouDesign = (number: number): React.ReactElement => {
        switch (number) {
          case 1:
            return (
              <g>
                <circle cx="35" cy="40" r="12" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
                <text x="35" y="47" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">索</text>
              </g>
            );
          case 2:
            return (
              <g>
                <circle cx="35" cy="25" r="10" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
                <circle cx="35" cy="55" r="10" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
              </g>
            );
          case 3:
            return (
              <g>
                <circle cx="25" cy="25" r="8" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
                <circle cx="35" cy="40" r="8" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
                <circle cx="45" cy="55" r="8" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
              </g>
            );
          default:
            return (
              <>
                <text x="35" y="38" fontSize="32" fontWeight="bold" textAnchor="middle" fill="#16A34A">
                  {number}
                </text>
                <text x="35" y="60" fontSize="16" fontWeight="600" textAnchor="middle" fill="#16A34A">
                  索
                </text>
              </>
            );
        }
      };
      
      return getSouDesign(tile.number!);
    }

    // Man tiles
    return (
      <>
        <text
          x="35"
          y="38"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fill={colors.man}
          style={{ fontFamily: 'sans-serif' }}
        >
          {tile.number}
        </text>
        <text
          x="35"
          y="60"
          fontSize="16"
          fontWeight="600"
          textAnchor="middle"
          fill={colors.man}
          style={{ fontFamily: 'sans-serif' }}
        >
          萬
        </text>
      </>
    );
  };

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
        width="70"
        height="90"
        viewBox="0 0 70 90"
        className="filter drop-shadow-xl"
      >
        {/* Tile background with gradient */}
        <defs>
          <linearGradient id="tileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="1" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.1"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer tile */}
        <rect
          x="2"
          y="2"
          width="66"
          height="86"
          rx="6"
          fill="url(#tileGradient)"
          stroke={isSelected ? '#3B82F6' : '#9CA3AF'}
          strokeWidth={isSelected ? '3' : '2'}
        />
        
        {/* Inner border */}
        <rect
          x="8"
          y="8"
          width="54"
          height="74"
          rx="4"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
          filter="url(#innerShadow)"
        />
        
        {/* Content area */}
        <g transform="translate(0, 5)">
          {renderTileContent()}
        </g>
        
        {/* Highlight effect */}
        <rect
          x="8"
          y="8"
          width="54"
          height="25"
          rx="4"
          fill="url(#highlightGradient)"
          opacity="0.3"
        />
        
        {/* Gradient for highlight */}
        <defs>
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}