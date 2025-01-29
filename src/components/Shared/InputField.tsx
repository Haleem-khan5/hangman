// src/Shared/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = 'text', value, onChange, className = '' }) => {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${className}`}
        required
      />
    </div>
  );
};

export default InputField;
