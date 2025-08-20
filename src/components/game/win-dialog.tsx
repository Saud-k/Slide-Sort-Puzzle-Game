"use client";

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { FakeAd } from './fake-ad';

interface WinDialogProps {
  isOpen: boolean;
  moves: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  isLastLevel: boolean;
}

export function WinDialog({ isOpen, moves, onNextLevel, onPlayAgain, isLastLevel }: WinDialogProps) {
  const [showAd, setShowAd] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Don't show ads for the final level completion
      if (!isLastLevel) {
        setShowAd(true);
        setAdCompleted(false);
      } else {
        setShowAd(false);
        setAdCompleted(true);
      }
    }
  }, [isOpen, isLastLevel]);

  const handleAdComplete = () => {
    setShowAd(false);
    setAdCompleted(true);
  };
  
  const showWinContent = isOpen && (!showAd || adCompleted);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        {showAd && !adCompleted && <FakeAd onAdComplete={handleAdComplete} />}
        
        {showWinContent && (
          <>
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <AlertDialogTitle className="text-center text-2xl font-bold">
                Congratulations!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                You solved the puzzle in {moves} moves.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <Button variant="outline" onClick={onPlayAgain}>Play Same Level</Button>
              {!isLastLevel && (
                <Button onClick={onNextLevel}>
                  Next Level
                </Button>
              )}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
