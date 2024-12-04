import { Piece, Position, Player, GameState } from '../types/game';
import { isValidPosition, getDiagonalMoves } from './moveValidation';
import { getAvailableCaptures } from './captureLogic';

export const BOARD_SIZE = 8;
export const PIECES_PER_PLAYER = 8;

export function getInitialPieces(): Piece[] {
  const pieces: Piece[] = [];
  let blackCount = 0;
  let redCount = 0;
  
  // Setup black pieces - exactly 8 pieces
  for (let row = 0; row < 3 && blackCount < PIECES_PER_PLAYER; row++) {
    for (let col = (row % 2 === 0 ? 1 : 0); col < BOARD_SIZE && blackCount < PIECES_PER_PLAYER; col += 2) {
      pieces.push({
        player: 'black',
        type: 'normal',
        position: { row, col }
      });
      blackCount++;
    }
  }
  
  // Setup red pieces - exactly 8 pieces
  for (let row = BOARD_SIZE - 1; row >= BOARD_SIZE - 3 && redCount < PIECES_PER_PLAYER; row--) {
    for (let col = (row % 2 === 0 ? 1 : 0); col < BOARD_SIZE && redCount < PIECES_PER_PLAYER; col += 2) {
      pieces.push({
        player: 'red',
        type: 'normal',
        position: { row, col }
      });
      redCount++;
    }
  }
  
  return pieces;
}

export function getPieceAt(pieces: Piece[], position: Position): Piece | null {
  return pieces.find(p => 
    p.position.row === position.row && p.position.col === position.col
  ) || null;
}

export function getValidMoves(piece: Piece, gameState: GameState): Position[] {
  // If we're in a capture sequence, only return capture moves
  if (gameState.isCapturing) {
    return getAvailableCaptures(piece, gameState);
  }

  if (piece.type === 'king') {
    // Kings can move in all diagonal directions like a bishop
    const directions: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return directions.flatMap(direction => getDiagonalMoves(piece, gameState, direction));
  } else {
    // Normal pieces can only move one step diagonally forward or capture by jumping
    const moves: Position[] = [];
    const directions: [number, number][] = piece.player === 'red' 
      ? [[-1, -1], [-1, 1]]  // Red moves up
      : [[1, -1], [1, 1]];   // Black moves down
    
    // First check for any available captures
    const captures = getAvailableCaptures(piece, gameState);
    if (captures.length > 0) {
      return captures;
    }

    // If no captures available, check normal moves
    directions.forEach(([dr, dc]) => {
      const newPos = {
        row: piece.position.row + dr,
        col: piece.position.col + dc
      };
      
      if (isValidPosition(newPos) && !getPieceAt(gameState.pieces, newPos)) {
        moves.push(newPos);
      }
    });

    return moves;
  }
}

export function shouldPromoteToKing(piece: Piece): boolean {
  return (piece.player === 'red' && piece.position.row === 0) ||
         (piece.player === 'black' && piece.position.row === BOARD_SIZE - 1);
}

export function getPieceCount(pieces: Piece[], player: Player): number {
  return pieces.filter(p => p.player === player).length;
}