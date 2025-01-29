// src/Shared/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types for user and context
interface User {
  id: string;
  username: string;
  password: string;
  score: number; // Total points across games
  isActive: boolean; // Tracks if user has played any game
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  signUp: (username: string, password: string) => boolean;
  logout: () => void;
  addScore: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Optional: Persist users to localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('hangman_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hangman_users', JSON.stringify(users));
  }, [users]);

  const login = (username: string, password: string): boolean => {
    const existingUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (existingUser) {
      setCurrentUser(existingUser);
      return true;
    }
    return false;
  };

  const signUp = (username: string, password: string): boolean => {
    // Check if user already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(), // Simple unique ID
      username,
      password,
      score: 0,
      isActive: false,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addScore = (points: number) => {
    if (!currentUser) return;
    // Update current user's score and set isActive to true
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? { ...user, score: user.score + points, isActive: true }
          : user
      )
    );
    // Also update in local state (currentUser)
    setCurrentUser((prevUser) =>
      prevUser ? { ...prevUser, score: prevUser.score + points, isActive: true } : null
    );
  };

  const value: AuthContextType = {
    currentUser,
    users,
    login,
    signUp,
    logout,
    addScore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
