import { Tile, QuizResult } from '@/types/mahjong';
import { calculateShanten, getTileString, sortHand } from './mahjong';

// 牌効率理論に基づく高度な解析
export interface TileEfficiency {
  tile: Tile;
  acceptanceTiles: number; // 受け入れ枚数
  shantenReduction: number; // シャンテン戻し
  waitQuality: number; // 待ちの質（1-10）
  safetyLevel: number; // 安全度（1-10）
  speedRating: number; // 速度評価（1-10）
  score: number; // 総合スコア
}

export interface ProfessionalAnalysis extends QuizResult {
  tileEfficiencies: TileEfficiency[];
  handType: string;
  strategicAdvice: string;
  situationalFactors: string[];
  yaku: string[];
  dangerousDiscards: string[];
}

export function analyzeProfessional(hand: Tile[], discardedTile: Tile, turn: number): ProfessionalAnalysis {
  const sortedHand = sortHand(hand);
  const currentShanten = calculateShanten(hand);
  
  // すべての打牌候補を効率解析
  const tileEfficiencies = analyzeAllTileEfficiencies(hand, turn);
  
  // 最適打牌を決定
  const bestEfficiency = tileEfficiencies.sort((a, b) => b.score - a.score)[0];
  const selectedEfficiency = tileEfficiencies.find(e => e.tile.id === discardedTile.id) || tileEfficiencies[0];
  
  // 手牌形を判定
  const handType = analyzeHandType(hand);
  
  // 役の可能性を分析
  const yaku = analyzePossibleYaku(hand);
  
  // 戦略的アドバイス生成
  const strategicAdvice = generateStrategicAdvice(hand, currentShanten, turn, handType);
  
  // 状況的要因
  const situationalFactors = analyzeSituationalFactors(hand, turn);
  
  // 危険牌判定
  const dangerousDiscards = analyzeDangerousDiscards(hand, turn);
  
  // 詳細解説生成
  const explanation = generateProfessionalExplanation(
    hand,
    discardedTile,
    selectedEfficiency,
    bestEfficiency,
    handType,
    yaku,
    turn
  );
  
  const isCorrect = Math.abs(selectedEfficiency.score - bestEfficiency.score) <= 1.0;
  
  return {
    isCorrect,
    explanation,
    shantenChange: selectedEfficiency.shantenReduction,
    alternativeChoices: tileEfficiencies.slice(0, 5).map(eff => ({
      tile: eff.tile,
      shantenChange: eff.shantenReduction,
      reasoning: generateTileReasoning(eff)
    })),
    tileEfficiencies,
    handType,
    strategicAdvice,
    situationalFactors,
    yaku,
    dangerousDiscards
  };
}

function analyzeAllTileEfficiencies(hand: Tile[], turn: number): TileEfficiency[] {
  const currentShanten = calculateShanten(hand);
  const efficiencies: TileEfficiency[] = [];
  
  for (const tile of hand) {
    const remainingHand = hand.filter(t => t.id !== tile.id);
    const newShanten = calculateShanten(remainingHand);
    
    const acceptanceTiles = calculateAcceptanceTiles(remainingHand);
    const shantenReduction = currentShanten - newShanten;
    const waitQuality = evaluateWaitQuality(remainingHand);
    const safetyLevel = evaluateSafety(tile, turn);
    const speedRating = evaluateSpeed(remainingHand, acceptanceTiles);
    
    // 総合スコア計算（牌効率理論）
    const score = calculateTileScore(
      acceptanceTiles,
      shantenReduction,
      waitQuality,
      safetyLevel,
      speedRating,
      turn
    );
    
    efficiencies.push({
      tile,
      acceptanceTiles,
      shantenReduction,
      waitQuality,
      safetyLevel,
      speedRating,
      score
    });
  }
  
  return efficiencies.sort((a, b) => b.score - a.score);
}

function calculateAcceptanceTiles(hand: Tile[]): number {
  // 簡易的な受け入れ枚数計算
  // 実際の実装では、すべての可能な次の牌を試行
  const uniqueTileTypes = new Set(hand.map(t => t.type));
  const pairs = countPairs(hand);
  const sequences = countPotentialSequences(hand);
  
  // 確定的な計算にして一貫性を保つ
  return Math.min(30, pairs * 2 + sequences * 3 + uniqueTileTypes.size);
}

function evaluateWaitQuality(hand: Tile[]): number {
  // 待ちの質を評価（両面待ち > カンチャン > ペンチャン > 単騎）
  const shanten = calculateShanten(hand);
  if (shanten === 0) {
    // テンパイ時の待ちの質評価
    return evaluateTenpaiWait(hand);
  }
  
  // イーシャンテン以下での形の良さ
  const goodShapes = countGoodShapes(hand);
  return Math.min(10, goodShapes * 2);
}

function evaluateSafety(tile: Tile, turn: number): number {
  // 安全度評価（字牌 > 端牌 > 中張牌）
  if (tile.type === 'honor') {
    return turn <= 6 ? 9 : 7; // 序盤は字牌が安全
  }
  
  if (tile.number === 1 || tile.number === 9) {
    return turn <= 9 ? 8 : 6; // 中盤まで端牌は比較的安全
  }
  
  if (tile.number === 4 || tile.number === 5 || tile.number === 6) {
    return turn <= 6 ? 3 : 1; // 456は危険
  }
  
  return turn <= 9 ? 5 : 3; // 237は中程度
}

function evaluateSpeed(hand: Tile[], acceptanceTiles: number): number {
  // アガリ速度評価
  const shanten = calculateShanten(hand);
  const speedBase = Math.max(1, 11 - shanten * 2);
  const acceptanceBonus = Math.min(3, acceptanceTiles / 10);
  
  return Math.min(10, speedBase + acceptanceBonus);
}

function calculateTileScore(
  acceptanceTiles: number,
  shantenReduction: number,
  waitQuality: number,
  safetyLevel: number,
  speedRating: number,
  turn: number
): number {
  // 局面に応じた重み調整
  const attackWeight = turn <= 9 ? 0.7 : 0.4; // 序中盤は攻撃重視
  const defenseWeight = turn <= 9 ? 0.3 : 0.6; // 終盤は守備重視
  
  const attackScore = (
    shantenReduction * 30 +
    acceptanceTiles * 2 +
    waitQuality * 3 +
    speedRating * 2
  );
  
  const defenseScore = safetyLevel * 10;
  
  return attackScore * attackWeight + defenseScore * defenseWeight;
}

function analyzeHandType(hand: Tile[]): string {
  const manCount = hand.filter(t => t.type === 'man').length;
  const pinCount = hand.filter(t => t.type === 'pin').length;
  const souCount = hand.filter(t => t.type === 'sou').length;
  const honorCount = hand.filter(t => t.type === 'honor').length;
  
  const nonZeroTypes = [manCount, pinCount, souCount, honorCount].filter(c => c > 0).length;
  
  if (nonZeroTypes === 1) {
    return honorCount === 14 ? '字一色手' : '清一色手';
  } else if (nonZeroTypes === 2 && honorCount > 0) {
    return '混一色手';
  } else if (honorCount >= 3) {
    return '役牌・混老頭系';
  } else if (honorCount === 0) {
    return 'タンヤオ系';
  } else {
    return '平和系';
  }
}

function analyzePossibleYaku(hand: Tile[]): string[] {
  const yaku: string[] = [];
  
  // タンヤオ
  if (hand.every(t => t.type !== 'honor' && t.number! >= 2 && t.number! <= 8)) {
    yaku.push('断ヤオ九');
  }
  
  // 役牌
  const dragonTiles = hand.filter(t => 
    t.type === 'honor' && ['white', 'green', 'red'].includes(t.honor!)
  );
  if (dragonTiles.length >= 3) {
    yaku.push('役牌（三元牌）');
  }
  
  // 混一色
  const types = new Set(hand.map(t => t.type));
  if (types.size === 2 && types.has('honor')) {
    yaku.push('混一色');
  }
  
  // 清一色
  if (types.size === 1 && !types.has('honor')) {
    yaku.push('清一色');
  }
  
  return yaku;
}

function generateStrategicAdvice(
  hand: Tile[],
  shanten: number,
  turn: number,
  handType: string
): string {
  if (turn <= 6) {
    return `序盤（${turn}巡目）: ${handType}を意識しつつ、手なりで進行。受け入れ枚数を重視。`;
  } else if (turn <= 12) {
    return `中盤（${turn}巡目）: ${handType}の完成を目指し、${shanten === 1 ? 'テンパイ' : `${shanten}シャンテン改善`}を優先。`;
  } else {
    return `終盤（${turn}巡目）: 守備を重視し、安全牌を選択。無理な攻めは避ける。`;
  }
}

function analyzeSituationalFactors(hand: Tile[], turn: number): string[] {
  const factors: string[] = [];
  
  if (turn <= 6) {
    factors.push('序盤 - 手なり進行');
  } else if (turn <= 12) {
    factors.push('中盤 - 攻守バランス');
  } else {
    factors.push('終盤 - 守備重視');
  }
  
  const shanten = calculateShanten(hand);
  if (shanten <= 1) {
    factors.push('テンパイ間近 - 攻撃的に');
  } else if (shanten >= 3) {
    factors.push('遠い手 - 柔軟性重視');
  }
  
  return factors;
}

function analyzeDangerousDiscards(hand: Tile[], turn: number): string[] {
  const dangerous: string[] = [];
  
  if (turn >= 9) {
    dangerous.push('生牌の中張牌（4,5,6）');
    dangerous.push('スジに関係ない牌');
  }
  
  if (turn >= 12) {
    dangerous.push('一度も切られていない牌');
    dangerous.push('現物以外の全ての牌');
  }
  
  return dangerous;
}

function generateProfessionalExplanation(
  hand: Tile[],
  discardedTile: Tile,
  selectedEfficiency: TileEfficiency,
  bestEfficiency: TileEfficiency,
  handType: string,
  yaku: string[],
  turn: number
): string {
  const tileStr = getTileString(discardedTile);
  const bestTileStr = getTileString(bestEfficiency.tile);
  
  let explanation = `【プロレベル解析】\\n\\n`;
  
  explanation += `【選択した打牌: ${tileStr}】\\n`;
  explanation += `・受け入れ枚数: ${selectedEfficiency.acceptanceTiles}枚\\n`;
  explanation += `・待ちの質: ${selectedEfficiency.waitQuality}/10\\n`;
  explanation += `・安全度: ${selectedEfficiency.safetyLevel}/10\\n`;
  explanation += `・速度評価: ${selectedEfficiency.speedRating}/10\\n`;
  explanation += `・総合スコア: ${selectedEfficiency.score.toFixed(1)}点\\n\\n`;
  
  if (selectedEfficiency.tile.id !== bestEfficiency.tile.id) {
    explanation += `【推奨打牌: ${bestTileStr}】\\n`;
    explanation += `・受け入れ枚数: ${bestEfficiency.acceptanceTiles}枚\\n`;
    explanation += `・総合スコア: ${bestEfficiency.score.toFixed(1)}点\\n`;
    explanation += `・選択牌との差: ${(bestEfficiency.score - selectedEfficiency.score).toFixed(1)}点\\n\\n`;
  }
  
  explanation += `【手牌評価】\\n`;
  explanation += `・手牌タイプ: ${handType}\\n`;
  explanation += `・想定役: ${yaku.length > 0 ? yaku.join('、') : 'なし（役作りが必要）'}\\n`;
  explanation += `・局面: ${turn}巡目（${turn <= 6 ? '序盤' : turn <= 12 ? '中盤' : '終盤'}）\\n\\n`;
  
  explanation += `【牌効率理論】\\n`;
  explanation += generateEfficiencyTheory(selectedEfficiency, bestEfficiency, turn);
  
  return explanation;
}

function generateEfficiencyTheory(
  selected: TileEfficiency,
  best: TileEfficiency,
  turn: number
): string {
  let theory = '';
  
  if (turn <= 6) {
    theory += '序盤は受け入れ枚数を最重視。シャンテン戻しより柔軟性を優先。\\n';
  } else if (turn <= 12) {
    theory += '中盤は攻守のバランス。シャンテン改善と安全性を両立。\\n';
  } else {
    theory += '終盤は安全度を最重視。無理な攻めより確実な守備。\\n';
  }
  
  const scoreDiff = best.score - selected.score;
  if (scoreDiff > 5) {
    theory += `選択牌は推奨牌より${scoreDiff.toFixed(1)}点劣る。大きな効率差あり。\\n`;
  } else if (scoreDiff > 2) {
    theory += `選択牌は推奨牌より${scoreDiff.toFixed(1)}点劣る。改善の余地あり。\\n`;
  } else {
    theory += '選択牌と推奨牌の効率差は小さく、実戦的な判断範囲内。\\n';
  }
  
  return theory;
}

// ヘルパー関数
function countPairs(hand: Tile[]): number {
  let pairCount = 0;
  const counted = new Set<string>();
  
  for (let i = 0; i < hand.length - 1; i++) {
    const tile = hand[i];
    const tileKey = `${tile.type}-${tile.type === 'honor' ? tile.honor : tile.number}`;
    
    if (counted.has(tileKey)) continue;
    
    const sameCount = hand.filter(t => 
      t.type === tile.type && 
      (tile.type === 'honor' ? t.honor === tile.honor : t.number === tile.number)
    ).length;
    
    if (sameCount >= 2) {
      pairCount++;
      counted.add(tileKey);
    }
  }
  
  return pairCount;
}

function countPotentialSequences(hand: Tile[]): number {
  let sequenceCount = 0;
  
  for (const tile of hand) {
    if (tile.type === 'honor') continue;
    
    const hasNext1 = hand.some(t => t.type === tile.type && t.number === tile.number! + 1);
    const hasNext2 = hand.some(t => t.type === tile.type && t.number === tile.number! + 2);
    const hasPrev1 = hand.some(t => t.type === tile.type && t.number === tile.number! - 1);
    const hasPrev2 = hand.some(t => t.type === tile.type && t.number === tile.number! - 2);
    
    if ((hasNext1 && hasNext2) || (hasPrev1 && hasNext1) || (hasPrev2 && hasPrev1)) {
      sequenceCount++;
    }
  }
  
  return sequenceCount;
}

function countGoodShapes(hand: Tile[]): number {
  // 良形（両面、三面張など）をカウント
  return Math.floor(hand.length / 3); // 簡易実装
}

function evaluateTenpaiWait(hand: Tile[]): number {
  // テンパイ時の待ちの質を評価
  return 8; // 簡易実装
}

function generateTileReasoning(efficiency: TileEfficiency): string {
  const reasons: string[] = [];
  
  if (efficiency.acceptanceTiles >= 20) {
    reasons.push('受け入れ枚数が多い');
  } else if (efficiency.acceptanceTiles <= 10) {
    reasons.push('受け入れ枚数が少ない');
  }
  
  if (efficiency.waitQuality >= 8) {
    reasons.push('良形への発展期待');
  }
  
  if (efficiency.safetyLevel >= 8) {
    reasons.push('安全度が高い');
  } else if (efficiency.safetyLevel <= 3) {
    reasons.push('やや危険');
  }
  
  return reasons.join('、') || '標準的な選択';
}