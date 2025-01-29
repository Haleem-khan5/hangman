// src/data/cardsData.tsx
import { FaInfoCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import React from 'react';

// Define the shape of each card's data
interface CardData {
  id: string;
  Icon: React.ComponentType<{ className?: string }>; // Icon component reference
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

// Define the cards data
const cardsData: CardData[] = [
  {
    id: '1',
    Icon: FaInfoCircle, // Reference to the icon component
    title: 'How to Play',
    description:
      'Guess the hidden tech word letter by letter before time runs out!',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-purple-600',
  },
  {
    id: '2',
    Icon: FaTrophy,
    title: 'Leaderboard',
    description: 'Compete with others and climb the ranks!',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-purple-600',
  },
  {
    id: '3',
    Icon: FaLightbulb,
    title: 'Tips & Tricks',
    description: 'Learn strategies to improve your guessing skills!',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-purple-600',
  },
];

export default cardsData;
