"use client";

import React from 'react';
import type { Board, Position } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface GameBoardProps {
  level: number;
  board: Board;
  isInitializing: boolean;
  isWon: boolean;
  moveBlock: (row: number, col: number) => void;
}

function findHole(board: Board, level: number): Position | null {
  if (!board.length) return null;
  for (let i = 0; i < level; i++) {
    for (let j = 0; j < level; j++) {
      if (board[i][j] === null) {
        return { row: i, col: j };
      }
    }
  }
  return null;
}

export function GameBoard({ level, board, isInitializing, isWon, moveBlock }: GameBoardProps) {
  const baseSize = 280;
  const maxSize = 400;
  const boardSize = `clamp(${baseSize}px, 80vmin, ${maxSize}px)`;

  if (isInitializing || !board.length) {
    return (
      <div 
        className="grid gap-1 p-2 bg-primary/10 rounded-lg shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${level}, minmax(0, 1fr))`,
          width: boardSize,
          height: boardSize,
        }}
      >
        {Array.from({ length: level * level }).map((_, i) => (
          <Skeleton key={i} className="w-full h-full rounded-md bg-primary/20" />
        ))}
      </div>
    );
  }

  const hole = findHole(board, level);

  return (
    <div
      className="grid gap-1 p-1 bg-primary/10 rounded-lg shadow-inner transition-all duration-300"
      style={{
        gridTemplateColumns: `repeat(${level}, minmax(0, 1fr))`,
        width: boardSize,
        height: boardSize,
      }}
      aria-label="Game Board"
    >
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const isMovable = hole ? (rowIndex === hole.row || colIndex === hole.col) && !isWon : false;
          const isHole = tile === null;
          const fontSize = `clamp(0.75rem, ${12 / level}vmin, 1.25rem)`;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="relative w-full h-full"
            >
              <Button
                variant="secondary"
                onClick={() => moveBlock(rowIndex, colIndex)}
                disabled={isHole || isWon}
                className={cn(
                  'w-full h-full font-bold rounded-sm transition-all duration-300 ease-in-out transform-gpu focus:ring-accent focus:ring-offset-2 focus:ring-2 p-0',
                  isHole ? 'opacity-0 cursor-default' : 'shadow-md hover:shadow-lg',
                  isMovable ? 'cursor-pointer hover:bg-accent hover:text-accent-foreground' : 'cursor-not-allowed',
                  isWon && !isHole ? 'bg-green-500/80 text-white cursor-not-allowed' : 'bg-secondary text-secondary-foreground',
                )}
                aria-label={isHole ? 'Empty space' : `Tile ${tile}`}
                style={{
                  fontSize,
                  transitionProperty: 'background-color, color, transform, box-shadow, opacity',
                }}
              >
                {tile}
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
}
