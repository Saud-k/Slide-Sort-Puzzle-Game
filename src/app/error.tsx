
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Error({
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
    <main className="flex h-full w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>{error.message || "An unexpected error occurred."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => reset()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
