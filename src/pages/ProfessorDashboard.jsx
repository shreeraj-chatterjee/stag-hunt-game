import React, { useState } from 'react';
import { Play, Square, Download, Trash2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function ProfessorDashboard() {
  const [activeSession, setActiveSession] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [status, setStatus] = useState('waiting'); // waiting, in_progress, ended
  const [currentRound, setCurrentRound] = useState(0);
  
  // Mock data for UI layout testing
  const mockTeams = {
    'Team A': { min: 5, members: 3 },
    'Team B': { min: 7, members: 4 },
    'Team C': { min: 2, members: 3 }
  };
  
  const handleCreateRoom = () => {
    setRoomCode(Math.floor(1000 + Math.random() * 9000).toString());
    setActiveSession(true);
    setCurrentRound(0);
    setStatus('waiting');
  };
  
  if (!activeSession) {
    return (
      <div className="home-container">
        <Card className="glass-card w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Professor Admin</CardTitle>
            <CardDescription className="text-center">Create a new session to invite students.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={handleCreateRoom} size="lg" className="w-full text-lg shadow-md shadow-primary/20">
              Create New Room
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="m-0 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Room: {roomCode}
          </h1>
          <p className="text-muted-foreground font-medium mt-1 uppercase tracking-wider text-sm">
            Status: <span className="text-primary font-bold">{status.replace('_', ' ')}</span> | Round: <span className="text-primary font-bold">{currentRound}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {status !== 'in_progress' ? (
            <Button onClick={() => { setStatus('in_progress'); setCurrentRound(r => r + 1); }} className="shadow-md shadow-primary/20 bg-primary hover:bg-primary/90">
              <Play size={18} className="mr-2" /> Start Round {currentRound + 1}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setStatus('ended')} className="shadow-md shadow-destructive/20">
              <Square size={18} className="mr-2" /> End Round {currentRound}
            </Button>
          )}
          <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10">
            <Download size={18} className="mr-2" /> Export Data
          </Button>
          <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setActiveSession(false)}>
            <Trash2 size={18} className="mr-2" /> Close Session
          </Button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <Card className="glass-card col-span-full">
          <CardHeader>
            <CardTitle>Team Real-Time Status</CardTitle>
            <CardDescription>Monitor team progress and choices for the current round.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(mockTeams).map(([team, data]) => (
                <div key={team} className="bg-white/60 backdrop-blur-md p-6 rounded-xl border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users size={20} className="text-primary" /> {team}
                  </h4>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Members</p>
                      <p className="text-3xl font-bold">{data.members}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Min</p>
                      <p className="text-4xl font-black text-accent">
                        {status === 'in_progress' ? '?' : data.min}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
