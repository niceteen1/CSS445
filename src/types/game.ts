export type Player = 'red' | 'black';
export type PieceType = 'normal' | 'king';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  player: Player;
  type: PieceType;
  position: Position;
}

export interface GameState {
  pieces: Piece[];
  currentPlayer: Player;
  selectedPiece: Piece | null;
  validMoves: Position[];
  isCapturing: boolean;
  captureSequence: Position[];
}

export interface GameHistory {
  pieces: Piece[];
  currentPlayer: Player;
}