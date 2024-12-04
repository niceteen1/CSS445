import React from 'react';
import { Square } from './Square';
import { Piece } from './Piece';
import { GameState, Position } from '../types/game';
import { BOARD_SIZE, getPieceAt } from '../utils/gameLogic';

interface BoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
}

export function Board({ gameState, onSquareClick }: BoardProps) {
  const renderSquare = (row: number, col: number) => {
    const isBlack = (row + col) % 2 === 1;
    const piece = getPieceAt(gameState.pieces, { row, col });
    const isValidMove = gameState.validMoves.some(
      move => move.row === row && move.col === col
    );

    return (
      <Square
        key={`${row}-${col}`}
        isBlack={isBlack}
        isValidMove={isValidMove}
        onClick={() => onSquareClick({ row, col })}
      >
        {piece && (
          <Piece
            piece={piece}
            isSelected={piece === gameState.selectedPiece}
          />
        )}
      </Square>
    );
  };

  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-gray-800">
      {Array.from({ length: BOARD_SIZE }, (_, row) => (
        Array.from({ length: BOARD_SIZE }, (_, col) => renderSquare(row, col))
      ))}
    </div>
  );
}