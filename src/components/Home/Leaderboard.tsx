// src/components/Leaderboard.tsx
import React, { useState, useMemo } from 'react';
import { useAuth } from '../Shared/AuthContext';
import { FaCrown, FaSun, FaMoon } from 'react-icons/fa'; // Icons for top performer and dark mode toggle
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip'; // Correct import for react-tooltip v4.x
import 'react-tooltip/dist/react-tooltip.css'; // Import the CSS
import { useTheme } from '../Shared/ThemeContext';

interface User {
  id: string;
  username: string;
  score: number;
  avatar?: string; // Optional avatar URL
}

const Leaderboard: React.FC = () => {
  const authContext = useAuth();
  const currentUser = authContext?.currentUser; // Assuming currentUser is available
  const users: User[] = authContext ? authContext.users : [];
  const { darkMode, toggleDarkMode } = useTheme(); // Use global theme

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize sorted and filtered users to optimize performance
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => b.score - a.score);
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return sortedUsers;
    return sortedUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUsers, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / usersPerPage);
  }, [filteredUsers.length]);

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 relative overflow-hidden transition-colors duration-500">
      {/* Animated Floating Shapes */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute top-20 left-20 w-24 h-24 bg-pink-300 rounded-full blur-xl opacity-70"
      ></motion.div>
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full blur-xl opacity-70"
      ></motion.div>
      
      {/* Dark Mode Toggle Button */} 
      <button
        onClick={toggleDarkMode}
        className="absolute mt-6 top-14 right-5 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md focus:outline-none transition-colors duration-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
      </button>
      {/* Particle Background */}
      {/* You can include a particle background similar to StartGame if desired */}
      {/* <Particles
        id="tsparticles"
        // init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      /> */}

      {/* Header */}
      <div className="flex flex-col items-center mb-8 z-10">
        <h2 className="text-5xl font-bold text-center text-purple-700 dark:text-purple-300">
          🏆 Leaderboard 🏆
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          See how you rank among other players!
        </p>
      </div>

      {/* Animated Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col items-center"
      >
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl opacity-75 blur-sm"></div>

        {/* Card Content */}
        <div className="relative p-8 w-full flex flex-col items-center">
          {/* Search Input */}
          <div className="flex justify-center mb-6 w-full">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-purple-100 dark:bg-gray-700">
                  <th className="py-3 px-6 text-left text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="py-3 px-2 text-left text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="py-3  text-left text-2xl font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  const rank = (currentPage - 1) * usersPerPage + index + 1;
                  const isTopUser = rank === 1;
                  const isCurrentUser = currentUser && user.id === currentUser.id;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        isCurrentUser
                          ? 'bg-purple-50 dark:bg-gray-700'
                          : rank % 2 === 0
                          ? 'bg-gray-50 dark:bg-gray-800'
                          : 'bg-white dark:bg-gray-700'
                      } hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer`}
                      data-tooltip-content={`User: ${user.username} | Score: ${user.score}`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
                        <div className="flex items-center">
                          {isTopUser && (
                            <FaCrown
                              className="text-yellow-500 mr-2"
                              title="Top Performer"
                            />
                          )}
                          <span>{rank}</span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200 flex items-center">
                        {/* Avatar */}
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.username}'s avatar`}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Username */}
                        <span
                          className={`${
                            isCurrentUser
                              ? 'font-semibold text-purple-700 dark:text-purple-300'
                              : ''
                          }`}
                        >
                          {user.username}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
                        {user.score}
                      </td>
                    </motion.tr>
                  );
                })}

                {/* No Users Found */}
                {currentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 px-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tooltip */}
          <Tooltip />

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6 w-full max-w-md">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg shadow-md font-semibold focus:outline-none transition-colors duration-300 ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-purple-600 hover:to-pink-600 dark:from-purple-700 dark:to-pink-700'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg shadow-md font-semibold focus:outline-none transition-colors duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-purple-600 hover:to-pink-600 dark:from-purple-700 dark:to-pink-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute top-0 right-10 w-16 h-16 bg-green-200 rounded-full blur-2xl opacity-50"></div>
      </motion.div>

      {/* Footer with Calming Message */}
      <div className="absolute bottom-4 w-full text-center z-10">
        <p className="text-gray-600 dark:text-gray-400">
          Stay motivated and keep climbing the ranks! 🚀
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
