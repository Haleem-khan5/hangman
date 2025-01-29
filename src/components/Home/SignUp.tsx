// src/components/Signup.tsx
import React, { useState } from 'react';
import { useAuth } from '../Shared/AuthContext';
import InputField from '../Shared/InputField';
import Button from '../Shared/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Added icons for visibility toggle
import { motion } from 'framer-motion'; // For animations
// import { SiReact } from 'react-icons/si'; // Example decorative icon

interface SignupProps {
  onSuccess?: () => void; // Optional callback after successful signup
}

const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
  const authContext = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // States to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!authContext) {
    return <div>Error: Auth context is not available</div>;
  }
  const { signUp } = authContext;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const success = signUp(username, password);

    if (!success) {
      setError('Username already exists');
    } else {
      setError('');
      // Call the onSuccess callback if provided
      if (onSuccess) onSuccess();
      // Redirect to StartGame page
      navigate('/start-game');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="mt-10 flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      {/* Animated Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl opacity-75 blur-sm"></div>

        {/* Card Content */}
        <div className="relative p-8 ">
          {/* Decorative Icon */}
          {/* <div className="flex justify-center mb-4">
            <SiReact className="text-green-600 dark:text-green-300 text-4xl animate-spin-slow" />
          </div> */}

          <h2 className="text-3xl font-bold text-center text-green-600 dark:text-green-300 mb-6">
            Create Account
          </h2>

          {/* Error Message */}
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <FaUserPlus className="absolute left-3 top-12 text-gray-400" />
              <InputField
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-12 text-gray-400" />
              <InputField
                label="Password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
              />
              {/* Eye Icon for toggling password visibility */}
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-12 text-gray-400" />
              <InputField
                label="Confirm Password"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
              />
              {/* Eye Icon for toggling confirm password visibility */}
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-3 top-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-300 focus:outline-none"
            >
              Sign Up
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-600 dark:text-green-300 font-semibold hover:underline transition-colors duration-300"
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Decorative SVG or Image (Optional) */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-200 dark:bg-green-700 rounded-full blur-2xl opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default Signup;
