'use client';

import { useState, useEffect } from 'react';
import { GameState, Tile, GameMode } from '@/types/mahjong';
import { generateHand, findBestDiscard } from '@/lib/tileGeneration';
import { analyzeProfessional, ProfessionalAnalysis } from '@/lib/professionalAnalysis';
import EnhancedGameTable from '@/app/components/EnhancedGameTable';
import ModeSelector from '@/app/components/ModeSelector';
import TurnSelector from '@/app/components/TurnSelector';
import ProfessionalExplanation from '@/app/components/ProfessionalExplanation';
import Link from 'next/link';

export default function QuizPage() {
  const [gameState, setGameState] = useState<GameState>({
    hand: [],
    mode: '4players',
    turn: 6,
    selectedTile: null,
    isAnswered: false,
    correctAnswer: null,
    explanation: '',
    difficulty: 'beginner'
  });

  const [professionalResult, setProfessionalResult] = useState<ProfessionalAnalysis | null>(null);

  useEffect(() => {
    generateNewProblem();
  }, [gameState.mode, gameState.turn]);

  const generateNewProblem = () => {
    const hand = generateHand(gameState.mode, gameState.turn);
    const { tile: correctAnswer } = findBestDiscard(hand);
    
    setGameState(prev => ({
      ...prev,
      hand,
      selectedTile: null,
      isAnswered: false,
      correctAnswer,
      explanation: ''
    }));
    setProfessionalResult(null);
  };

  const handleTileClick = (tile: Tile) => {
    if (gameState.isAnswered) return;
    
    setGameState(prev => ({
      ...prev,
      selectedTile: tile
    }));
  };

  const handleSubmit = () => {
    if (!gameState.selectedTile || gameState.isAnswered) return;

    const result = analyzeProfessional(gameState.hand, gameState.selectedTile, gameState.turn);
    setProfessionalResult(result);

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      explanation: result.explanation
    }));
  };

  const handleModeChange = (mode: GameMode) => {
    setGameState(prev => ({ ...prev, mode }));
  };

  const handleTurnChange = (turn: number) => {
    setGameState(prev => ({ ...prev, turn }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 py-2 sm:py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-gray-100 rounded-lg lg:rounded-xl shadow-2xl p-3 sm:p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
              🀄 プロ級麻雀何切るクイズ
            </h1>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-700 underline text-sm sm:text-base"
            >
              トップへ戻る
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <ModeSelector mode={gameState.mode} onChange={handleModeChange} />
            <TurnSelector turn={gameState.turn} onChange={handleTurnChange} />
          </div>

          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
              どの牌を切りますか？
            </h2>
            <EnhancedGameTable
              hand={gameState.hand}
              selectedTile={gameState.selectedTile}
              onTileClick={handleTileClick}
              disabled={gameState.isAnswered}
              mode={gameState.mode}
              turn={gameState.turn}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={handleSubmit}
              disabled={!gameState.selectedTile || gameState.isAnswered}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base ${
                !gameState.selectedTile || gameState.isAnswered
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              決定
            </button>
            <button
              onClick={generateNewProblem}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              次の問題
            </button>
          </div>

          {gameState.isAnswered && professionalResult && (
            <ProfessionalExplanation result={professionalResult} />
          )}
        </div>
      </div>
    </div>
  );
}