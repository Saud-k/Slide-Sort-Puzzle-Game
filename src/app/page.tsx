"use client";

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const [level, setLevel] = useState(3);
  const [maxLevel, setMaxLevel] = useState(3);
  const { board, moves, isWon, isInitializing, moveBlock, resetGame, setLevel: setGameLevel } = useGameLogic(level);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setLevel(userData.currentLevel || 3);
          setGameLevel(userData.currentLevel || 3);
          setMaxLevel(userData.maxLevel || 3);
        } else {
          // New user, set initial data
          await setDoc(userDocRef, { 
            email: user.email, 
            displayName: user.displayName || 'Anonymous',
            currentLevel: 3, 
            maxLevel: 3 
          });
        }
      }
    };
    if (!loading) {
      fetchUserProgress();
    }
  }, [user, loading, setGameLevel]);

  const handleNextLevel = async () => {
    const nextLevel = level + 1;
    if (nextLevel <= 10) { // Max level 10
      const newMaxLevel = Math.max(maxLevel, nextLevel);
      setLevel(nextLevel);
      setMaxLevel(newMaxLevel);
      if(user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { currentLevel: nextLevel, maxLevel: newMaxLevel }, { merge: true });
        // Also update leaderboard
        const leaderboardDocRef = doc(db, 'leaderboard', `${user.uid}_level_${level}`);
        await setDoc(leaderboardDocRef, {
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          level: level,
          moves: moves,
          timestamp: new Date(),
        }, {merge: true});

      }
      resetGame(nextLevel);
    }
  };
  
  const handlePlayAgain = () => {
    resetGame(level);
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  };

  if (loading) {
    return <div className="flex min-h-screen w-full flex-col items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline tracking-tight">
              Welcome to Slide Sort!
            </CardTitle>
            <CardDescription>
              Sign in to save your progress and compete on the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Link href="/signin" passHref>
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="outline" size="lg">Sign Up</Button>
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
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
       <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{user.displayName || 'Welcome'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Avatar>
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
        <Link href="/leaderboard" passHref>
            <Button variant="link">Leaderboard</Button>
        </Link>
      </div>
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
                <p>Level: {level} x {level}</p>
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
        isLastLevel={level >= maxLevel}
      />

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>A classic sliding puzzle game. Built for fun.</p>
      </footer>
    </main>
  );
}
