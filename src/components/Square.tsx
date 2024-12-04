import React from 'react';
import { Position } from '../types/game';

interface SquareProps {
  isBlack: boolean;
  isValidMove: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export function Square({ isBlack, isValidMove, onClick, children }: SquareProps) {
  return (
    <div 
      className={`
        w-16 h-16 flex items-center justify-center
        ${isBlack ? 'bg-gray-800' : 'bg-gray-200'}
        ${isValidMove ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
        cursor-pointer
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}