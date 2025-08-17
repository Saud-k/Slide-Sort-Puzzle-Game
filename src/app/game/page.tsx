
"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { UpgradeDialog } from '@/components/game/upgrade-dialog';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function Game() {
    const { user, loading, isPro, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [level, setLevel] = useState(3);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

    const { board, moves, isWon, isInitializing, moveBlock, resetGame } = useGameLogic(level);

    useEffect(() => {
      const levelFromQuery = searchParams.get('level');
      if (levelFromQuery) {
        const newLevel = parseInt(levelFromQuery, 10);
        if (!isNaN(newLevel) && newLevel >= 3 && newLevel <= 10) {
          if (newLevel > 7 && !isPro) {
            router.push('/levels');
            return;
          }
          setLevel(newLevel);
        }
      } else {
          setLevel(3);
      }
    }, [searchParams, isPro, router]);

    const saveProgress = useCallback(async () => {
      if (user && typeof navigator !== 'undefined' && navigator.onLine) {
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
       if (nextLevel > 7 && !isPro) {
        setShowUpgradeDialog(true);
        return;
      }
      router.push(`/game?level=${nextLevel}`);
    }, [level, saveProgress, router, isPro]);

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

    const handleUpgrade = async () => {
        if (!user) return;
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { isPro: true }, { merge: true });
            await refreshUser(); // Refresh user data to get new isPro status
            toast({
                title: "Congratulations!",
                description: "You've unlocked all premium levels.",
            });
            setShowUpgradeDialog(false);
        } catch (error) {
            toast({
                title: "Upgrade Failed",
                description: "Could not complete the upgrade. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
      return <div className="flex h-full w-full flex-col items-center justify-center">Loading...</div>;
    }

    return (
      <>
        <main className="flex h-full w-full flex-col md:flex-row p-2 sm:p-4 gap-4 md:gap-8">
          <div className="w-full md:w-64 flex flex-col gap-4 p-4 border-b md:border-b-0 md:border-r">
            <Link href="/" passHref>
              <div className="flex flex-col items-center text-center cursor-pointer">
                  <CardTitle className="text-2xl md:text-3xl font-headline tracking-tight">
                      Slide Sort
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                      Arrange the numbers in order.
                  </CardDescription>
              </div>
            </Link>
            
            <Separator />

            {user ? (
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{user.displayName}</span>
                        {isPro && <Sparkles className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign Out</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Link href="/signin" passHref className="w-full">
                        <Button size="sm" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/signup" passHref className="w-full">
                        <Button size="sm" variant="outline" className="w-full">Sign Up</Button>
                    </Link>
                </div>
            )}

            <Separator />
            
            <div className="flex flex-col items-center gap-2">
                <div className="text-lg">
                    <p>Size: <span className="font-bold">{level}x{level}</span></p>
                </div>
                <div className="font-mono text-xl p-2 px-4 rounded-md bg-muted">
                    Moves: <span className="font-bold">{moves}</span>
                </div>
            </div>

            <Separator />
            
            <div className="flex flex-col gap-2 mt-auto">
                {user && !isPro && (
                  <Button variant="default" onClick={() => setShowUpgradeDialog(true)}>
                    <Sparkles className="mr-2 h-4 w-4" /> Upgrade to Pro
                  </Button>
                )}
                <Button variant="outline" onClick={resetCurrentLevel}>
                    Reset Level
                </Button>
                <Link href="/levels" passHref>
                    <Button variant="secondary" className="w-full">Choose Level</Button>
                </Link>
                <Link href="/leaderboard" passHref>
                    <Button variant="secondary" className="w-full">Leaderboard</Button>
                </Link>
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-2 md:p-4">
                  <GameBoard 
                      level={level}
                      board={board}
                      isInitializing={isInitializing}
                      isWon={isWon}
                      moveBlock={moveBlock}
                  />
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
        </main>
        <UpgradeDialog
            isOpen={showUpgradeDialog}
            onClose={() => setShowUpgradeDialog(false)}
            onUpgrade={handleUpgrade}
        />
      </>
    );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full flex-col items-center justify-center">Loading Level...</div>}>
      <Game />
    </Suspense>
  );
}
