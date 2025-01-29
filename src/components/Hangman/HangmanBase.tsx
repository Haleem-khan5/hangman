// src/components/Hangman/HangmanBase.tsx
import React from 'react';

const HangmanBase: React.FC = () => (
  <svg height="250" width="200" className="mx-auto">
    {/* Base */}
    <line x1="20" y1="230" x2="180" y2="230" stroke="#333" strokeWidth="4" />
    {/* Pole */}
    <line x1="50" y1="230" x2="50" y2="20" stroke="#333" strokeWidth="4" />
    {/* Beam */}
    <line x1="50" y1="20" x2="150" y2="20" stroke="#333" strokeWidth="4" />
    {/* Rope */}
    <line x1="150" y1="20" x2="150" y2="50" stroke="#333" strokeWidth="4" />
  </svg>
);

export default HangmanBase;
