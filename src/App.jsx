import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  return (
    <Router>
      <ParticlesBackground />
      <div className="app-container relative z-10">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/host" element={<ProfessorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
