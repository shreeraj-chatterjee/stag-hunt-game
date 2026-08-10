import React, { useState } from 'react';
import { Play, Square, Download, Trash2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfessorDashboard() {
  const navigate = useNavigate();
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
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Professor Admin</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Create a new session to invite students.</p>
          <button onClick={handleCreateRoom} style={{ width: '100%' }}>Create New Room</button>
          <button onClick={() => navigate('/')} style={{ marginTop: '1rem', background: 'transparent', width: '100%' }}>
            <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1>Room: <span style={{ color: 'var(--accent)' }}>{roomCode}</span></h1>
          <p className="text-muted">Status: {status.replace('_', ' ').toUpperCase()} | Round: {currentRound}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {status !== 'in_progress' ? (
            <button onClick={() => { setStatus('in_progress'); setCurrentRound(r => r + 1); }}>
              <Play size={18} /> Start Round {currentRound + 1}
            </button>
          ) : (
            <button style={{ background: 'var(--danger)' }} onClick={() => setStatus('ended')}>
              <Square size={18} /> End Round {currentRound}
            </button>
          )}
          <button style={{ background: 'transparent', border: '1px solid var(--text-muted)' }}>
            <Download size={18} /> Export Data
          </button>
          <button style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => setActiveSession(false)}>
            <Trash2 size={18} /> Close Session
          </button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Team Real-Time Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {Object.entries(mockTeams).map(([team, data]) => (
              <div key={team} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{team}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <div>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>Members</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.members}</p>
                  </div>
                  <div>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>Current Min Effort</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                      {status === 'in_progress' ? '?' : data.min}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
