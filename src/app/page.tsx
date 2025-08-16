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
  const { board, moves, isWon, isInitializing, moveBlock, resetGame } = useGameLogic(level);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentLevel = userData.currentLevel || 3;
          setLevel(currentLevel);
          setMaxLevel(userData.maxLevel || 3);
          resetGame(currentLevel); // Reset game with fetched level
        } else {
          // New user, set initial data
          await setDoc(userDocRef, { 
            email: user.email, 
            displayName: user.displayName || 'Anonymous',
            currentLevel: 3, 
            maxLevel: 3 
          });
          resetGame(3);
        }
      } else {
        resetGame(3); // For non-logged-in users
      }
    };
    if (!loading) {
      fetchUserProgress();
    }
  }, [user, loading]);

  const handleNextLevel = async () => {
    const nextLevel = level + 1;
    if (nextLevel <= 10) { // Max level 10
      if(user) {
        // Save old level's score first
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
        
        // Then update user's current level
        const newMaxLevel = Math.max(maxLevel, nextLevel);
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { currentLevel: nextLevel, maxLevel: newMaxLevel }, { merge: true });
        setMaxLevel(newMaxLevel);
      }
      setLevel(nextLevel);
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
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline tracking-tight">
              Welcome to Slide Sort!
            </CardTitle>
            <CardDescription>
              Sign in to save your progress and compete on the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
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
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
       <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-sm">{user.displayName || 'Welcome'}</p>
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
      <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center px-4 pt-4 pb-2">
          <CardTitle className="text-2xl font-headline tracking-tight">
            Slide Sort Puzzle
          </CardTitle>
          <CardDescription className="text-sm">
            Arrange the numbers in order.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-4">
          <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex items-center gap-2 text-sm">
                <p>Level: {level} x {level}</p>
              </div>
              <div className="font-mono text-base p-2 px-3 rounded-md bg-muted">
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
