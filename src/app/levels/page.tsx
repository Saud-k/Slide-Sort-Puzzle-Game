
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UpgradeDialog } from '@/components/game/upgrade-dialog';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TOTAL_LEVELS = 10;
const STARTING_LEVEL = 3;

export default function LevelsPage() {
  const router = useRouter();
  const { user, loading, isPro, refreshUser } = useAuth();
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  if (loading) {
      return <div className="flex h-screen w-full flex-col items-center justify-center">Loading levels...</div>;
  }

  const levels = Array.from({ length: TOTAL_LEVELS - STARTING_LEVEL + 1 }, (_, i) => i + STARTING_LEVEL);

  const handleLevelSelect = (level: number) => {
    const isPremium = level > 7;
    if (isPremium && !isPro) {
      setShowUpgradeDialog(true);
      return;
    }
    router.push(`/game?level=${level}`);
  };

  const handleUpgrade = async () => {
    if (!user) {
        router.push('/signin');
        return;
    };
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { isPro: true }, { merge: true });
        await refreshUser();
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
              Click any level to play. {isPro ? "You have unlocked all levels!" : "Upgrade to Pro to unlock all levels."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <TooltipProvider>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levels.map((level) => {
                  const isPremium = level > 7;
                  const isLocked = isPremium && !isPro;
                  return (
                    <Tooltip key={level} delayDuration={isLocked ? 100 : 10000}>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Button
                            onClick={() => handleLevelSelect(level)}
                            className={cn(
                                "h-20 md:h-24 text-xl md:text-2xl font-bold w-full",
                                isLocked && "cursor-not-allowed bg-secondary hover:bg-secondary/80 text-muted-foreground"
                            )}
                            disabled={isLocked}
                          >
                            {isLocked ? <Lock className="w-8 h-8" /> : `${level}x${level}`}
                          </Button>
                          {isPremium && (
                            <div className="absolute top-1 right-1 text-yellow-500 bg-primary/20 rounded-full p-0.5">
                                <Sparkles className="w-3 h-3" />
                            </div>
                           )}
                        </div>
                      </TooltipTrigger>
                      {isLocked && (
                         <TooltipContent>
                            <p>Upgrade to Pro to unlock this level.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </main>
      <UpgradeDialog 
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
