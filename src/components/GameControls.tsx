import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export function GameControls({ onUndo, onReset, canUndo }: GameControlsProps) {
  return (
    <div className="flex gap-4 justify-center my-4">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${canUndo 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          transition-colors duration-200
        `}
      >
        <Undo2 className="w-5 h-5" />
        Undo
      </button>
      <button
        onClick={onReset}
        className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-red-500 hover:bg-red-600 text-white
          transition-colors duration-200
        "
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </button>
    </div>
  );
}