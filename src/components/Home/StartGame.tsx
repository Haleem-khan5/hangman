// src/components/StartGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../Shared/Button';
import { useAuth } from '../Shared/AuthContext';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLeaf, FaSun, FaMoon, FaQuestionCircle } from 'react-icons/fa'; // Added FaQuestionCircle for hint icon

// Import Hangman SVG components
import HangmanBase from '../Hangman/HangmanBase';
import HangmanPole from '../Hangman/HangmanPole';
import HangmanBeam from '../Hangman/HangmanBeam';
import HangmanRope from '../Hangman/HangmanRope';
import HangmanHead from '../Hangman/HangmanHead';
import HangmanBody from '../Hangman/HangmanBody';
import HangmanLeftArm from '../Hangman/HangmanLeftArm';
import HangmanRightArm from '../Hangman/HangmanRightArm';
import HangmanLeftLeg from '../Hangman/HangmanLeftLeg';
import HangmanRightLeg from '../Hangman/HangmanRightLeg';

// Import ThemeContext
import { useTheme } from '../Shared/ThemeContext';

// Original list of words
const WORDS = [
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

// Maximum wrong guesses allowed
const MAX_WRONG = 6;

// Maximum number of hints per game
const MAX_HINTS = 3;

// Initial time for the timer in seconds
const INITIAL_TIME = 60;

// Process WORDS to replace spaces with hyphens and convert to lowercase
const CLEAN_WORDS = WORDS.map(word => word.replace(/\s+/g, '-').toLowerCase());

// Helper function to get a random word from CLEAN_WORDS
const getRandomWord = () => CLEAN_WORDS[Math.floor(Math.random() * CLEAN_WORDS.length)];

const StartGame: React.FC = () => {
  const authContext = useAuth();
  // If `authContext` is missing, fallback to a no-op function
  const addScore = authContext?.addScore ?? (() => {});

  // Game state variables
  const [score, setScore] = useState(0); // Current game score
  const [totalPoints, setTotalPoints] = useState(0); // Total points across games
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Hints system state variables
  const [hintsUsed, setHintsUsed] = useState(0);
  const [maxHints] = useState(MAX_HINTS);

  // Timer state variables
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(false);

  // Use global theme context
  const { darkMode, toggleDarkMode } = useTheme();

  // Pick a random word at the start
  useEffect(() => {
    setWord(getRandomWord());
    setTimerActive(true); // Start the timer when the game starts
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || gameOver) return;

    if (timeLeft <= 0) {
      // Time's up, game over
      setGameOver(true);
      setLosses(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(0); // Mark as active without adding points
      toast.error(`⏰ Time's up! The word was "${word.toUpperCase()}".`, { autoClose: 5000 });
      setTimerActive(false); // Stop the timer
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, timerActive, gameOver, word, addScore]);

  // Check if the game is won
  useEffect(() => {
    if (!word) return;

    const wordLetters = word.toLowerCase().split('');
    const allGuessed = wordLetters.every(letter => guessedLetters.includes(letter));

    if (allGuessed && !gameOver) { // Ensure this runs only once
      setGameOver(true);
      setScore(prev => prev + 10); // Example: +10 points for winning
      setTotalPoints(prev => prev + 10);
      setWins(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(10); // Add points and mark as active
      toast.success('🎉 Congratulations! You guessed the word!', { autoClose: 5000 });
      setTimerActive(false); // Stop the timer
    }
  }, [guessedLetters, word, addScore, gameOver]);

  // Check if game is lost
  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG && !gameOver) { // Ensure this runs only once
      setGameOver(true);
      setLosses(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(0); // Mark as active without adding points
      toast.error(`😢 Game Over! The word was "${word.toUpperCase()}".`, { autoClose: 5000 });
      setTimerActive(false); // Stop the timer
    }
  }, [wrongGuesses, word, addScore, gameOver]);

  // Handle letter guesses
  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (word.includes(letter)) {
      // Correct guess
      setScore(prev => prev + 2); // Example: +2 points for correct guess
      setTotalPoints(prev => prev + 2);
      addScore(2); // Add points and mark as active
      toast.success(`✅ Correct! "${letter.toUpperCase()}" is in the word.`, { autoClose: 3000 });
    } else {
      // Wrong guess
      setWrongGuesses(prev => prev + 1);
      toast.error(`❌ Wrong! "${letter.toUpperCase()}" is not in the word.`, { autoClose: 3000 });
    }
  };

  // Handle using a hint
  const handleUseHint = () => {
    if (hintsUsed >= maxHints || gameOver) return;

    // Find unguessed letters
    const unguessedLetters = word
      .toLowerCase()
      .split('')
      .filter(letter => !guessedLetters.includes(letter) && letter !== '-');

    if (unguessedLetters.length === 0) {
      toast.info('All letters have already been revealed!', { autoClose: 3000 });
      return;
    }

    // Reveal a random unguessed letter
    const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
    setGuessedLetters(prev => [...prev, randomLetter]);
    setHintsUsed(prev => prev + 1);
    setScore(prev => prev - 5); // Example: -5 points for using a hint
    setTotalPoints(prev => prev - 5);
    addScore(-5); // Deduct points and mark as active
    toast.info(`💡 Hint: The letter "${randomLetter.toUpperCase()}" is in the word.`, { autoClose: 3000 });
  };

  // Handle restarting the game
  const handleRestart = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setScore(0);
    setHintsUsed(0);
    setTimeLeft(INITIAL_TIME);
    setTimerActive(true); // Restart the timer
    toast.info('🔄 Game restarted! Good luck!', { autoClose: 3000 });
  };

  // Display underscores for unguessed letters, actual letter if guessed
  const displayWord = word
    .split('')
    .map((letter, index) => {
      if (letter === '-') {
        // Display hyphens as is
        return (
          <span key={index} className="mx-1 text-4xl font-mono">
            -
          </span>
        );
      }
      return (
        <span key={index} className="mx-1 text-4xl font-mono">
          {guessedLetters.includes(letter.toLowerCase()) ? letter.toUpperCase() : '_'}
        </span>
      );
    });

  // Particle Options
  const particlesInit = useCallback(async (engine: any) => {
    // Load the full tsparticles package
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: darkMode ? '#1a202c' : '#f0e6f6', // Dark mode background
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: darkMode ? '#cbd5e0' : '#a78bfa' }, // Dark mode particle color
      links: { enable: true, distance: 150, color: darkMode ? '#4a5568' : '#c4b5fd', opacity: 0.5, width: 1 },
      collisions: { enable: false },
      move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 50 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  // Render Hangman parts based on wrongGuesses
  const renderHangman = () => {
    const parts = [
      <HangmanBase key="base" />,
      <HangmanPole key="pole" />,
      <HangmanBeam key="beam" />,
      <HangmanRope key="rope" />,
      <HangmanHead key="head" />,
      <HangmanBody key="body" />,
      <HangmanLeftArm key="leftArm" />,
      <HangmanRightArm key="rightArm" />,
      <HangmanLeftLeg key="leftLeg" />,
      <HangmanRightLeg key="rightLeg" />,
    ];

    return parts.slice(0, wrongGuesses + 1).map((part, index) => (
      <motion.g
        key={part.key}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {part}
      </motion.g>
    ));
  };

  // Render Keyboard
  const renderKeyboard = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return letters.map(letter => (
      <button
        key={letter}
        onClick={() => handleGuess(letter.toLowerCase())}
        disabled={guessedLetters.includes(letter.toLowerCase()) || gameOver}
        aria-label={`Guess letter ${letter}`}
        className={`m-1 px-3 py-2 rounded-lg shadow-md font-semibold focus:outline-none transition-colors ${
          guessedLetters.includes(letter.toLowerCase())
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 dark:from-green-400 dark:to-blue-400 dark:hover:from-purple-500 dark:hover:to-pink-500'
        }`}
      >
        {letter}
      </button>
    ));
  };

  return (
    <div className="mt-14 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 relative overflow-hidden transition-colors duration-500">
      {/* Animated Floating Shapes */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-xl opacity-70"
      ></motion.div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full blur-xl opacity-70"
      ></motion.div>

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* Header */}
      <div className="flex flex-col items-center mb-8 z-10">
        <h2 className="text-5xl font-bold text-center text-purple-700 dark:text-purple-300">
          🏆 Hangman 🏆
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Let's test your tech vocabulary!
        </p>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-5 right-5 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md focus:outline-none transition-colors duration-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
      </button>

      {/* Animated Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col items-center"
      >
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl opacity-75 blur-sm"></div>

        {/* Card Content */}
        <div className="relative p-8 w-full flex flex-col items-center">
          {/* Main Sections Container */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-8 md:space-y-0 md:space-x-12">
            {/* Hangman and Word Display */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              {/* Animated Hangman SVG */}
              <motion.svg
                width="200"
                height="250"
                className="mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {renderHangman()}
              </motion.svg>

              {/* Word Display */}
              <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-inner w-full flex justify-center flex-wrap">
                <span className="text-4xl font-mono tracking-wider flex flex-wrap justify-center">
                  {displayWord}
                </span>
              </div>

              {/* Restart Button */}
              {gameOver && (
                <Button
                  onClick={handleRestart}
                  className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 dark:from-green-400 dark:to-blue-400 dark:hover:from-purple-500 dark:hover:to-pink-500 px-4 py-2 rounded-lg shadow-md"
                >
                  Restart
                </Button>
              )}
            </div>

            {/* Keyboard */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">Choose a Letter</h3>
              <div className="flex flex-wrap justify-center max-w-md">
                {renderKeyboard()}
              </div>

              {/* Use Hint Button */}
              <Button
                onClick={handleUseHint}
                disabled={hintsUsed >= maxHints || gameOver}
                className={`mt-4 flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
                  hintsUsed >= maxHints || gameOver
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105'
                }`}
                aria-label="Use Hint"
              >
                <FaQuestionCircle />
                <span>Use Hint ({maxHints - hintsUsed} left)</span>
              </Button>
            </div>

            {/* Stats and Timer */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              {/* Score Display */}
              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-500 mr-2" />
                <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">Score: {score}</span>
              </div>

              {/* Total Points */}
              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-500 mr-2" />
                <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">Total Points: {totalPoints}</span>
              </div>

              {/* Game Statistics */}
              <div className="mb-4 w-full px-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">Games Played:</span>
                  <span className="ml-2 text-purple-600 dark:text-purple-200">{gamesPlayed}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">Wins:</span>
                  <span className="ml-2 text-green-600 dark:text-green-300">{wins}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">Losses:</span>
                  <span className="ml-2 text-red-600 dark:text-red-300">{losses}</span>
                </div>
              </div>

              {/* Timer Display */}
              <div className="flex items-center mt-4">
                <span className="font-semibold text-purple-700 dark:text-purple-300 mr-2">Time Left:</span>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Toast Notifications Over the Card */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            transition={Slide}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="absolute top-0 right-0 mt-4 mr-4 z-20"
            toastClassName="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg"
          />
        </div>

        {/* Decorative SVG or Image (Optional) */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-700 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute top-0 left-0 w-24 h-24 bg-pink-200 dark:bg-pink-700 rounded-full blur-2xl opacity-50"></div>
      </motion.div>

      {/* Footer with Calming Message */}
      <div className="absolute bottom-4 w-full text-center">
        <p className="text-gray-600 dark:text-gray-400">Take a deep breath and enjoy the game. 🧘‍♂️</p>
      </div>
    </div>
  );
};

export default StartGame;
