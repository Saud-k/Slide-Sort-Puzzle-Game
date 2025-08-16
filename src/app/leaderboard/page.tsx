"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeaderboardEntry {
  id: string;
  userName: string;
  level: number;
  moves: number;
  userId: string;
}

const TOTAL_LEVELS = 10;
const STARTING_LEVEL = 3;

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(STARTING_LEVEL);

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
        const q = query(
          collection(db, 'leaderboard'), 
          where('level', '==', selectedLevel),
          orderBy('moves', 'asc'), 
          limit(100)
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
        
        const bestScores = new Map<string, LeaderboardEntry>();

        for (const entry of leaderboardData) {
            const existingEntry = bestScores.get(entry.userId);

            if (!existingEntry || entry.moves < existingEntry.moves) {
                bestScores.set(entry.userId, entry);
            }
        }
        
        const finalLeaderboard = Array.from(bestScores.values());
        
        finalLeaderboard.sort((a, b) => a.moves - b.moves);

        setLeaderboard(finalLeaderboard.slice(0, 10));

      } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
         if (error.code === 'failed-precondition') {
          setError(`A database index is required for this query. Please create a composite index for the 'leaderboard' collection on 'level' (ascending) and 'moves' (ascending) in your Firebase console.`);
        } else {
          setError("Could not fetch leaderboard data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedLevel]);

  const handleLevelChange = (value: string) => {
    setSelectedLevel(parseInt(value, 10));
  };
  
  const levelOptions = Array.from({ length: TOTAL_LEVELS - STARTING_LEVEL + 1 }, (_, i) => i + STARTING_LEVEL);


  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-6 lg:p-8">
      <header className="w-full max-w-4xl mx-auto mb-4">
        <Link href="/" passHref>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </header>
      <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between text-center md:text-left p-4 md:p-6">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-headline tracking-tight">
              Leaderboard
            </CardTitle>
            <CardDescription>
              Top players with the fewest moves for the selected level.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <label htmlFor="level-select" className="text-sm font-medium">Size:</label>
            <Select onValueChange={handleLevelChange} defaultValue={String(selectedLevel)}>
              <SelectTrigger id="level-select" className="w-[120px]">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(level => (
                   <SelectItem key={level} value={String(level)}>{level}x{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
                <p>Loading leaderboard...</p>
            </div>
          ) : error ? (
             <div className="flex justify-center items-center h-40">
                <p className="text-destructive max-w-md text-center">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
             <div className="flex justify-center items-center h-40">
                <p>No scores yet for this level. Be the first!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Total Moves</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{entry.userName}</TableCell>
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
