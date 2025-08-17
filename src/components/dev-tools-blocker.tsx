
"use client";

import { useEffect } from 'react';

export function DevToolsBlocker() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    const checkDevTools = () => {
        const threshold = 160;
        if (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        ) {
          debugger;
        }
    }

    const intervalId = setInterval(checkDevTools, 500);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
