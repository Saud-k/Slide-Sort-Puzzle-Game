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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const q = query(collection(db, 'leaderboard'), orderBy('level', 'desc'), orderBy('moves', 'asc'), limit(100));
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
      
      // As Firestore doesn't support complex filtering, we do it client-side
      // Get best score (lowest moves) for each user per level
      const bestScores = new Map<string, LeaderboardEntry>();

      leaderboardData.forEach(entry => {
        const key = `${entry.userName}-level-${entry.level}`;
        const existingEntry = bestScores.get(key);

        if (!existingEntry || entry.moves < existingEntry.moves) {
          bestScores.set(key, entry);
        }
      });
      
      const uniqueBestScores = Array.from(bestScores.values());
      
      // Then get the highest level for each user
      const userMaxLevel = new Map<string, LeaderboardEntry>();
      uniqueBestScores.forEach(entry => {
        const existingEntry = userMaxLevel.get(entry.userName);
        if(!existingEntry || entry.level > existingEntry.level) {
            userMaxLevel.set(entry.userName, entry);
        }
      });

      const finalLeaderboard = Array.from(userMaxLevel.values());
      finalLeaderboard.sort((a, b) => {
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        return a.moves - b.moves;
      });

      setLeaderboard(finalLeaderboard);
      setLoading(false);
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
            See who is at the top of the game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading leaderboard...</p>
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
