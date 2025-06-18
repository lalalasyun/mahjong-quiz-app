import { Tile, TileType, HonorTile, GameMode, HandAnalysis } from '@/types/mahjong';

export const HONOR_TILES: HonorTile[] = ['east', 'south', 'west', 'north', 'white', 'green', 'red'];

export function createTile(type: TileType, number?: number, honor?: HonorTile): Tile {
  const id = type === 'honor' ? `${type}-${honor}` : `${type}-${number}`;
  return { type, number, honor, id };
}

export function getTileString(tile: Tile): string {
  if (tile.type === 'honor') {
    const honorMap: Record<HonorTile, string> = {
      east: '東',
      south: '南',
      west: '西',
      north: '北',
      white: '白',
      green: '發',
      red: '中'
    };
    return honorMap[tile.honor!];
  }
  
  const typeMap: Record<TileType, string> = {
    man: '萬',
    pin: '筒',
    sou: '索',
    honor: ''
  };
  
  return `${tile.number}${typeMap[tile.type]}`;
}

export function getAllTiles(mode: GameMode): Tile[] {
  const tiles: Tile[] = [];
  
  // Man tiles
  for (let i = 1; i <= 9; i++) {
    tiles.push(createTile('man', i));
  }
  
  // Pin tiles
  if (mode === '4players') {
    for (let i = 1; i <= 9; i++) {
      tiles.push(createTile('pin', i));
    }
  } else {
    // 3 players mode: exclude pin 2-8
    tiles.push(createTile('pin', 1));
    tiles.push(createTile('pin', 9));
  }
  
  // Sou tiles
  for (let i = 1; i <= 9; i++) {
    tiles.push(createTile('sou', i));
  }
  
  // Honor tiles
  for (const honor of HONOR_TILES) {
    tiles.push(createTile('honor', undefined, honor));
  }
  
  return tiles;
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sortHand(hand: Tile[]): Tile[] {
  return [...hand].sort((a, b) => {
    const typeOrder = { man: 0, pin: 1, sou: 2, honor: 3 };
    if (a.type !== b.type) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    
    if (a.type === 'honor' && b.type === 'honor') {
      return HONOR_TILES.indexOf(a.honor!) - HONOR_TILES.indexOf(b.honor!);
    }
    
    return (a.number || 0) - (b.number || 0);
  });
}

// Simple shanten calculation (basic implementation)
export function calculateShanten(tiles: Tile[]): number {
  // This is a simplified version. A complete implementation would be much more complex
  const hand = [...tiles];
  const groups = findGroups(hand);
  const pairs = findPairs(hand);
  
  // Very basic shanten calculation
  const completeGroups = Math.min(groups.length, 4);
  const hasPair = pairs.length > 0;
  
  if (completeGroups === 4 && hasPair) {
    return 0; // Tenpai
  }
  
  const neededGroups = 4 - completeGroups;
  const neededPair = hasPair ? 0 : 1;
  
  return Math.max(neededGroups + neededPair - 1, 0);
}

function findGroups(tiles: Tile[]): Tile[][] {
  const groups: Tile[][] = [];
  const used = new Set<string>();
  
  // Find triplets
  for (let i = 0; i < tiles.length - 2; i++) {
    if (used.has(tiles[i].id)) continue;
    
    let count = 1;
    for (let j = i + 1; j < tiles.length; j++) {
      if (tilesEqual(tiles[i], tiles[j]) && !used.has(tiles[j].id)) {
        count++;
        if (count === 3) {
          groups.push([tiles[i], tiles[j - 1], tiles[j]]);
          used.add(tiles[i].id);
          used.add(tiles[j - 1].id);
          used.add(tiles[j].id);
          break;
        }
      }
    }
  }
  
  // Find sequences (simplified)
  const sortedTiles = sortHand(tiles.filter(t => !used.has(t.id)));
  for (let i = 0; i < sortedTiles.length - 2; i++) {
    const tile = sortedTiles[i];
    if (tile.type === 'honor' || used.has(tile.id)) continue;
    
    const next1 = sortedTiles.find(t => !used.has(t.id) && t.type === tile.type && t.number === tile.number! + 1);
    const next2 = sortedTiles.find(t => !used.has(t.id) && t.type === tile.type && t.number === tile.number! + 2);
    
    if (next1 && next2) {
      groups.push([tile, next1, next2]);
      used.add(tile.id);
      used.add(next1.id);
      used.add(next2.id);
    }
  }
  
  return groups;
}

function findPairs(tiles: Tile[]): Tile[][] {
  const pairs: Tile[][] = [];
  const used = new Set<string>();
  
  for (let i = 0; i < tiles.length - 1; i++) {
    if (used.has(tiles[i].id)) continue;
    
    for (let j = i + 1; j < tiles.length; j++) {
      if (tilesEqual(tiles[i], tiles[j]) && !used.has(tiles[j].id)) {
        pairs.push([tiles[i], tiles[j]]);
        used.add(tiles[i].id);
        used.add(tiles[j].id);
        break;
      }
    }
  }
  
  return pairs;
}

function tilesEqual(a: Tile, b: Tile): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'honor') return a.honor === b.honor;
  return a.number === b.number;
}