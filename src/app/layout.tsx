
"use client";

import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Slide Sort Puzzle</title>
        <meta name="description" content="A classic sliding puzzle game. Built for fun." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased h-full">
        <AuthProvider>
          <>
            {children}
            <Toaster />
          </>
        </AuthProvider>
      </body>
    </html>
  );
}
