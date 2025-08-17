
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeDialog({ isOpen, onClose, onUpgrade }: UpgradeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-yellow-500" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Upgrade to Pro!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Unlock the most challenging levels (8x8, 9x9, and 10x10) and prove your mastery.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          <Button onClick={onUpgrade}>
            Upgrade Now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
