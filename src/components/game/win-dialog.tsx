"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface WinDialogProps {
  isOpen: boolean;
  moves: number;
  onPlayAgain: () => void;
}

export function WinDialog({ isOpen, moves, onPlayAgain }: WinDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onPlayAgain()}>
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
        <AlertDialogFooter>
          <AlertDialogAction onClick={onPlayAgain} className="w-full">
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
