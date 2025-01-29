// src/components/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaPlay, FaTrophy, FaLightbulb, FaSun, FaMoon } from 'react-icons/fa';
// import Lottie from 'lottie-react';
// import gameAnimation from '../../assets/lottie/game-animation.json';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../Shared/ThemeContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);

  const { darkMode, toggleDarkMode } = useTheme(); // Use global theme

  const techWords: string[] = [
    'Algorithm', 'API', 'Artificial Intelligence', 'Augmented Reality', 'Backend',
    'Blockchain', 'Cloud Computing', 'Cybersecurity', 'Data Mining', 'Database',
    'DevOps', 'Encryption', 'Frontend', 'Machine Learning', 'Microservices',
    'Neural Network', 'Quantum Computing', 'Responsive Design', 'SaaS', 'Virtual Reality',
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes',
    'GraphQL', 'TensorFlow', 'Swift', 'Go', 'Rust', 'C++', 'Ruby', 'PHP', 'SQL',
    'NoSQL', 'HTML', 'CSS', 'Big Data', 'IoT', 'UI/UX', 'Agile', 'Scrum', 'Git',
    'GitHub', 'Bitbucket', 'VSCode', 'SASS', 'LESS', 'Webpack', 'Babel', 'ES6',
    'Redux', 'Jest', 'Cypress', 'JIRA', 'Confluence', 'TypeORM', 'Express', 'Django',
    'Flask', 'Spring', 'Hibernate', 'Laravel', 'Symfony', 'Electron', 'Flutter',
    'React Native', 'SwiftUI', 'Graph Databases', 'RESTful Services', 'SOAP', 'OAuth',
    'JWT', 'Graph Visualization', 'Data Structures', 'Operating Systems', 'Virtual Machines',
    'Containers', 'Serverless', 'CI/CD', 'Unit Testing', 'Integration Testing', 'End-to-End Testing',
    'Version Control', 'Continuous Integration', 'Continuous Deployment', 'Data Science',
    'Data Visualization', 'Cloud Storage', 'Edge Computing', 'DevSecOps', 'CI/CD Pipelines',
    'Load Balancing', 'Scalability', 'High Availability', 'Latency', 'Throughput'
  ];

  const [floatingWords, setFloatingWords] = useState<
    { 
      id: string; 
      text: string; 
      initialX: number; 
      initialY: number; 
      duration: number; 
      direction: 'left' | 'right' |'up' | 'down';
      scale: number;
      opacity: number;
    }[]
  >([]);

  useEffect(() => {
    const wordsWithPosition = techWords.map(word => ({
      id: uuidv4(),
      text: word,
      initialX: Math.random() * window.innerWidth - window.innerWidth / 2,
      initialY: Math.random() * window.innerHeight - window.innerHeight / 2,
      duration: Math.random() * 15 + 10,
      direction: Math.random() > 0.5 ? ('left' as const) : ('right' as const),
      scale: Math.random() * 0.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setFloatingWords(wordsWithPosition);
  }, [techWords]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/start-game');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, navigate]);

  const handleStartGame = () => {
    navigate('/start-game');
  };

  return (
    <div className="mt-5 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 relative overflow-hidden">
      {/* Floating Words Background */}
      {floatingWords.map(word => (
        <motion.span
          key={word.id}
          className="absolute font-semibold text-white pointer-events-none"
          style={{ 
            fontSize: `${word.scale * 0.9}rem`,
            opacity: word.opacity,
            whiteSpace: 'nowrap',
            zIndex: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          initial={{ 
            x: word.initialX, 
            y: word.initialY,
            rotate: Math.random() * 360
          }}
          animate={{ 
            x: word.direction === 'left' 
              ? word.initialX - window.innerWidth * 0.6 
              : word.initialX + window.innerWidth * 0.6,
            y: word.initialY - window.innerHeight * 0.8,
            rotate: word.direction === 'left' ? -360 : 360
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: word.duration,
            ease: 'linear',
          }}
        >
          {word.text}
        </motion.span>
      ))}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-14 right-5 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md focus:outline-none transition-colors duration-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
      </button>

      {/* Main Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col p-8"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl opacity-50 blur-sm pointer-events-none"></div>

        {/* Timer and Theme Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-4">
          {/* Timer */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <span className="font-semibold">Time Left:</span>
            <span className="font-bold">{timeLeft}s</span>
          </motion.div>


        </div>

        {/* Top Section: Hero Content */}
        <div className="w-full text-center md:text-left mb-8 relative z-20 px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-300 mb-4"
          >
            Welcome to Hangman
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6"
          >
            Test your tech vocabulary skills and have fun!
          </motion.p>
        </div>

        {/* Middle Section: Features Grid */}
        <div className="w-full flex flex-col md:flex-row items-center mb-8 relative z-20 px-4">
          {/* Features Grid */}
          <div className="w-full flex flex-wrap justify-center md:justify-start gap-6">
            {/* Feature 1: How to Play */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-80 rounded-2xl p-5 shadow-lg flex items-start space-x-4 w-72"
            >
              <FaInfoCircle className="text-purple-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-1">How to Play</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Guess the hidden tech word letter by letter before time runs out!
                </p>
              </div>
            </motion.div>

            {/* Feature 2: Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-80 rounded-2xl p-5 shadow-lg flex items-start space-x-4 w-72"
            >
              <FaTrophy className="text-purple-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-1">Leaderboard</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Compete with others and climb the ranks!
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Tips & Tricks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-80 rounded-2xl p-5 shadow-lg flex items-start space-x-4 w-72"
            >
              <FaLightbulb className="text-purple-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-1">Tips & Tricks</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Learn strategies to improve your guessing skills!
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Start Game Button */}
        <div className="w-full flex justify-end relative z-20 px-4">
          <motion.button
            onClick={handleStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center space-x-2 shadow-lg hover:bg-purple-700 transition-colors"
          >
            <FaPlay className="text-lg" />
            <span>Start Game</span>
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-700 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 bg-pink-200 dark:bg-pink-700 rounded-full blur-2xl opacity-50 animate-pulse"></div>
      </motion.div>
    </div>
  );
};

export default Home;
