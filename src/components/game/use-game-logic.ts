
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Board, Position } from '@/lib/types';

const SHUFFLE_MOVES_MULTIPLIER = 50;

export const useGameLogic = (level: number) => {
  const [board, setBoard] = useState<Board>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const checkWin = useCallback((currentBoard: Board): boolean => {
    if (!currentBoard.length) return false;
    const boardSize = currentBoard.length;
    let count = 1;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (i === boardSize - 1 && j === boardSize - 1) {
          if (currentBoard[i][j] !== null) return false;
        } else {
          if (currentBoard[i][j] !== count) return false;
          count++;
        }
      }
    }
    return true;
  }, []);

  const findHole = (currentBoard: Board): Position | null => {
    const boardSize = currentBoard.length;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (currentBoard[i][j] === null) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  const shuffleBoard = useCallback((solvedBoard: Board): Board => {
    let shuffledBoard = JSON.parse(JSON.stringify(solvedBoard));
    const boardSize = shuffledBoard.length;
    let hole = findHole(shuffledBoard)!;

    for (let i = 0; i < boardSize * boardSize * SHUFFLE_MOVES_MULTIPLIER; i++) {
      const neighbors: Position[] = [];
      const { row, col } = hole;
      if (row > 0) neighbors.push({ row: row - 1, col });
      if (row < boardSize - 1) neighbors.push({ row: row + 1, col });
      if (col > 0) neighbors.push({ row, col: col - 1 });
      if (col < boardSize - 1) neighbors.push({ row, col: col + 1 });
      
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      shuffledBoard[row][col] = shuffledBoard[randomNeighbor.row][randomNeighbor.col];
      shuffledBoard[randomNeighbor.row][randomNeighbor.col] = null;
      hole = randomNeighbor;
    }
    
    if (checkWin(shuffledBoard)) {
        return shuffleBoard(solvedBoard);
    }

    return shuffledBoard;
  }, [checkWin]);

  const resetGame = useCallback((newLevel: number) => {
    setIsInitializing(true);
    setIsWon(false);
    setMoves(0);
    
    const solved = (() => {
      const newBoard: Board = [];
      let count = 1;
      for (let i = 0; i < newLevel; i++) {
        newBoard.push([]);
        for (let j = 0; j < newLevel; j++) {
          newBoard[i].push(count);
          count++;
        }
      }
      newBoard[newLevel - 1][newLevel - 1] = null;
      return newBoard;
    })();

    setTimeout(() => {
        const shuffled = shuffleBoard(solved);
        setBoard(shuffled);
        setIsInitializing(false);
    }, 50);
  }, [shuffleBoard]);
  
  useEffect(() => {
    resetGame(level);
  }, [level, resetGame]);

  const moveBlock = (row: number, col: number) => {
    if (isWon || isInitializing) return;

    const hole = findHole(board)!;
    const clicked = { row, col };

    if (clicked.row !== hole.row && clicked.col !== hole.col) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board));
    const boardSize = newBoard.length;

    if (clicked.row === hole.row) {
      const direction = clicked.col < hole.col ? 1 : -1;
      for (let i = hole.col; i !== clicked.col; i -= direction) {
        newBoard[hole.row][i] = newBoard[hole.row][i - direction];
      }
    } else {
      const direction = clicked.row < hole.row ? 1 : -1;
      for (let i = hole.row; i !== clicked.row; i -= direction) {
        newBoard[i][hole.col] = newBoard[i - direction][hole.col];
      }
    }

    newBoard[clicked.row][clicked.col] = null;
    setBoard(newBoard);
    const newMoves = moves + 1;
    setMoves(newMoves);

    if (checkWin(newBoard)) {
      setIsWon(true);
    }
  };

  return { board, moves, isWon, isInitializing, moveBlock, resetGame };
};
