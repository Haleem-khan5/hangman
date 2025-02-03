// src/components/StartGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../Shared/Button';
import { useAuth } from '../Shared/AuthContext';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLeaf, FaSun, FaMoon, FaQuestionCircle } from 'react-icons/fa';

// Hangman SVG components
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

// Theme context
import { useTheme } from '../Shared/ThemeContext';

/* 
  1) New WORDS array with hints included.
  2) Each object has 'word' (lowercase or uppercase is fine; we'll handle case in code) 
     and 'hint' describing the term. 
*/
const WORDS = [
  { 
    word: 'algorithm', 
    hint: 'Step-by-step instructions for solving a problem.'
  },
  {
    word: 'api',
    hint: 'Interface for communication between software components.'
  },
  {
    word: 'blockchain',
    hint: 'Decentralized ledger for secure transactions.'
  },
  {
    word: 'database',
    hint: 'Structured collection of organized data.'
  },
  {
    word: 'encryption',
    hint: 'Transforms data to prevent unauthorized access.'
  },
  {
    word: 'frontend',
    hint: 'Client-facing part of a web application.'
  },
  {
    word: 'docker',
    hint: 'Containerization platform for deploying applications.'
  },
  {
    word: 'react',
    hint: 'A JavaScript library for building user interfaces.'
  },
  {
    word: 'kubernetes',
    hint: 'System for automating container deployment and scaling.'
  },
  {
    word: 'typescript',
    hint: 'Typed superset of JavaScript that compiles to plain JS.'
  },
  {
    word: 'backend',
    hint: 'Server-side logic and functionality of an application.'
  },
  {
    word: 'devops',
    hint: 'Combines software development and IT operations practices.'
  },
  {
    word: 'agile',
    hint: 'Iterative approach to software development and project management.'
  },
  {
    word: 'scrum',
    hint: 'Agile framework for managing complex software projects.'
  },
  {
    word: 'python',
    hint: 'High-level, interpreted programming language.'
  },
  {
    word: 'c++',
    hint: 'Extension of C language with object-oriented features.'
  },
  {
    word: 'java',
    hint: 'Popular object-oriented language used across platforms.'
  },
  {
    word: 'swift',
    hint: 'Programming language designed for Apple platforms.'
  },
  {
    word: 'go',
    hint: 'Compiled language developed at Google, also known as Golang.'
  },
  {
    word: 'rust',
    hint: 'Systems programming language focused on speed and safety.'
  },
  {
    word: 'php',
    hint: 'Scripting language suited for web development.'
  },
  {
    word: 'ruby',
    hint: 'Dynamic programming language, known for Ruby on Rails.'
  },
  {
    word: 'sql',
    hint: 'Language for managing data in relational databases.'
  },
  {
    word: 'nosql',
    hint: 'Non-relational databases with flexible data models.'
  },
  {
    word: 'html',
    hint: 'Markup language used to structure web pages.'
  },
  {
    word: 'css',
    hint: 'Style sheet language for designing web page presentation.'
  },
  {
    word: 'javascript',
    hint: 'High-level language for web scripting and beyond.'
  },
  {
    word: 'azure',
    hint: 'Microsoft’s cloud computing service platform.'
  },
  {
    word: 'aws',
    hint: 'Amazon Web Services, a widely used cloud platform.'
  },
  {
    word: 'gcp',
    hint: 'Google Cloud Platform for hosting and deploying services.'
  },
  {
    word: 'django',
    hint: 'High-level Python web framework with batteries included.'
  },
  {
    word: 'flask',
    hint: 'Lightweight Python web framework for quick prototypes.'
  },
  {
    word: 'node',
    hint: 'JavaScript runtime built on Chrome’s V8 engine.'
  },
  {
    word: 'npm',
    hint: 'Package manager for JavaScript and Node.js.'
  },
  {
    word: 'yarn',
    hint: 'Alternative package manager for Node.js projects.'
  },
  {
    word: 'webpack',
    hint: 'Module bundler for modern JavaScript applications.'
  },
  {
    word: 'babel',
    hint: 'JavaScript compiler that converts newer syntax to older JS.'
  },
  {
    word: 'jest',
    hint: 'Delightful JavaScript testing framework by Facebook.'
  },
  {
    word: 'cypress',
    hint: 'End-to-end testing framework for web applications.'
  },
  {
    word: 'serverless',
    hint: 'Cloud model where code runs without managing servers.'
  },
  {
    word: 'virtualization',
    hint: 'Creating virtual instances of hardware or operating systems.'
  },
  {
    word: 'machinelearning',
    hint: 'Algorithms enabling computers to learn from data.'
  },
  {
    word: 'datascience',
    hint: 'Field focused on extracting insights from data.'
  },
  {
    word: 'deeplearning',
    hint: 'Neural networks with multiple layers for complex tasks.'
  },
  {
    word: 'neuralnetwork',
    hint: 'Computational model inspired by the human brain.'
  },
  {
    word: 'quantumcomputing',
    hint: 'Computing leveraging quantum-mechanical phenomena.'
  },
  {
    word: 'bigdata',
    hint: 'Massive datasets requiring advanced processing methods.'
  },
  {
    word: 'iot',
    hint: 'Internet of Things, interconnected smart devices.'
  },
  {
    word: 'robotics',
    hint: 'Engineering discipline for building and programming robots.'
  },
  {
    word: 'cryptography',
    hint: 'Securing information via encoded transformations.'
  },
  {
    word: 'polars',
    hint: 'DataFrames library in Rust for high-performance data queries.'
  },
  {
    word: 'tensorflow',
    hint: 'Open-source library for machine learning by Google.'
  },
  {
    word: 'pytorch',
    hint: 'Machine learning framework by Meta (Facebook).'
  },
  {
    word: 'express',
    hint: 'Minimalist web framework for Node.js.'
  },
  {
    word: 'laravel',
    hint: 'Popular PHP framework emphasizing elegance and simplicity.'
  },
  {
    word: 'symfony',
    hint: 'Reusable PHP components and framework.'
  },
  {
    word: 'spring',
    hint: 'Comprehensive Java framework for enterprise applications.'
  },
  {
    word: 'firebase',
    hint: 'Google-backed platform for mobile and web app development.'
  },
  {
    word: 'firestore',
    hint: 'Serverless NoSQL document database from Firebase.'
  },
  {
    word: 'mongodb',
    hint: 'Document-oriented NoSQL database.'
  },
  {
    word: 'postgresql',
    hint: 'Advanced open-source relational database system.'
  },
  {
    word: 'oracle',
    hint: 'Proprietary, multi-model database management system.'
  },
  {
    word: 'cassandra',
    hint: 'Distributed NoSQL DB for large-scale data.'
  },
  {
    word: 'redis',
    hint: 'In-memory data store, commonly used as cache.'
  },
  {
    word: 'redux',
    hint: 'State management library for JavaScript apps.'
  },
  {
    word: 'electron',
    hint: 'Framework for building cross-platform desktop apps with JS.'
  },
  {
    word: 'flutter',
    hint: 'UI toolkit by Google for building natively compiled apps.'
  },
  {
    word: 'swiftui',
    hint: 'Declarative UI framework for Apple platforms using Swift.'
  },
  {
    word: 'tailwind',
    hint: 'Utility-first CSS framework for rapid UI development.'
  },
  {
    word: 'bootstrap',
    hint: 'CSS framework for building responsive, mobile-first sites.'
  },
  {
    word: 'sass',
    hint: 'CSS preprocessor with features like variables and nesting.'
  },
  {
    word: 'less',
    hint: 'CSS preprocessor for improved code organization.'
  },
  {
    word: 'grunt',
    hint: 'JavaScript task runner for automating development tasks.'
  },
  {
    word: 'gulp',
    hint: 'Streaming build system for front-end workflows.'
  },
  {
    word: 'webassembly',
    hint: 'Binary format for running code at near-native speed in browsers.'
  },
  {
    word: 'bigquery',
    hint: 'Google’s serverless, scalable data warehouse.'
  },
  {
    word: 'databricks',
    hint: 'Unified analytics platform built on Apache Spark.'
  },
  {
    word: 'hive',
    hint: 'Data warehouse software built on Hadoop for big data.'
  },
  {
    word: 'pig',
    hint: 'Platform for analyzing large data sets using a high-level language.'
  },
  {
    word: 'hadoop',
    hint: 'Framework for distributed storage and processing of big data.'
  },
  {
    word: 'spark',
    hint: 'Cluster computing system for large-scale data processing.'
  },
  {
    word: 'zookeeper',
    hint: 'Centralized service for maintaining configuration and naming.'
  },
  {
    word: 'microservices',
    hint: 'Building apps as small, independently deployable services.'
  },
  {
    word: 'concurrency',
    hint: 'Multiple computations happening at overlapping times.'
  },
  {
    word: 'threads',
    hint: 'Smallest sequence of programmed instructions managed independently.'
  },
  {
    word: 'parallelism',
    hint: 'Executing multiple processes simultaneously.'
  },
  {
    word: 'kafka',
    hint: 'Distributed event streaming platform for real-time data pipelines.'
  },
  {
    word: 'loadbalancing',
    hint: 'Distributing network traffic across multiple servers.'
  },
  {
    word: 'cache',
    hint: 'Stores data for quick access to improve performance.'
  },
  {
    word: 'versioncontrol',
    hint: 'System for tracking changes in files/code over time.'
  },
  {
    word: 'github',
    hint: 'Web-based platform for Git repositories and collaboration.'
  },
  {
    word: 'bitbucket',
    hint: 'Git code hosting and collaboration tool by Atlassian.'
  },
  {
    word: 'gitlab',
    hint: 'DevOps lifecycle tool with built-in Git repository management.'
  },
  {
    word: 'pipeline',
    hint: 'Automated sequence of tasks in software development or data flow.'
  },
  {
    word: 'ci',
    hint: 'Continuous Integration: automates building and testing code.'
  },
  {
    word: 'cd',
    hint: 'Continuous Deployment or Delivery, automating releases to production.'
  },
  {
    word: 'observability',
    hint: 'Monitoring system health and performance for better insight.'
  },
  {
    word: 'analytics',
    hint: 'Systematic computational analysis of data or statistics.'
  },
  {
    word: 'forecasting',
    hint: 'Predicting future trends based on historical data.'
  },
  {
    word: 'orchestration',
    hint: 'Automating configuration and coordination of complex systems.'
  }
];


// Maximum wrong guesses allowed
const MAX_WRONG = 6;

// Maximum number of paid hints per game
const MAX_HINTS = 3;

// Deduction in points for each paid hint
const HINT_PENALTY = 2;

// Initial time for the timer (in seconds)
const INITIAL_TIME = 60;

// Helper to get a random word object from the WORDS array
const getRandomWordObject = () => {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex];
};

const StartGame: React.FC = () => {
  const authContext = useAuth();
  // If `authContext` is missing, fallback to a no-op
  const addScore = authContext?.addScore ?? (() => {});

  // Game states
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  // Word & hint
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Hints system (paid hints)
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(false);

  // Popups
  const [showHintPopup, setShowHintPopup] = useState(true); // Show textual hint from the start
  const [showResultPopup, setShowResultPopup] = useState(false); // Show final word at game end

  // Theme
  const { darkMode, toggleDarkMode } = useTheme();

  // Initialize the game with a random word
  useEffect(() => {
    const { word: newWord, hint: newHint } = getRandomWordObject();
    const chosenWord = newWord.toLowerCase();

    // Reveal up to 2 random letters for free
    const lettersToReveal: string[] = [];
    if (chosenWord.length > 0) {
      const maxFreeReveals = Math.min(2, chosenWord.length);
      for (let i = 0; i < maxFreeReveals; i++) {
        let letterIndex;
        do {
          letterIndex = Math.floor(Math.random() * chosenWord.length);
        } while (
          lettersToReveal.includes(chosenWord[letterIndex]) ||
          chosenWord[letterIndex] === ' '
        );
        lettersToReveal.push(chosenWord[letterIndex]);
      }
    }

    setWord(chosenWord);
    setHint(newHint);
    setGuessedLetters(lettersToReveal);
    setTimerActive(true);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || gameOver) return;

    if (timeLeft <= 0) {
      // Time's up
      setGameOver(true);
      setLosses(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(0);
      toast.error(`⏰ Time's up! The word was "${word.toUpperCase()}".`, { autoClose: 5000 });
      setTimerActive(false);
      setShowResultPopup(true); // Show final word in popup
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, timerActive, gameOver, word, addScore]);

  // Check if game is won
  useEffect(() => {
    if (!word) return;

    const letters = word.split('');
    const allGuessed = letters.every(letter => {
      if (letter === ' ') return true;
      return guessedLetters.includes(letter);
    });

    if (allGuessed && !gameOver) {
      setGameOver(true);
      setScore(prev => prev + 10);
      setTotalPoints(prev => prev + 10);
      setWins(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(10);
      toast.success('🎉 Congratulations! You guessed the word!', { autoClose: 5000 });
      setTimerActive(false);
      setShowResultPopup(true); // Show final word in popup
    }
  }, [guessedLetters, word, addScore, gameOver]);

  // Check if game is lost
  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG && !gameOver) {
      setGameOver(true);
      setLosses(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      addScore(0);
      toast.error(`😢 Game Over! The word was "${word.toUpperCase()}".`, { autoClose: 5000 });
      setTimerActive(false);
      setShowResultPopup(true); // Show final word in popup
    }
  }, [wrongGuesses, word, addScore, gameOver]);

  // Handle guesses
  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (word.includes(letter)) {
      // Correct guess
      setScore(prev => prev + 2);
      setTotalPoints(prev => prev + 2);
      addScore(2);
      toast.success(`✅ Correct! "${letter.toUpperCase()}" is in the word.`, { autoClose: 3000 });
    } else {
      // Wrong guess
      setWrongGuesses(prev => prev + 1);
      toast.error(`❌ Wrong! "${letter.toUpperCase()}" is not in the word.`, { autoClose: 3000 });
    }
  };

  // Paid hint
  const handleUseHint = () => {
    if (hintsUsed >= MAX_HINTS || gameOver) return;

    // Find unguessed letters
    const unguessedLetters = word
      .split('')
      .filter(letter => !guessedLetters.includes(letter) && letter !== ' ');

    if (unguessedLetters.length === 0) {
      toast.info('All letters have already been revealed!', { autoClose: 3000 });
      return;
    }

    const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];

    setGuessedLetters(prev => [...prev, randomLetter]);
    setHintsUsed(prev => prev + 1);

    // Deduct points
    setScore(prev => prev - HINT_PENALTY);
    setTotalPoints(prev => prev - HINT_PENALTY);
    addScore(-HINT_PENALTY);

    toast.info(`💡 Hint used: The letter "${randomLetter.toUpperCase()}" is revealed.`, {
      autoClose: 3000
    });
  };

  // Restart game
  const handleRestart = () => {
    const { word: newWord, hint: newHint } = getRandomWordObject();
    const chosenWord = newWord.toLowerCase();

    // Reveal 2 letters for free
    const lettersToReveal: string[] = [];
    if (chosenWord.length > 0) {
      const maxFreeReveals = Math.min(2, chosenWord.length);
      for (let i = 0; i < maxFreeReveals; i++) {
        let letterIndex;
        do {
          letterIndex = Math.floor(Math.random() * chosenWord.length);
        } while (
          lettersToReveal.includes(chosenWord[letterIndex]) ||
          chosenWord[letterIndex] === ' '
        );
        lettersToReveal.push(chosenWord[letterIndex]);
      }
    }

    setWord(chosenWord);
    setHint(newHint);
    setGuessedLetters(lettersToReveal);
    setWrongGuesses(0);
    setGameOver(false);
    setScore(0);
    setHintsUsed(0);
    setTimeLeft(INITIAL_TIME);
    setTimerActive(true);

    // Hide result popup if it was open
    setShowResultPopup(false);
    // Show the hint popup again
    setShowHintPopup(true);

    toast.info('🔄 Game restarted! Good luck!', { autoClose: 3000 });
  };

  // Display underscores or guessed letters
  const displayWord = word.split('').map((letter, index) => {
    if (letter === ' ') {
      return (
        <span key={index} className="mx-1 text-4xl font-mono">
          {' '}
        </span>
      );
    }
    return (
      <span key={index} className="mx-1 text-4xl font-mono">
        {guessedLetters.includes(letter) ? letter.toUpperCase() : '_'}
      </span>
    );
  });

  // Particles init
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  // Particle config
  const particlesOptions = {
    background: {
      color: {
        value: darkMode ? '#1a202c' : '#f0e6f6'
      }
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: darkMode ? '#cbd5e0' : '#a78bfa' },
      links: {
        enable: true,
        distance: 150,
        color: darkMode ? '#4a5568' : '#c4b5fd',
        opacity: 0.5,
        width: 1
      },
      collisions: { enable: false },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: { default: 'bounce' as const },
        random: false,
        speed: 1,
        straight: false
      },
      number: {
        density: { enable: true, area: 800 },
        value: 50
      },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } }
    },
    detectRetina: true
  };

  // Hangman parts
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
      <HangmanRightLeg key="rightLeg" />
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

  // Keyboard
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
      {/* Floating Shapes */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-xl opacity-70"
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full blur-xl opacity-70"
      />

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

      {/* Main Card */}
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
          <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-8 md:space-y-0 md:space-x-12">
            {/* Hangman & Word Display */}
            <div className="flex flex-col items-center w-full md:w-1/3">
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

              {/* Partially Revealed Word */}
              <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-inner w-full flex justify-center flex-wrap">
                <span className="text-4xl font-mono tracking-wider flex flex-wrap justify-center">
                  {displayWord}
                </span>
              </div>

              {/* Restart Button (only show if game over) */}
              {gameOver && (
                <Button
                  onClick={handleRestart}
                  className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 dark:from-green-400 dark:to-blue-400 dark:hover:from-purple-500 dark:hover:to-pink-500 px-4 py-2 rounded-lg shadow-md"
                >
                  Restart
                </Button>
              )}
            </div>

            {/* Keyboard & Paid Hint */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                Choose a Letter
              </h3>
              <div className="flex flex-wrap justify-center max-w-md">
                {renderKeyboard()}
              </div>

              {/* Paid Hint Button */}
              <Button
                onClick={handleUseHint}
                disabled={hintsUsed >= MAX_HINTS || gameOver}
                className={`mt-4 flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
                  hintsUsed >= MAX_HINTS || gameOver
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105'
                }`}
                aria-label="Use Additional Hint"
              >
                <FaQuestionCircle />
                <span>Use Hint ({MAX_HINTS - hintsUsed} left)</span>
              </Button>
            </div>

            {/* Stats & Timer */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-500 mr-2" />
                <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                  Score: {score}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <FaLeaf className="text-green-500 mr-2" />
                <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                  Total Points: {totalPoints}
                </span>
              </div>

              <div className="mb-4 w-full px-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    Games Played:
                  </span>
                  <span className="ml-2 text-purple-600 dark:text-purple-200">
                    {gamesPlayed}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    Wins:
                  </span>
                  <span className="ml-2 text-green-600 dark:text-green-300">
                    {wins}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    Losses:
                  </span>
                  <span className="ml-2 text-red-600 dark:text-red-300">
                    {losses}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center mt-4">
                <span className="font-semibold text-purple-700 dark:text-purple-300 mr-2">
                  Time Left:
                </span>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Toast Notifications */}
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

        {/* Decorative BG elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-700 rounded-full blur-2xl opacity-50" />
        <div className="absolute top-0 left-0 w-24 h-24 bg-pink-200 dark:bg-pink-700 rounded-full blur-2xl opacity-50" />
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Take a deep breath and enjoy the game. 🧘‍♂️
        </p>
      </div>

      {/* ---------- Hint Popup ---------- */}
      {showHintPopup && (
        <div className="fixed top-20 right-8 z-50 bg-yellow-100 dark:bg-yellow-800 text-gray-800 dark:text-gray-100 p-4 rounded shadow-lg w-64">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Word Hint</h4>
            <button
              onClick={() => setShowHintPopup(false)}
              className="text-black dark:text-white font-bold"
              aria-label="Close hint popup"
            >
              ×
            </button>
          </div>
          <p className="text-sm leading-snug">{hint}</p>
        </div>
      )}

      {/* ---------- Result Popup ---------- */}
      {showResultPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative max-w-sm w-full mx-4">
            <button
              onClick={() => setShowResultPopup(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-600 dark:text-gray-200"
              aria-label="Close final word popup"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4 text-center">
              The word was:
            </h2>
            <p className="text-4xl text-center font-extrabold text-red-600 dark:text-red-400">
              {word.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartGame;