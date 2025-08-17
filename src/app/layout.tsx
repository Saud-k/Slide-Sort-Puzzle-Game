
"use client";

import './globals.css';
import React from 'react';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faviconSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none'>
      <rect width='32' height='32' rx='8' fill='#34495E' />
      <rect x='4' y='4' width='8' height='8' rx='2' fill='#E0E0E0' />
      <rect x='13' y='4' width='8' height='8' rx='2' fill='#E0E0E0' />
      <rect x='22' y='4' width='6' height='8' rx='2' fill='#E0E0E0' />
      <rect x='4' y='13' width='8' height='8' rx='2' fill='#E0E0E0' />
      <rect x='13' y='13' width='8' height='8' rx='2' fill='#FF851B' />
      <rect x='4' y='22' width='8' height='6' rx='2' fill='#E0E0E0' />
      <rect x='13' y='22' width='8' height='6' rx='2' fill='#E0E0E0' />
      <rect x='22' y='13' width='6' height='15' rx='2' fill='#E0E0E0' />
    </svg>
  `;
  const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Slide Sort Puzzle</title>
        <meta name="description" content="A classic sliding puzzle game. Built for fun." />
        <link rel="icon" href={faviconDataUrl} type="image/svg+xml" />
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
