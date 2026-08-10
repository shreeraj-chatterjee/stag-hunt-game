import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      <h1>Stag Hunt Game</h1>
      <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
        An interactive economic simulation of risk and return. Are you willing to cooperate for the maximum payoff, or play it safe?
      </p>
      
      <div className="role-cards">
        <div className="glass-card role-card" onClick={() => navigate('/student')}>
          <Users size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h2>Join as Student</h2>
          <p className="text-muted">Enter a room code and join your team to participate in the simulation.</p>
          <button style={{ marginTop: '1.5rem', width: '100%' }}>
            Join Game <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="glass-card role-card" onClick={() => navigate('/professor')}>
          <GraduationCap size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Professor Dashboard</h2>
          <p className="text-muted">Create a room, manage rounds, and monitor student behavior in real-time.</p>
          <button style={{ marginTop: '1.5rem', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--primary)' }}>
            Manage Game <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
