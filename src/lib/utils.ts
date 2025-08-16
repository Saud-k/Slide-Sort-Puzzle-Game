import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address you entered is not valid. Please check and try again.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/email-already-in-use":
      return "This email address is already in use by another account.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password (at least 6 characters).";
    case "auth/requires-recent-login":
      return "This action requires you to have recently signed in. Please sign in again.";
    case "auth/too-many-requests":
        return "We have detected too many requests from your device. Please wait a while and try again.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
}
