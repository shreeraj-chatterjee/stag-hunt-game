import React, { useState } from 'react';
import PayoffMatrix from '../components/PayoffMatrix';
import { Send, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
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
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>Join Room</h2>
          <form onSubmit={handleJoin}>
            <input 
              placeholder="Room Code (e.g. 4829)" 
              value={roomCode} 
              onChange={e => setRoomCode(e.target.value)} 
              required
            />
            <input 
              placeholder="Your Nickname" 
              value={nickname} 
              onChange={e => setNickname(e.target.value)} 
              required
            />
            <select value={team} onChange={e => setTeam(e.target.value)}>
              {['Team A', 'Team B', 'Team C', 'Team D'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="submit" style={{ width: '100%' }}>Enter Game</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Round {currentRound}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>{nickname} | {team}</span>
          <button onClick={() => navigate('/')} style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
            <LogOut size={16} /> Leave
          </button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="glass-card">
          <h3>Your Decision</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Select your effort level for this round (1 = lowest risk, 7 = highest risk/reward).</p>
          
          {!submitted ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                  type="range" 
                  min="1" max="7" 
                  value={effort} 
                  onChange={e => setEffort(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{effort}</span>
              </div>
              <button onClick={handleSubmitEffort} style={{ width: '100%' }}>
                Submit Effort <Send size={18} />
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h3 style={{ color: 'var(--success)' }}>Effort Submitted!</h3>
              <p>You chose level {effort}. Waiting for other team members and professor to end the round...</p>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Mock Result Preview</p>
                <p>Team Minimum: {mockMinEffort}</p>
                <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
                  Payoff: {60 - 10 * effort + 20 * mockMinEffort}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="glass-card">
          <h3>Payoff Matrix</h3>
          <PayoffMatrix currentEffort={submitted ? effort : null} currentMinEffort={submitted ? mockMinEffort : null} />
        </div>
      </div>
    </div>
  );
}
