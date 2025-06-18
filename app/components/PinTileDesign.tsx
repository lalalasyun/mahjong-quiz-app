'use client';

interface PinTileDesignProps {
  number: number;
}

export default function PinTileDesign({ number }: PinTileDesignProps) {
  const renderPins = () => {
    const pinPositions: Record<number, Array<{ x: number; y: number }>> = {
      1: [{ x: 30, y: 40 }],
      2: [{ x: 30, y: 25 }, { x: 30, y: 55 }],
      3: [{ x: 20, y: 25 }, { x: 30, y: 40 }, { x: 40, y: 55 }],
      4: [{ x: 20, y: 25 }, { x: 40, y: 25 }, { x: 20, y: 55 }, { x: 40, y: 55 }],
      5: [{ x: 20, y: 25 }, { x: 40, y: 25 }, { x: 30, y: 40 }, { x: 20, y: 55 }, { x: 40, y: 55 }],
      6: [{ x: 20, y: 20 }, { x: 40, y: 20 }, { x: 20, y: 40 }, { x: 40, y: 40 }, { x: 20, y: 60 }, { x: 40, y: 60 }],
      7: [{ x: 20, y: 20 }, { x: 30, y: 20 }, { x: 40, y: 20 }, { x: 25, y: 40 }, { x: 35, y: 40 }, { x: 20, y: 60 }, { x: 40, y: 60 }],
      8: [{ x: 20, y: 15 }, { x: 40, y: 15 }, { x: 20, y: 30 }, { x: 40, y: 30 }, { x: 20, y: 50 }, { x: 40, y: 50 }, { x: 20, y: 65 }, { x: 40, y: 65 }],
      9: [{ x: 18, y: 18 }, { x: 30, y: 18 }, { x: 42, y: 18 }, { x: 18, y: 40 }, { x: 30, y: 40 }, { x: 42, y: 40 }, { x: 18, y: 62 }, { x: 30, y: 62 }, { x: 42, y: 62 }]
    };

    const positions = pinPositions[number] || [];
    
    return positions.map((pos, index) => (
      <circle
        key={index}
        cx={pos.x}
        cy={pos.y}
        r={number <= 6 ? 8 : number === 7 ? 7 : 6}
        fill="#2563EB"
        stroke="#1E40AF"
        strokeWidth="1"
      />
    ));
  };

  return <g>{renderPins()}</g>;
}