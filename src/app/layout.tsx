
"use client";

import './globals.css';
import React from 'react';
import { Providers } from './providers';

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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
