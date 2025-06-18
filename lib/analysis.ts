import { Tile, QuizResult } from '@/types/mahjong';
import { calculateShanten, getTileString, sortHand } from './mahjong';

export function analyzeHand(hand: Tile[], discardedTile: Tile): QuizResult {
  const currentShanten = calculateShanten(hand);
  const remainingHand = hand.filter(t => t.id !== discardedTile.id);
  const newShanten = calculateShanten(remainingHand);
  const shantenChange = newShanten - currentShanten;
  
  // Analyze all possible discards
  const alternatives = analyzeAllDiscards(hand, discardedTile);
  
  // Generate detailed explanation
  const explanation = generateDetailedExplanation(
    hand,
    discardedTile,
    currentShanten,
    newShanten,
    alternatives
  );
  
  const isCorrect = alternatives.length === 0 || 
    shantenChange <= alternatives[0].shantenChange;
  
  return {
    isCorrect,
    explanation,
    shantenChange,
    alternativeChoices: alternatives
  };
}

function analyzeAllDiscards(hand: Tile[], selectedTile: Tile): Array<{
  tile: Tile;
  shantenChange: number;
  reasoning: string;
}> {
  const currentShanten = calculateShanten(hand);
  const alternatives: Array<{
    tile: Tile;
    shantenChange: number;
    reasoning: string;
  }> = [];
  
  for (const tile of hand) {
    if (tile.id === selectedTile.id) continue;
    
    const remainingHand = hand.filter(t => t.id !== tile.id);
    const newShanten = calculateShanten(remainingHand);
    const shantenChange = newShanten - currentShanten;
    
    const reasoning = analyzeTileDiscard(hand, tile, remainingHand);
    
    alternatives.push({
      tile,
      shantenChange,
      reasoning
    });
  }
  
  // Sort by shanten change (best first)
  return alternatives.sort((a, b) => a.shantenChange - b.shantenChange);
}

function analyzeTileDiscard(fullHand: Tile[], discardTile: Tile, remainingHand: Tile[]): string {
  const tileStr = getTileString(discardTile);
  
  // Check if it's an isolated tile
  const isIsolated = checkIsolation(fullHand, discardTile);
  if (isIsolated) {
    return `${tileStr}は孤立牌で、他の牌との関連性が低い`;
  }
  
  // Check if it's part of a pair
  const isPair = checkPair(fullHand, discardTile);
  if (isPair) {
    return `${tileStr}は対子の一部。雀頭候補を減らす`;
  }
  
  // Check if it's part of a sequence
  const isSequence = checkSequence(fullHand, discardTile);
  if (isSequence) {
    return `${tileStr}は順子の一部。面子候補を崩す`;
  }
  
  // Check if it's an edge tile
  if (discardTile.type !== 'honor' && (discardTile.number === 1 || discardTile.number === 9)) {
    return `${tileStr}は端牌。順子を作りにくい`;
  }
  
  return `${tileStr}を切る`;
}

function checkIsolation(hand: Tile[], tile: Tile): boolean {
  if (tile.type === 'honor') {
    return !hand.some(t => t.id !== tile.id && t.type === 'honor' && t.honor === tile.honor);
  }
  
  const hasNeighbor = hand.some(t => 
    t.id !== tile.id && 
    t.type === tile.type && 
    Math.abs(t.number! - tile.number!) <= 2
  );
  
  return !hasNeighbor;
}

function checkPair(hand: Tile[], tile: Tile): boolean {
  return hand.some(t => 
    t.id !== tile.id && 
    t.type === tile.type && 
    (tile.type === 'honor' ? t.honor === tile.honor : t.number === tile.number)
  );
}

function checkSequence(hand: Tile[], tile: Tile): boolean {
  if (tile.type === 'honor') return false;
  
  const type = tile.type;
  const num = tile.number!;
  
  // Check for potential sequences
  const hasLower = hand.some(t => t.type === type && (t.number === num - 1 || t.number === num - 2));
  const hasHigher = hand.some(t => t.type === type && (t.number === num + 1 || t.number === num + 2));
  
  return hasLower || hasHigher;
}

function generateDetailedExplanation(
  hand: Tile[],
  discardedTile: Tile,
  currentShanten: number,
  newShanten: number,
  alternatives: Array<{ tile: Tile; shantenChange: number; reasoning: string }>
): string {
  const tileStr = getTileString(discardedTile);
  const bestAlternatives = alternatives.filter(a => a.shantenChange < newShanten - currentShanten);
  
  let explanation = `【現在の手牌分析】\\n`;
  explanation += `現在のシャンテン数: ${currentShanten}\\n\\n`;
  
  explanation += `【${tileStr}を切った場合】\\n`;
  explanation += `シャンテン数: ${newShanten} (${newShanten > currentShanten ? '+' : ''}${newShanten - currentShanten})\\n`;
  
  const discardReason = analyzeTileDiscard(hand, discardedTile, hand.filter(t => t.id !== discardedTile.id));
  explanation += `理由: ${discardReason}\\n\\n`;
  
  if (bestAlternatives.length > 0) {
    explanation += `【より良い選択肢】\\n`;
    bestAlternatives.slice(0, 3).forEach((alt, index) => {
      const altTileStr = getTileString(alt.tile);
      explanation += `${index + 1}. ${altTileStr}を切る\\n`;
      explanation += `   シャンテン数変化: ${alt.shantenChange >= 0 ? '+' : ''}${alt.shantenChange}\\n`;
      explanation += `   ${alt.reasoning}\\n`;
    });
    explanation += `\\n`;
  }
  
  explanation += `【手牌の形】\\n`;
  explanation += analyzeHandShape(hand);
  
  return explanation;
}

function analyzeHandShape(hand: Tile[]): string {
  const sorted = sortHand(hand);
  let analysis = '';
  
  // Count tile types
  const typeCount: Record<string, number> = { man: 0, pin: 0, sou: 0, honor: 0 };
  sorted.forEach(tile => typeCount[tile.type]++);
  
  // Analyze balance
  const nonZeroTypes = Object.values(typeCount).filter(c => c > 0).length;
  if (nonZeroTypes === 1) {
    analysis += '清一色の可能性あり\\n';
  } else if (nonZeroTypes === 2 && typeCount.honor > 0) {
    analysis += '混一色の可能性あり\\n';
  }
  
  // Count pairs
  const pairs: string[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const tile = sorted[i];
    const next = sorted[i + 1];
    if (tile.type === next.type && 
        (tile.type === 'honor' ? tile.honor === next.honor : tile.number === next.number)) {
      pairs.push(getTileString(tile));
      i++; // Skip the pair
    }
  }
  
  if (pairs.length > 0) {
    analysis += `対子: ${pairs.join(', ')}\\n`;
  }
  
  // Count isolated tiles
  const isolated = sorted.filter(tile => checkIsolation(hand, tile));
  if (isolated.length > 0) {
    analysis += `孤立牌: ${isolated.map(t => getTileString(t)).join(', ')}\\n`;
  }
  
  return analysis;
}