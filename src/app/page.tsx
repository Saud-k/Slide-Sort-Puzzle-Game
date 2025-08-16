"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameBoard } from '@/components/game/game-board';
import { useGameLogic } from '@/components/game/use-game-logic';
import { WinDialog } from '@/components/game/win-dialog';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [level, setLevel] = useState(3);
  const { board, moves, isWon, isInitializing, moveBlock, resetGame } = useGameLogic(level);

  const handleLevelChange = (value: string) => {
    setLevel(Number(value));
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline tracking-tight">
            Slide Sort Puzzle
          </CardTitle>
          <CardDescription>
            Arrange the numbers in order. Click a tile to move it to the empty space.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <div className="flex items-center gap-2">
                <Label htmlFor="level-select">Level:</Label>
                <Select
                  value={String(level)}
                  onValueChange={handleLevelChange}
                  disabled={isInitializing}
                >
                  <SelectTrigger id="level-select" className="w-[120px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => i + 3).map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} x {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="font-mono text-lg p-2 px-4 rounded-md bg-muted">
                Moves: <span className="font-bold">{moves}</span>
              </div>
          </div>
          
          <GameBoard 
            level={level}
            board={board}
            isInitializing={isInitializing}
            isWon={isWon}
            moveBlock={moveBlock}
          />

        </CardContent>
      </Card>
      
      <WinDialog isOpen={isWon} moves={moves} onPlayAgain={resetGame} />

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>A classic sliding puzzle game. Built for fun.</p>
      </footer>
    </main>
  );
}
