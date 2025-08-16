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

export default function Home() {
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
    router.push(`/?level=${nextLevel}`);
  }, [level, saveProgress, router]);
  
  const handlePlayAgain = useCallback(() => {
    saveProgress();
    resetGame(level);
  }, [level, resetGame, saveProgress]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  };

  if (loading) {
    return <div className="flex min-h-screen w-full flex-col items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center p-4 md:p-6">
            <CardTitle className="text-2xl md:text-3xl font-headline tracking-tight">
              Welcome to Slide Sort!
            </CardTitle>
            <CardDescription>
              Sign in to save your progress and compete on the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 p-4 md:p-6">
            <Link href="/signin" passHref>
              <Button>Sign In</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="outline">Sign Up</Button>
            </Link>
             <Link href="/leaderboard" passHref>
              <Button variant="link">View Leaderboard</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-6 lg:p-8">
       <div className="absolute top-4 right-4 flex items-center gap-2 sm:gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-sm truncate">{user.displayName || 'Welcome'}</p>
        </div>
        <Avatar>
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign Out</Button>
        <Link href="/leaderboard" passHref>
            <Button variant="link" size="sm">Leaderboard</Button>
        </Link>
      </div>
       <div className="absolute top-4 left-4">
        <Link href="/levels" passHref>
          <Button variant="outline">Choose Level</Button>
        </Link>
      </div>
      <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm mt-16 md:mt-0">
        <CardHeader className="text-center p-4 md:p-6">
          <CardTitle className="text-2xl md:text-3xl font-headline tracking-tight">
            Slide Sort Puzzle
          </CardTitle>
          <CardDescription className="text-sm">
            Arrange the numbers in order.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-4 md:p-6">
          <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex items-center gap-2 text-base">
                <p>Size: {level}x{level}</p>
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
      
      <WinDialog 
        isOpen={isWon} 
        moves={moves} 
        onNextLevel={handleNextLevel}
        onPlayAgain={handlePlayAgain}
        isLastLevel={level >= 10}
      />

      <footer className="mt-6 text-center text-xs text-muted-foreground">
        <p>A classic sliding puzzle game. Built for fun.</p>
      </footer>
    </main>
  );
}
