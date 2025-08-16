"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  const [showDialog, setShowDialog] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handlePlayClick = () => {
    if (user) {
      router.push('/game');
    } else {
      setShowDialog(true);
    }
  };

  if (loading) {
    return <div className="flex h-screen w-full flex-col items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
         <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl md:text-4xl font-headline tracking-tighter">
            Slide Sort
          </CardTitle>
          <CardDescription className="text-base md:text-lg text-muted-foreground pt-2">
            The classic sliding puzzle.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6 pt-0">
          <Button onClick={handlePlayClick} className="w-full" size="lg">Play</Button>
          <Link href="/leaderboard" passHref className="w-full">
            <Button variant="outline" className="w-full" size="lg">Leaderboard</Button>
          </Link>
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play Slide Sort</DialogTitle>
            <DialogDescription>
              Sign up or sign in to save your progress and compete on the leaderboard. Or play as a guest.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Link href="/game" passHref>
              <Button variant="secondary" className="w-full">Play Anyway</Button>
            </Link>
            <Link href="/signin" passHref>
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="outline" className="w-full">Sign Up</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
       <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
         <p>A classic sliding puzzle game. Built for fun.</p>
      </footer>
    </main>
  );
}
