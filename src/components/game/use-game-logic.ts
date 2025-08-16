"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Board, Position } from '@/lib/types';

const SHUFFLE_MOVES_MULTIPLIER = 50;

export const useGameLogic = (currentLevel: number) => {
  const [level, setLevel] = useState(currentLevel);
  const [board, setBoard] = useState<Board>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // When the level prop from the parent component changes, update the internal state.
  useEffect(() => {
    setLevel(currentLevel);
  }, [currentLevel]);

  const checkWin = useCallback((currentBoard: Board, boardLevel: number): boolean => {
    if (!currentBoard.length) return false;
    let count = 1;
    for (let i = 0; i < boardLevel; i++) {
      for (let j = 0; j < boardLevel; j++) {
        if (i === boardLevel - 1 && j === boardLevel - 1) {
          if (currentBoard[i][j] !== null) return false;
        } else {
          if (currentBoard[i][j] !== count) return false;
          count++;
        }
      }
    }
    return true;
  }, []);

  const findHole = (currentBoard: Board, boardLevel: number): Position | null => {
    for (let i = 0; i < boardLevel; i++) {
      for (let j = 0; j < boardLevel; j++) {
        if (currentBoard[i][j] === null) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  const shuffleBoard = useCallback((solvedBoard: Board, boardLevel: number): Board => {
    let shuffledBoard = JSON.parse(JSON.stringify(solvedBoard));
    let hole = findHole(shuffledBoard, boardLevel)!;

    for (let i = 0; i < boardLevel * boardLevel * SHUFFLE_MOVES_MULTIPLIER; i++) {
      const neighbors: Position[] = [];
      const { row, col } = hole;
      if (row > 0) neighbors.push({ row: row - 1, col });
      if (row < boardLevel - 1) neighbors.push({ row: row + 1, col });
      if (col > 0) neighbors.push({ row, col: col - 1 });
      if (col < boardLevel - 1) neighbors.push({ row, col: col + 1 });
      
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      shuffledBoard[row][col] = shuffledBoard[randomNeighbor.row][randomNeighbor.col];
      shuffledBoard[randomNeighbor.row][randomNeighbor.col] = null;
      hole = randomNeighbor;
    }
    
    if (checkWin(shuffledBoard, boardLevel)) {
        return shuffleBoard(solvedBoard, boardLevel);
    }

    return shuffledBoard;
  }, [checkWin]);

  const resetGame = useCallback((newLevel?: number) => {
    const boardLevel = newLevel || level;
    if (newLevel && newLevel !== level) {
      setLevel(newLevel);
      // Let the main effect handle the reset
      return;
    }
    setIsInitializing(true);
    setIsWon(false);
    setMoves(0);
    
    const solved = (() => {
      const newBoard: Board = [];
      let count = 1;
      for (let i = 0; i < boardLevel; i++) {
        newBoard.push([]);
        for (let j = 0; j < boardLevel; j++) {
          newBoard[i].push(count);
          count++;
        }
      }
      newBoard[boardLevel - 1][boardLevel - 1] = null;
      return newBoard;
    })();

    const shuffled = shuffleBoard(solved, boardLevel);
    setBoard(shuffled);
    setTimeout(() => setIsInitializing(false), 300);
  }, [level, shuffleBoard]);
  
  useEffect(() => {
    resetGame();
  }, [level, resetGame]);

  const moveBlock = (row: number, col: number) => {
    if (isWon || isInitializing) return;

    const hole = findHole(board, level)!;
    const clicked = { row, col };

    if (clicked.row !== hole.row && clicked.col !== hole.col) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board));

    if (clicked.row === hole.row) { // Horizontal move
      const direction = clicked.col < hole.col ? 1 : -1;
      for (let i = hole.col; i !== clicked.col; i -= direction) {
        newBoard[hole.row][i] = newBoard[hole.row][i - direction];
      }
    } else { // Vertical move
      const direction = clicked.row < hole.row ? 1 : -1;
      for (let i = hole.row; i !== clicked.row; i -= direction) {
        newBoard[i][hole.col] = newBoard[i - direction][hole.col];
      }
    }

    newBoard[clicked.row][clicked.col] = null;
    setBoard(newBoard);
    const newMoves = moves + 1;
    setMoves(newMoves);

    if (checkWin(newBoard, level)) {
      setIsWon(true);
    }
  };

  return { board, moves, isWon, isInitializing, moveBlock, resetGame, setLevel };
};
