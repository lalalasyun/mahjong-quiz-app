export type TileType = 'man' | 'pin' | 'sou' | 'honor';

export type HonorTile = 'east' | 'south' | 'west' | 'north' | 'white' | 'green' | 'red';

export interface Tile {
  type: TileType;
  number?: number; // 1-9 for man/pin/sou
  honor?: HonorTile; // for honor tiles
  id: string;
}

export type GameMode = '4players' | '3players';

export interface GameState {
  hand: Tile[];
  mode: GameMode;
  turn: number; // 1-18
  selectedTile: Tile | null;
  isAnswered: boolean;
  correctAnswer: Tile | null;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizResult {
  isCorrect: boolean;
  explanation: string;
  shantenChange: number;
  alternativeChoices: Array<{
    tile: Tile;
    shantenChange: number;
    reasoning: string;
  }>;
}

export interface HandAnalysis {
  shanten: number;
  tiles: Tile[];
  waitingTiles?: Tile[];
  isComplete: boolean;
}