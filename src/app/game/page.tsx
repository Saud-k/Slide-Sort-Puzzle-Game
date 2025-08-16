"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/game/game-board';
import { useGameLogic } from '@/components/game/use-game-logic';
import { WinDialog } from '@/components/game/win-dialog';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GamePage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [level, setLevel] = useState(3);
  
  const { board, moves, isWon, isInitializing, moveBlock, resetGame } = useGameLogic(level);
  
  useEffect(() => {
    const levelFromQuery = searchParams.get('level');
    if (levelFromQuery) {
      const newLevel = parseInt(levelFromQuery, 10);
      if (!isNaN(newLevel) && newLevel >= 3 && newLevel <= 10) {
        setLevel(newLevel);
      }
    }
  }, [searchParams]);

  const saveProgress = useCallback(async () => {
    if (user && navigator.onLine) {
        try {
            const leaderboardDocRef = doc(db, 'leaderboard', `${user.uid}_level_${level}`);
            const currentBestDoc = await getDoc(leaderboardDocRef);

            if (!currentBestDoc.exists() || moves < currentBestDoc.data().moves) {
                await setDoc(leaderboardDocRef, {
                    userId: user.uid,
                    userName: user.displayName || 'Anonymous',
                    level: level,
                    moves: moves,
                    timestamp: new Date(),
                });
            }
        } catch (e) {
            console.error("Error saving leaderboard score:", e);
        }
    }
  }, [user, level, moves]);


  const handleNextLevel = useCallback(() => {
    saveProgress();
    const nextLevel = level + 1;
    if (nextLevel > 10) return;
    router.push(`/game?level=${nextLevel}`);
  }, [level, saveProgress, router]);
  
  const handlePlayAgain = useCallback(() => {
    saveProgress();
    resetGame(level);
  }, [level, resetGame, saveProgress]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const resetCurrentLevel = () => {
    resetGame(level);
  };

  if (loading) {
    return <div className="flex h-screen w-full flex-col items-center justify-center">Loading...</div>;
  }
  
  return (
    <main className="flex h-screen w-full flex-col items-center p-2 sm:p-4">
       <header className="w-full max-w-md mx-auto flex justify-between items-center mb-2">
        <Link href="/levels" passHref>
          <Button variant="outline" size="sm">Choose Level</Button>
        </Link>
        { user && (
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-xs font-medium">{user.displayName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign Out</Button>
                <Link href="/leaderboard" passHref>
                    <Button variant="link" size="sm">Leaderboard</Button>
                </Link>
            </div>
        )}
        { !user && (
            <div className="flex items-center gap-2">
                <Link href="/leaderboard" passHref>
                    <Button variant="outline" size="sm">Leaderboard</Button>
                </Link>
                <Link href="/signin" passHref>
                    <Button size="sm">Sign In</Button>
                </Link>
            </div>
        )}
      </header>

      <div className="flex-grow flex items-center justify-center w-full">
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center p-3 md:p-4">
            <CardTitle className="text-xl md:text-2xl font-headline tracking-tight">
                Slide Sort Puzzle
            </CardTitle>
            <CardDescription className="text-xs">
                Arrange the numbers in order.
            </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 p-3 md:p-4">
            <div className="flex items-center gap-4 w-full justify-center">
                <div className="flex items-center gap-2 text-sm">
                    <p>Size: {level}x{level}</p>
                </div>
                <div className="font-mono text-base p-1 px-3 rounded-md bg-muted">
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
            <Button variant="outline" onClick={resetCurrentLevel} className="mt-2" size="sm">
                Reset
            </Button>

            </CardContent>
        </Card>
      </div>
      
      <WinDialog 
        isOpen={isWon} 
        moves={moves} 
        onNextLevel={handleNextLevel}
        onPlayAgain={handlePlayAgain}
        isLastLevel={level >= 10}
      />

      <footer className="w-full text-center text-xs text-muted-foreground p-2">
        <p>A classic sliding puzzle game. Built for fun.</p>
      </footer>
    </main>
  );
}
