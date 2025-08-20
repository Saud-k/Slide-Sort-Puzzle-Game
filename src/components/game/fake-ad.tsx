"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface FakeAdProps {
  onAdComplete: () => void;
  duration?: number;
}

export function FakeAd({ onAdComplete, duration = 5 }: FakeAdProps) {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (duration <= 0) {
      onAdComplete();
      return;
    }
    
    const progressIncrement = 100 / (duration * 20);
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onAdComplete, 300);
          return 100;
        }
        return newProgress;
      });
    }, 50); // 20 times a second

    const countdownInterval = setInterval(() => {
       setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);


    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    }
  }, [duration, onAdComplete]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm text-muted-foreground">Ad will close in {countdown}s</p>
      <Card className="w-full bg-muted overflow-hidden">
        <CardContent className="p-0 flex items-center justify-center aspect-video relative">
            <Image
                src="https://placehold.co/400x225.png"
                alt="Ad Placeholder"
                width={400}
                height={225}
                data-ai-hint="advertisement billboard"
                className="w-full h-full object-cover"
            />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white p-4">
              <h3 className="text-2xl font-bold text-center">Your Advertisement Here!</h3>
           </div>
        </CardContent>
      </Card>
      <Progress value={progress} className="w-full h-2" />
    </div>
  );
}
