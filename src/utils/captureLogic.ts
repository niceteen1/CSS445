import { Piece, Position, GameState } from '../types/game';
import { BOARD_SIZE, getPieceAt } from './gameLogic';
import { isValidPosition } from './moveValidation';

export function isCaptureMove(from: Position, to: Position): boolean {
  return Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2;
}

export function getCapturedPosition(from: Position, to: Position): Position {
  return {
    row: from.row + Math.sign(to.row - from.row),
    col: from.col + Math.sign(to.col - from.col)
  };
}

export function getAvailableCaptures(piece: Piece, gameState: GameState): Position[] {
  const captures: Position[] = [];
  const directions: [number, number][] = piece.type === 'king' 
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : piece.player === 'red' 
      ? [[-1, -1], [-1, 1]] 
      : [[1, -1], [1, 1]];

  directions.forEach(([dr, dc]) => {
    const jumpOver = {
      row: piece.position.row + dr,
      col: piece.position.col + dc
    };
    
    const landing = {
      row: piece.position.row + (dr * 2),
      col: piece.position.col + (dc * 2)
    };
    
    const pieceToCapture = getPieceAt(gameState.pieces, jumpOver);
    
    if (pieceToCapture && 
        pieceToCapture.player !== piece.player && 
        isValidPosition(landing) && 
        !getPieceAt(gameState.pieces, landing)) {
      captures.push(landing);
    }
  });

  return captures;
}

export function hasMoreCaptures(piece: Piece, gameState: GameState): boolean {
  return getAvailableCaptures(piece, gameState).length > 0;
}