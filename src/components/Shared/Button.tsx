// src/Shared/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button", onClick, className = "", children }) => {
  return (
    <button type={type} onClick={onClick} className={`font-bold py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
};

export default Button;
