// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Shared/AuthContext';
import Button from '../Shared/Button';
import { FaLeaf } from 'react-icons/fa'; // Leaf icon for visual enhancement
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const authContext = useAuth();
  const currentUser = authContext?.currentUser;
  const navigate = useNavigate();
  //  after logout it should redirect to login page
  const logout = () => {
    authContext?.logout();
    // Or use the navigate function from react-router-dom to redirect to the home page
    navigate('/');

  }

  const location = useLocation(); // To determine active link

  // Function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50"
    >
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaLeaf className="mr-2 text-yellow-400" />
          Hangman
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/start-game"
            className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              isActive('/start-game')
                ? 'bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
            aria-label="Navigate to Game"
          >
            Game
          </Link>
          <Link
            to="/leaderboard"
            className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              isActive('/leaderboard')
                ? 'bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
            aria-label="Navigate to Leaderboard"
          >
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Right Section: User Controls */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <div className="flex items-center space-x-4">
            {/* Greeting */}
            <span className="font-semibold">Hello, {currentUser.username}</span>

            {/* Logout Button */}
            <Button
              onClick={logout}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300"
              aria-label="Logout"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Login Link */}
            <Link
              to="/login"
              className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                isActive('/login')
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              aria-label="Navigate to Login"
            >
              Login
            </Link>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                isActive('/signup')
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              aria-label="Navigate to Sign Up"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
