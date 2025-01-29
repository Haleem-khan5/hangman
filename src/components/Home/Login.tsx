// src/components/Login/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../Shared/AuthContext';
import InputField from '../Shared/InputField';
import Button from '../Shared/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSun, FaMoon } from 'react-icons/fa'; // Icons for better visuals
import { motion } from 'framer-motion'; // For animations
import { useTheme } from '../Shared/ThemeContext'; // Import ThemeContext

interface LoginProps {
  onSuccess?: () => void; // Optional callback after successful login
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const authContext = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Use global theme
  const { darkMode, toggleDarkMode } = useTheme();

  if (!authContext) {
    return <div>Error: Auth context is not available</div>;
  }
  const { login } = authContext;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);

    if (!success) {
      setError('Invalid username or password');
    } else {
      setError('');
      // Call the onSuccess callback if provided
      if (onSuccess) onSuccess();
      // Redirect to StartGame page
      navigate('/start-game');
    }
  };

  return (
    <div className="mt-8 flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 relative overflow-hidden">
      {/* Animated Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl opacity-75 blur-sm"></div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-5 right-5 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md focus:outline-none transition-colors duration-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>

        {/* Card Content */}
        <div className="relative p-8">
          {/* Decorative Icon */}
          {/* <div className="flex justify-center mb-4">
            <SiReact className="text-purple-600 dark:text-purple-300 text-4xl animate-spin-slow" />
          </div> */}

          <h2 className="text-3xl font-bold text-center text-green-600 dark:text-green-300 mb-6">
            Welcome Back
          </h2>

          {/* Error Message */}
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-12 text-gray-400" />
              <InputField
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-12 text-gray-400" />
              <InputField
                label="Password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 focus:outline-none"
            >
              Log In
            </Button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-green-600 dark:text-green-300 font-semibold hover:underline transition-colors duration-300"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Decorative SVG or Image (Optional) */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-700 rounded-full blur-2xl opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default Login;
