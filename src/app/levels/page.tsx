
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const TOTAL_LEVELS = 10;
const STARTING_LEVEL = 3;

export default function LevelsPage() {
  const router = useRouter();
  const { loading } = useAuth();
  
  if (loading) {
      return <div className="flex h-screen w-full flex-col items-center justify-center">Loading levels...</div>;
  }

  const levels = Array.from({ length: TOTAL_LEVELS - STARTING_LEVEL + 1 }, (_, i) => i + STARTING_LEVEL);

  const handleLevelSelect = (level: number) => {
    router.push(`/game?level=${level}`);
  };

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-center p-4 md:p-6 lg:p-8">
        <header className="w-full max-w-2xl mx-auto mb-4 self-start absolute top-4 left-1/2 -translate-x-1/2">
          <Link href="/game" passHref>
            <Button variant="outline">Back to Game</Button>
          </Link>
        </header>
        <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center p-4 md:p-6">
            <CardTitle className="text-2xl md:text-3xl font-headline tracking-tight">
              Select a Level
            </CardTitle>
            <CardDescription>
              Click any level to play.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levels.map((level) => {
                  return (
                    <div key={level} className="relative">
                      <Button
                        onClick={() => handleLevelSelect(level)}
                        className={cn(
                            "h-20 md:h-24 text-xl md:text-2xl font-bold w-full"
                        )}
                      >
                       {`${level}x${level}`}
                      </Button>
                    </div>
                  );
                })}
              </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
