import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryLayout } from '../layout/primary-layout';

const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameOrEmailError, setUsernameOrEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateUsernameOrEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/; // Same regex as in signup)
    if (usernameOrEmail.trim() === '') {
      setUsernameOrEmailError('Username or Email is required.');
      return false;
    } else if (!emailRegex.test(usernameOrEmail) && usernameOrEmail.includes('@')) {
      setUsernameOrEmailError('Invalid email format.');
      return false;
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(usernameOrEmail)) {
      setUsernameOrEmailError('Username may only contain letters, numbers, underscores, and dashes, and cannot start with underscores or dashes.');
      return false;
    } else {
      setUsernameOrEmailError('');
      return true;
    }
  };

  const validatePassword = () => {
    if (password.trim() === '' && password.length > 8) {
      setPasswordError('Password is required.');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be 8 or more characters long.');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = async () => {
    const isUsernameOrEmailValid = validateUsernameOrEmail();
    const isPasswordValid = validatePassword();

    if (!isUsernameOrEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <PrimaryLayout>
      <div className="flex justify-center items-center h-full">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            onBlur={validateUsernameOrEmail}
            onKeyPress={handleKeyPress}
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
          />
          {usernameOrEmailError && <p className="text-red-500 mb-4">{usernameOrEmailError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
            onKeyPress={handleKeyPress}
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
          />
          {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-800 shadow-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 dark:bg-blue-700'} text-white`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </PrimaryLayout>
  );
};

export default LoginPage;
