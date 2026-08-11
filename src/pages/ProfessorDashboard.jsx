import React, { useState, useEffect } from 'react';
import { Play, Square, Download, Trash2, Users, LogIn, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore';

export default function ProfessorDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeSession, setActiveSession] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [status, setStatus] = useState('waiting');
  const [currentRound, setCurrentRound] = useState(0);
  const [error, setError] = useState('');
  const [teamsStats, setTeamsStats] = useState({});
  const [roomData, setRoomData] = useState(null);

  // Listen to the room document for history
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (docSnap) => {
      if (docSnap.exists()) {
        setRoomData(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  // Listen to submissions for the current round
  useEffect(() => {
    if (!roomId) return;
    const q = query(collection(db, "rooms", roomId, "submissions"), where("round", "==", currentRound));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stats = {};
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const t = data.team;
        if (!stats[t]) {
          stats[t] = { members: 0, min: 7 };
        }
        stats[t].members += 1;
        if (data.effort < stats[t].min) {
          stats[t].min = data.effort;
        }
      });
      setTeamsStats(stats);
    });
    return () => unsubscribe();
  }, [roomId, currentRound]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveSession(false);
  };

  const handleCreateRoom = async () => {
    setError('');
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      const roomRef = await addDoc(collection(db, "rooms"), {
        code: newCode,
        professorId: user.uid,
        status: 'waiting',
        currentRound: 0,
        createdAt: serverTimestamp()
      });
      setRoomId(roomRef.id);
      setRoomCode(newCode);
      setActiveSession(true);
      setCurrentRound(0);
      setStatus('waiting');
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room: " + error.message);
    }
  };
  
  const updateRoomStatus = async (newStatus, roundDelta = 0) => {
    if (!roomId) return;
    try {
      const nextRound = currentRound + roundDelta;
      
      const updateData = {
        status: newStatus,
        currentRound: nextRound
      };

      // If we are ending the round, save the team minimums to the room document so students can see their payoff
      if (newStatus === 'ended') {
        const minResults = {};
        Object.entries(teamsStats).forEach(([team, data]) => {
          minResults[team] = data.min;
        });
        updateData[`results_round_${currentRound}`] = minResults;
      }

      await updateDoc(doc(db, "rooms", roomId), updateData);
      setStatus(newStatus);
      setCurrentRound(nextRound);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  if (loading) {
    return <div className="home-container"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="home-container">
        <Card className="glass-card w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Professor Login</CardTitle>
            <CardDescription className="text-center">Sign in to manage your classroom simulations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full text-lg shadow-md">
              <LogIn size={18} className="mr-2" /> Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div className="home-container">
        <Card className="glass-card w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Professor Admin</CardTitle>
            <CardDescription className="text-center">Logged in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-2">
                {error}
              </div>
            )}
            <Button onClick={handleCreateRoom} size="lg" className="w-full text-lg shadow-md shadow-primary/20">
              Create New Room
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full text-destructive hover:bg-destructive/10">
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-white/90 border-4 border-primary rounded-xl p-4 shadow-lg inline-block">
            <h1 className="m-0 text-5xl font-black text-primary tracking-widest text-center">
              {roomCode}
            </h1>
            <p className="text-center text-xs font-bold text-muted-foreground uppercase mt-1">Room Code</p>
          </div>
          <p className="text-muted-foreground font-medium mt-2 uppercase tracking-wider text-sm">
            Status: <span className={status === 'in_progress' ? 'text-green-600 font-bold' : 'text-primary font-bold'}>{status.replace('_', ' ')}</span> | Round: <span className="text-primary font-bold">{currentRound}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {status !== 'in_progress' ? (
            <Button onClick={() => updateRoomStatus('in_progress', 1)} className="shadow-md shadow-primary/20 bg-primary hover:bg-primary/90">
              <Play size={18} className="mr-2" /> Start Round {currentRound + 1}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => updateRoomStatus('ended', 0)} className="shadow-md shadow-destructive/20">
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
              {Object.keys(teamsStats).length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No submissions yet for Round {currentRound}.
                </div>
              ) : (
                Object.entries(teamsStats).map(([team, data]) => (
                <div key={team} className="bg-white/60 backdrop-blur-md p-6 rounded-xl border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users size={20} className="text-primary" /> {team}
                  </h4>
                  <div className="flex justify-between items-end">
                    <div className="text-right w-full">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Effort</p>
                      <p className="text-4xl font-black text-accent">
                        {status === 'in_progress' ? '?' : data.min}
                      </p>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Round History */}
      {currentRound > 0 && roomData && Object.keys(roomData).some(k => k.startsWith('results_round_')) && (
        <Card className="glass-card col-span-full mt-6">
          <CardHeader>
            <CardTitle>Round History</CardTitle>
            <CardDescription>Previous round outcomes and minimum efforts.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {Array.from({length: currentRound}, (_, i) => i + 1).map(r => {
                 const res = roomData[`results_round_${r}`];
                 if (!res) return null;
                 
                 // Calculate global minimum for this round
                 const globalMin = Math.min(...Object.values(res));
                 
                 return (
                   <div key={r} className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border-l-4 border-l-accent shadow-sm">
                     <div className="flex justify-between items-center mb-3">
                       <h5 className="font-bold text-lg">Round {r}</h5>
                       <span className="text-sm font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full">
                         Minimum Effort: {globalMin}
                       </span>
                     </div>
                     <div className="flex gap-3 flex-wrap">
                       {Object.entries(res).map(([team, min]) => (
                         <div key={team} className="px-4 py-2 bg-white rounded-md border shadow-sm flex flex-col items-center">
                           <span className="text-xs text-muted-foreground uppercase font-bold">{team}</span>
                           <span className="text-xl font-black text-primary">{min}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               }).reverse()}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
