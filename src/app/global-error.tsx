
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
   useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <html>
      <body>
        <main className="flex h-screen w-full flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Application Error</h1>
                <p className="text-muted-foreground mb-4">
                    An unexpected error occurred. Please try again.
                </p>
                <Button onClick={() => reset()}>Try again</Button>
            </div>
        </main>
      </body>
    </html>
  );
}
