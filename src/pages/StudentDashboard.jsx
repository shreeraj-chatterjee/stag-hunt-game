import React, { useState } from 'react';
import PayoffMatrix from '../components/PayoffMatrix';
import { Send, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentDashboard() {
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [team, setTeam] = useState('Team A');
  
  // Mock game state for offline preview
  const [effort, setEffort] = useState(7);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock results
  const currentRound = 1;
  const mockMinEffort = 5; 
  
  const handleLeave = () => {
    setJoined(false);
    setRoomCode('');
    setSubmitted(false);
  };
  
  const handleJoin = (e) => {
    e.preventDefault();
    if(roomCode && nickname) setJoined(true);
  };
  
  const handleSubmitEffort = () => {
    setSubmitted(true);
    // Real implementation will push to Firebase
  };
  
  if (!joined) {
    return (
      <div className="home-container">
        <Card className="glass-card w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Join Room</CardTitle>
            <CardDescription className="text-center">Enter your details to join the simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input 
                placeholder="Room Code (e.g. 4829)" 
                value={roomCode} 
                onChange={e => setRoomCode(e.target.value)} 
                required
                className="bg-white/90"
              />
              <Input 
                placeholder="Your Nickname" 
                value={nickname} 
                onChange={e => setNickname(e.target.value)} 
                required
                className="bg-white/90"
              />
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger className="w-full bg-white/90">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {['Team A', 'Team B', 'Team C', 'Team D'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {nickname} | {team}
          </span>
          <Button variant="outline" size="sm" onClick={handleLeave} className="text-destructive border-destructive hover:bg-destructive/10">
            <LogOut size={16} className="mr-2" /> Leave
          </Button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Decision</CardTitle>
            <CardDescription>Select your effort level for this round (1 = lowest risk, 7 = highest risk/reward).</CardDescription>
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
                <p className="text-muted-foreground">You chose level {effort}. Waiting for other team members and professor to end the round...</p>
                
                <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 shadow-inner">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Mock Result Preview</p>
                  <p className="text-lg">Team Minimum: <strong>{mockMinEffort}</strong></p>
                  <p className="text-3xl font-bold text-accent mt-2">
                    Payoff: {60 - 10 * effort + 20 * mockMinEffort}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Payoff Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <PayoffMatrix currentEffort={submitted ? effort : null} currentMinEffort={submitted ? mockMinEffort : null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
