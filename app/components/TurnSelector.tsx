'use client';

interface TurnSelectorProps {
  turn: number;
  onChange: (turn: number) => void;
}

export default function TurnSelector({ turn, onChange }: TurnSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <label className="text-base sm:text-lg font-medium whitespace-nowrap">巡目:</label>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <input
          type="range"
          min="1"
          max="18"
          value={turn}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 sm:w-32 md:w-48"
        />
        <span className="text-base sm:text-lg font-bold text-blue-600 min-w-[3rem] whitespace-nowrap">
          {turn}巡目
        </span>
      </div>
    </div>
  );
}