// src/Shared/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUsersFromDB, saveUsersToDB } from '../services/indexedDBService';

// Types
interface User {
  id: string;
  username: string;
  password: string;
  score: number; 
  isActive: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addScore: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 1) On mount: read existing users from IndexedDB
  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await getUsersFromDB();
      setUsers(storedUsers);
    };
    loadUsers();
  }, []);

  // 2) Whenever users change: save them to IndexedDB
  useEffect(() => {
    // Don’t call saveUsersToDB if users is empty & you expect to load something else
    // But typically, we want to store whatever's in memory
    saveUsersToDB(users);
  }, [users]);

  /**
   * Log in a user
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    const existingUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (existingUser) {
      setCurrentUser(existingUser);
      return true;
    }
    return false;
  };

  /**
   * Sign up a new user
   */
  const signUp = async (username: string, password: string): Promise<boolean> => {
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

  /**
   * Log out current user
   */
  const logout = () => {
    setCurrentUser(null);
  };

  /**
   * Add score points to current user
   */
  const addScore = (points: number) => {
    if (!currentUser) return;

    // Update the user in the array
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? { ...user, score: user.score + points, isActive: true }
          : user
      )
    );

    // Also update currentUser
    setCurrentUser((prevUser) =>
      prevUser ? { ...prevUser, score: prevUser.score + points, isActive: true } : null
    );
  };

  // Provide all these functions & states via Context
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
