import React from 'react';
import { Crown } from 'lucide-react';
import { Piece as PieceType } from '../types/game';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
}

export function Piece({ piece, isSelected }: PieceProps) {
  return (
    <div
      className={`
        w-12 h-12 rounded-full 
        ${piece.player === 'red' ? 'bg-red-600' : 'bg-gray-900'}
        ${isSelected ? 'ring-4 ring-blue-400' : ''}
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        transform ${isSelected ? 'scale-110' : ''}
      `}
    >
      {piece.type === 'king' && (
        <Crown className="w-6 h-6 text-yellow-400" />
      )}
    </div>
  );
}