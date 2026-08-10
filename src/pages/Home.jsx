import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      <h1>Stag Hunt Game</h1>
      <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        An interactive economic simulation of risk and return. Are you willing to cooperate for the maximum payoff, or play it safe?
      </p>
      
      <div className="role-cards">
        <Card 
          className="glass-card role-card" 
          onClick={() => navigate('/student')}
        >
          <CardHeader>
            <Users size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <CardTitle>Join as Student</CardTitle>
            <CardDescription>Enter a room code and join your team to participate in the simulation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-4">
              Join Game <ArrowRight size={18} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card 
          className="glass-card role-card" 
          onClick={() => navigate('/professor')}
        >
          <CardHeader>
            <GraduationCap size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <CardTitle>Professor Dashboard</CardTitle>
            <CardDescription>Create a room, manage rounds, and monitor student behavior in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
              Manage Game <ArrowRight size={18} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
