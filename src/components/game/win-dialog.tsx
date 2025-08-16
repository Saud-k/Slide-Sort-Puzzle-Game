"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface WinDialogProps {
  isOpen: boolean;
  moves: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  isLastLevel: boolean;
}

export function WinDialog({ isOpen, moves, onNextLevel, onPlayAgain, isLastLevel }: WinDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
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
      </AlertDialogContent>
    </AlertDialog>
  );
}
