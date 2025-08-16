"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  id: string;
  userName: string;
  level: number;
  moves: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!navigator.onLine) {
          setError("You are offline. Please connect to the internet to view the leaderboard.");
          setLoading(false);
          return;
      }
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('level', 'desc'), orderBy('moves', 'asc'), limit(100));
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
        
        const bestScores = new Map<string, LeaderboardEntry>();

        for (const entry of leaderboardData) {
            const existingEntry = bestScores.get(entry.userName);

            if (!existingEntry || entry.level > existingEntry.level || (entry.level === existingEntry.level && entry.moves < existingEntry.moves)) {
                bestScores.set(entry.userName, entry);
            }
        }
        
        const finalLeaderboard = Array.from(bestScores.values());
        
        finalLeaderboard.sort((a, b) => {
          if (b.level !== a.level) {
            return b.level - a.level;
          }
          return a.moves - b.moves;
        });

        setLeaderboard(finalLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Could not fetch leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8">
       <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="outline">Back to Game</Button>
        </Link>
      </div>
      <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline tracking-tight">
            Leaderboard
          </CardTitle>
          <CardDescription>
            Top players with the highest level and fewest moves.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
                <p>Loading leaderboard...</p>
            </div>
          ) : error ? (
             <div className="flex justify-center items-center h-40">
                <p className="text-destructive">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
             <div className="flex justify-center items-center h-40">
                <p>No scores yet. Be the first to set one!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                  <TableHead className="text-right">Total Moves</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{entry.userName}</TableCell>
                    <TableCell className="text-right">{entry.level}</TableCell>
                    <TableCell className="text-right">{entry.moves}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
