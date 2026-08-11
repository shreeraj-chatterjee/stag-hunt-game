import React, { useState, useEffect } from 'react';
import PayoffMatrix from '../components/PayoffMatrix';
import { Send, LogOut, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore';

export default function StudentDashboard() {
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  
  // Game state
  const [effort, setEffort] = useState(7);
  const [submitted, setSubmitted] = useState(false);
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [currentRound, setCurrentRound] = useState(0);
  const [globalMinEffort, setGlobalMinEffort] = useState(null);
  
  // Listen to the room document once joined
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setRoomStatus(data.status);
        setCurrentRound(data.currentRound);
        
        // If a new round starts, reset submission state
        if (data.status === 'in_progress' && data.currentRound > currentRound) {
          setSubmitted(false);
          setGlobalMinEffort(null);
        }
        
        // If round ends, fetch the global minimum effort across all teams
        if (data.status === 'ended' && data[`results_round_${data.currentRound}`]) {
          const results = data[`results_round_${data.currentRound}`];
          const values = Object.values(results);
          const globalMin = values.length > 0 ? Math.min(...values) : 7;
          setGlobalMinEffort(globalMin);
        }
      } else {
        setError("Room was closed by the professor.");
        handleLeave();
      }
    });
    return () => unsubscribe();
  }, [roomId, currentRound]);

  const handleLeave = () => {
    setJoined(false);
    setRoomId(null);
    setRoomCode('');
    setSubmitted(false);
    setError('');
  };
  
  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    if (!roomCode || !nickname) return;
    
    try {
      const q = query(collection(db, "rooms"), where("code", "==", roomCode));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const roomDoc = querySnapshot.docs[0];
        setRoomId(roomDoc.id);
        setRoomStatus(roomDoc.data().status);
        setCurrentRound(roomDoc.data().currentRound);
        setJoined(true);
      } else {
        setError("Room not found. Check the code.");
      }
    } catch (err) {
      console.error(err);
      setError("Error joining room.");
    }
  };
  
  const handleSubmitEffort = async () => {
    if (!roomId) return;
    try {
      await addDoc(collection(db, "rooms", roomId, "submissions"), {
        round: currentRound,
        nickname,
        team: nickname, // The leader's name is their unique team identifier
        effort,
        timestamp: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit effort.");
    }
  };
  
  if (!joined) {
    return (
      <div className="home-container">
        <Card className="glass-card w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Team Leader Login</CardTitle>
            <CardDescription className="text-center">Enter your details to join on behalf of your team</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 flex items-center">
                <AlertCircle size={16} className="mr-2" /> {error}
              </div>
            )}
            <form onSubmit={handleJoin} className="space-y-4">
              <Input 
                placeholder="Room Code (e.g. 4829)" 
                value={roomCode} 
                onChange={e => setRoomCode(e.target.value)} 
                required
                className="bg-white/90"
              />
              <Input 
                placeholder="Leader Name / Team Name" 
                value={nickname} 
                onChange={e => setNickname(e.target.value)} 
                required
                className="bg-white/90"
              />
              <Button type="submit" className="w-full mt-4">Enter Game</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent m-0">
          Round {currentRound}
        </h2>
        <div className="flex gap-4 items-center">
          <span className="font-medium bg-white/50 px-3 py-1 rounded-full border shadow-sm">
            {nickname}
          </span>
          <Button variant="outline" size="sm" onClick={handleLeave} className="text-destructive border-destructive hover:bg-destructive/10">
            <LogOut size={16} className="mr-2" /> Leave
          </Button>
        </div>
      </div>
      
      {roomStatus === 'waiting' ? (
        <div className="text-center py-20 animate-pulse">
          <h3 className="text-2xl text-muted-foreground">Waiting for professor to start the round...</h3>
        </div>
      ) : (
        <div className="dashboard-grid">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Team Decision</CardTitle>
              <CardDescription>Select your team's effort level for this round (1 = lowest risk, 7 = highest risk/reward).</CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <div className="space-y-6 mt-4">
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="1" max="7" 
                      value={effort} 
                      onChange={e => setEffort(parseInt(e.target.value))}
                      className="flex-1 accent-primary h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-4xl font-bold text-accent min-w-[2rem] text-center">{effort}</span>
                  </div>
                  <Button onClick={handleSubmitEffort} className="w-full text-lg h-12 shadow-md shadow-primary/20">
                    Submit Effort <Send size={18} className="ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 animate-in zoom-in duration-300">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Effort Submitted!</h3>
                  <p className="text-muted-foreground">You chose level {effort} for your team. Waiting for other teams and the professor to end the round...</p>
                  
                  {roomStatus === 'ended' && globalMinEffort !== null && (
                    <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 shadow-inner">
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Round Result</p>
                      <p className="text-lg">Global Minimum Effort: <strong>{globalMinEffort}</strong></p>
                      <p className="text-3xl font-bold text-accent mt-2">
                        Payoff: {60 - 10 * effort + 20 * globalMinEffort}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Payoff Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <PayoffMatrix currentEffort={submitted ? effort : null} currentMinEffort={submitted && roomStatus === 'ended' ? globalMinEffort : null} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
