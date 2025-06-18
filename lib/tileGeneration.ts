import { Tile, GameMode } from '@/types/mahjong';
import { getAllTiles, createTile, calculateShanten, sortHand } from './mahjong';

export function generateHand(mode: GameMode, turn: number): Tile[] {
  const allTiles = getAllTiles(mode);
  const tilePool: Tile[] = [];
  
  // Create 4 copies of each tile
  allTiles.forEach(tile => {
    for (let i = 0; i < 4; i++) {
      tilePool.push({
        ...tile,
        id: `${tile.id}-${i}`
      });
    }
  });
  
  // Shuffle the pool
  const shuffled = shuffleTilePool(tilePool);
  
  // Generate hand based on turn
  if (turn <= 3) {
    // Early game: mostly disconnected tiles
    return generateEarlyGameHand(shuffled);
  } else if (turn <= 9) {
    // Mid game: some connections forming
    return generateMidGameHand(shuffled);
  } else {
    // Late game: close to tenpai
    return generateLateGameHand(shuffled);
  }
}

function shuffleTilePool(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateEarlyGameHand(tilePool: Tile[]): Tile[] {
  const hand: Tile[] = [];
  const used = new Set<string>();
  
  // Add some pairs and isolated tiles
  while (hand.length < 14) {
    const tile = tilePool.find(t => !used.has(t.id));
    if (!tile) break;
    
    hand.push(tile);
    used.add(tile.id);
    
    // 30% chance to add a pair
    if (Math.random() < 0.3 && hand.length < 13) {
      const pair = tilePool.find(t => 
        !used.has(t.id) && 
        t.type === tile.type && 
        (t.type === 'honor' ? t.honor === tile.honor : t.number === tile.number)
      );
      if (pair) {
        hand.push(pair);
        used.add(pair.id);
      }
    }
  }
  
  return sortHand(hand);
}

function generateMidGameHand(tilePool: Tile[]): Tile[] {
  const hand: Tile[] = [];
  const used = new Set<string>();
  
  // Add some complete groups
  const numGroups = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < numGroups; i++) {
    if (Math.random() < 0.5) {
      // Add triplet
      const base = tilePool.find(t => !used.has(t.id));
      if (base) {
        const triplet = tilePool.filter(t => 
          !used.has(t.id) && 
          t.type === base.type && 
          (t.type === 'honor' ? t.honor === base.honor : t.number === base.number)
        ).slice(0, 3);
        
        if (triplet.length === 3) {
          triplet.forEach(t => {
            hand.push(t);
            used.add(t.id);
          });
        }
      }
    } else {
      // Add sequence
      const types: ('man' | 'pin' | 'sou')[] = ['man', 'pin', 'sou'];
      const type = types[Math.floor(Math.random() * types.length)];
      const start = Math.floor(Math.random() * 7) + 1;
      
      const seq = [
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start),
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start + 1),
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start + 2)
      ];
      
      if (seq.every(t => t)) {
        seq.forEach(t => {
          hand.push(t!);
          used.add(t!.id);
        });
      }
    }
  }
  
  // Fill remaining with semi-connected tiles
  while (hand.length < 14) {
    const tile = tilePool.find(t => !used.has(t.id));
    if (!tile) break;
    
    hand.push(tile);
    used.add(tile.id);
  }
  
  return sortHand(hand);
}

function generateLateGameHand(tilePool: Tile[]): Tile[] {
  const hand: Tile[] = [];
  const used = new Set<string>();
  
  // Create 3-4 complete groups
  const numGroups = Math.floor(Math.random() * 2) + 3;
  
  for (let i = 0; i < numGroups && hand.length <= 11; i++) {
    if (Math.random() < 0.4) {
      // Add triplet
      const tiles = tilePool.filter(t => !used.has(t.id));
      const base = tiles[Math.floor(Math.random() * tiles.length)];
      
      if (base) {
        const triplet = tilePool.filter(t => 
          !used.has(t.id) && 
          t.type === base.type && 
          (t.type === 'honor' ? t.honor === base.honor : t.number === base.number)
        ).slice(0, 3);
        
        if (triplet.length === 3) {
          triplet.forEach(t => {
            hand.push(t);
            used.add(t.id);
          });
        }
      }
    } else {
      // Add sequence
      const types: ('man' | 'pin' | 'sou')[] = ['man', 'pin', 'sou'];
      const type = types[Math.floor(Math.random() * types.length)];
      const start = Math.floor(Math.random() * 7) + 1;
      
      const seq = [
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start),
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start + 1),
        tilePool.find(t => !used.has(t.id) && t.type === type && t.number === start + 2)
      ];
      
      if (seq.every(t => t)) {
        seq.forEach(t => {
          hand.push(t!);
          used.add(t!.id);
        });
      }
    }
  }
  
  // Add a pair if needed
  if (hand.length <= 12) {
    const tiles = tilePool.filter(t => !used.has(t.id));
    const base = tiles[Math.floor(Math.random() * tiles.length)];
    
    if (base) {
      const pair = tilePool.filter(t => 
        !used.has(t.id) && 
        t.type === base.type && 
        (t.type === 'honor' ? t.honor === base.honor : t.number === base.number)
      ).slice(0, 2);
      
      if (pair.length === 2) {
        pair.forEach(t => {
          hand.push(t);
          used.add(t.id);
        });
      }
    }
  }
  
  // Fill remaining
  while (hand.length < 14) {
    const tile = tilePool.find(t => !used.has(t.id));
    if (!tile) break;
    
    hand.push(tile);
    used.add(tile.id);
  }
  
  return sortHand(hand);
}

export function findBestDiscard(hand: Tile[]): { tile: Tile; shantenChange: number } {
  const currentShanten = calculateShanten(hand);
  let bestTile = hand[0];
  let bestShantenChange = 999;
  
  for (const tile of hand) {
    const remainingHand = hand.filter(t => t.id !== tile.id);
    const newShanten = calculateShanten(remainingHand);
    const shantenChange = newShanten - currentShanten;
    
    if (shantenChange < bestShantenChange) {
      bestShantenChange = shantenChange;
      bestTile = tile;
    }
  }
  
  return { tile: bestTile, shantenChange: bestShantenChange };
}

export function generateExplanation(tile: Tile, hand: Tile[], shantenChange: number): string {
  const tileStr = tile.type === 'honor' 
    ? getHonorName(tile.honor!) 
    : `${tile.number}${getTypeName(tile.type)}`;
  
  if (shantenChange <= 0) {
    return `打${tileStr}が最適です。この牌を切ることで、シャンテン数が維持または改善されます。`;
  } else {
    return `打${tileStr}。他により良い選択肢がある可能性があります。シャンテン数が${shantenChange}増加します。`;
  }
}

function getHonorName(honor: string): string {
  const map: Record<string, string> = {
    east: '東', south: '南', west: '西', north: '北',
    white: '白', green: '發', red: '中'
  };
  return map[honor];
}

function getTypeName(type: string): string {
  const map: Record<string, string> = {
    man: '萬', pin: '筒', sou: '索'
  };
  return map[type];
}