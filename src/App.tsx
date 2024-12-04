import React, { useState } from 'react';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { GameState, Position, Player, Piece, GameHistory } from './types/game';
import { 
  getInitialPieces, 
  getValidMoves, 
  shouldPromoteToKing, 
  getPieceAt,
  getPieceCount
} from './utils/gameLogic';
import {
  isCaptureMove,
  getCapturedPosition,
  hasMoreCaptures
} from './utils/captureLogic';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    pieces: getInitialPieces(),
    currentPlayer: 'red',
    selectedPiece: null,
    validMoves: [],
    isCapturing: false,
    captureSequence: []
  });

  const [history, setHistory] = useState<GameHistory[]>([{
    pieces: getInitialPieces(),
    currentPlayer: 'red'
  }]);

  const handleSquareClick = (position: Position) => {
    const clickedPiece = getPieceAt(gameState.pieces, position);

    // If a piece is already selected, try to move it
    if (gameState.selectedPiece) {
      const isValidMove = gameState.validMoves.some(
        move => move.row === position.row && move.col === position.col
      );

      if (isValidMove) {
        // Move the piece
        let updatedPieces = gameState.pieces.map(p => {
          if (p === gameState.selectedPiece) {
            const shouldPromote = shouldPromoteToKing({
              ...p,
              position: position
            });

            return {
              ...p,
              position: position,
              type: shouldPromote ? 'king' : p.type
            };
          }
          return p;
        });

        // Handle captures
        if (isCaptureMove(gameState.selectedPiece.position, position)) {
          const capturedPosition = getCapturedPosition(
            gameState.selectedPiece.position,
            position
          );
          
          updatedPieces = updatedPieces.filter(p => 
            p.position.row !== capturedPosition.row || 
            p.position.col !== capturedPosition.col
          );

          const movedPiece = updatedPieces.find(p => 
            p.position.row === position.row && 
            p.position.col === position.col
          )!;

          // Check if there are more captures available
          if (hasMoreCaptures(movedPiece, { ...gameState, pieces: updatedPieces })) {
            setGameState({
              ...gameState,
              pieces: updatedPieces,
              selectedPiece: movedPiece,
              validMoves: getValidMoves(movedPiece, { ...gameState, pieces: updatedPieces }),
              isCapturing: true,
              captureSequence: [...gameState.captureSequence, position]
            });
            return;
          }
        }

        // End turn and save to history
        const nextPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';
        setHistory([...history, { pieces: updatedPieces, currentPlayer: nextPlayer }]);
        
        setGameState({
          pieces: updatedPieces,
          currentPlayer: nextPlayer,
          selectedPiece: null,
          validMoves: [],
          isCapturing: false,
          captureSequence: []
        });
      } else {
        // Deselect if clicking on an invalid move
        setGameState({
          ...gameState,
          selectedPiece: null,
          validMoves: [],
        });
      }
    } 
    // If no piece is selected, select a piece if it belongs to current player
    else if (clickedPiece && clickedPiece.player === gameState.currentPlayer) {
      const validMoves = getValidMoves(clickedPiece, gameState);
      setGameState({
        ...gameState,
        selectedPiece: clickedPiece,
        validMoves,
      });
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      setHistory(history.slice(0, -1));
      setGameState({
        pieces: previousState.pieces,
        currentPlayer: previousState.currentPlayer,
        selectedPiece: null,
        validMoves: [],
        isCapturing: false,
        captureSequence: []
      });
    }
  };

  const handleReset = () => {
    const initialState = {
      pieces: getInitialPieces(),
      currentPlayer: 'red'
    };
    setHistory([initialState]);
    setGameState({
      ...initialState,
      selectedPiece: null,
      validMoves: [],
      isCapturing: false,
      captureSequence: []
    });
  };

  const redPieces = getPieceCount(gameState.pieces, 'red');
  const blackPieces = getPieceCount(gameState.pieces, 'black');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">หมากฮอส - Thai Checkers</h1>
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="mb-4 text-xl font-semibold text-center">
          Current Player: {gameState.currentPlayer === 'red' ? '🔴 Red' : '⚫ Black'}
          {gameState.isCapturing && <span className="ml-2">(Must continue capturing)</span>}
        </div>
        <div className="mb-4 text-lg text-center">
          <span className="mr-4">🔴 Red: {redPieces}</span>
          <span>⚫ Black: {blackPieces}</span>
        </div>
        <GameControls
          onUndo={handleUndo}
          onReset={handleReset}
          canUndo={history.length > 1}
        />
        <Board 
          gameState={gameState}
          onSquareClick={handleSquareClick}
        />
      </div>
    </div>
  );
}

export default App;