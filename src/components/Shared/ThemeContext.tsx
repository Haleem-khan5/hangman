// src/components/Shared/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of the ThemeContext
interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextProps>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check local storage for theme preference
    const storedTheme = localStorage.getItem('darkMode');
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  // Toggle theme and store preference in local storage
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Apply theme to the document root and store preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming the ThemeContext
export const useTheme = () => useContext(ThemeContext);
