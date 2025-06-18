'use client';

import Image from 'next/image';

interface OpponentHandProps {
  position: 'top' | 'left' | 'right';
  tileCount: number;
  playerName: string;
}

export default function OpponentHand({ position, tileCount, playerName }: OpponentHandProps) {
  const tiles = Array.from({ length: tileCount }, (_, i) => i);
  
  const getContainerClass = () => {
    if (position === 'top') {
      return 'flex flex-row gap-0.5 justify-center';
    } else if (position === 'left') {
      return 'flex flex-col gap-0.5 items-center';
    } else {
      return 'flex flex-col gap-0.5 items-center';
    }
  };

  const getTileClass = () => {
    if (position === 'top') {
      return 'w-[20px] h-[28px] xs:w-[25px] xs:h-[35px] sm:w-[30px] sm:h-[42px] md:w-[32px] md:h-[45px]';
    } else {
      return 'w-[28px] h-[20px] xs:w-[35px] xs:h-[25px] sm:w-[42px] sm:h-[30px] md:w-[45px] md:h-[32px]';
    }
  };

  const getRotation = () => {
    if (position === 'left') return 'rotate-90';
    if (position === 'right') return '-rotate-90';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-bold text-white bg-black bg-opacity-60 px-2 py-1 rounded">{playerName}</span>
      <div className={getContainerClass()}>
        {tiles.map((_, index) => (
          <div key={index} className={`relative ${getTileClass()} ${getRotation()}`}>
            <Image
              src="/tiles/Back.svg"
              alt="Opponent tile back"
              fill
              className="object-contain filter drop-shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}