"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TOTAL_LEVELS = 10;
const STARTING_LEVEL = 3;

export default function LevelsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [maxLevel, setMaxLevel] = useState(STARTING_LEVEL);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user) {
        setIsFetching(true);
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // We still fetch maxLevel to color the completed levels, but it won't be used for locking.
            setMaxLevel(userDoc.data().maxLevel || STARTING_LEVEL);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        } finally {
          setIsFetching(false);
        }
      } else if (!loading) {
        // Not logged in
        setIsFetching(false);
      }
    };

    fetchUserProgress();
  }, [user, loading]);

  if (loading || isFetching) {
    return <div className="flex min-h-screen w-full flex-col items-center justify-center">Loading levels...</div>;
  }

  if (!user) {
     router.push('/signin');
     return null;
  }

  const levels = Array.from({ length: TOTAL_LEVELS - STARTING_LEVEL + 1 }, (_, i) => i + STARTING_LEVEL);

  const handleLevelSelect = (level: number) => {
    router.push(`/?level=${level}`);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8">
      <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="outline">Back to Game</Button>
        </Link>
      </div>
      <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline tracking-tight">
            Select a Level
          </CardTitle>
          <CardDescription>
            Completed levels are green. Click any level to play.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {levels.map((level) => {
              const isCompleted = level < maxLevel;
              
              return (
                <Button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={cn(
                    "h-24 text-2xl font-bold",
                    isCompleted && "bg-green-600 hover:bg-green-700 text-white",
                  )}
                >
                  {level}x{level}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
