import { Piece, Position, GameState } from '../types/game';
import { BOARD_SIZE, getPieceAt } from './gameLogic';

export function isValidPosition(position: Position): boolean {
  return position.row >= 0 && position.row < BOARD_SIZE && 
         position.col >= 0 && position.col < BOARD_SIZE;
}

export function getDiagonalMoves(
  piece: Piece,
  gameState: GameState,
  direction: [number, number],
  maxSteps: number = BOARD_SIZE
): Position[] {
  const moves: Position[] = [];
  const [dr, dc] = direction;
  let steps = 1;
  
  while (steps <= maxSteps) {
    const newPos = {
      row: piece.position.row + (dr * steps),
      col: piece.position.col + (dc * steps)
    };
    
    if (!isValidPosition(newPos)) break;
    
    const pieceAtPosition = getPieceAt(gameState.pieces, newPos);
    if (!pieceAtPosition) {
      moves.push(newPos);
    } else {
      // If we hit an opponent's piece, check if we can capture
      if (pieceAtPosition.player !== piece.player) {
        const capturePos = {
          row: newPos.row + dr,
          col: newPos.col + dc
        };
        if (isValidPosition(capturePos) && !getPieceAt(gameState.pieces, capturePos)) {
          moves.push(capturePos);
        }
      }
      break;
    }
    steps++;
  }
  
  return moves;
}