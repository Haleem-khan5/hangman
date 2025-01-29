// src/Shared/Button.tsx
import React from 'react';
import { ButtonHTMLAttributes } from 'react';

// Extend ButtonHTMLAttributes to include all standard button props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // You can add custom props here if needed
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`font-bold py-2 px-4 rounded ${className}`}
      {...props} // Spread all other props, including 'disabled'
    >
      {children}
    </button>
  );
};

export default Button;
