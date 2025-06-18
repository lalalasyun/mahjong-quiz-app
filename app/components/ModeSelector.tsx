'use client';

import { GameMode } from '@/types/mahjong';

interface ModeSelectorProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <label className="text-base sm:text-lg font-medium whitespace-nowrap">ゲームモード:</label>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={() => onChange('4players')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
            mode === '4players'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          4人麻雀
        </button>
        <button
          onClick={() => onChange('3players')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
            mode === '3players'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          3人麻雀
        </button>
      </div>
    </div>
  );
}