// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Shared/AuthContext';
import Navbar from './components/Home/Navbar';
import './styles/tailwind.css';

// Import ThemeProvider
import { ThemeProvider } from './components/Shared/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import LeaderBoardPage from './pages/LeaderBoardPage';
import StartGamePage from './pages/StartGamePage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/leaderboard" element={<LeaderBoardPage />} />
            <Route path="/start-game" element={<StartGamePage />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
