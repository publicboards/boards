import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryLayout } from '../layout/primary-layout';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [privacyError, setPrivacyError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = () => {
    if (username.trim() === '') {
      setUsernameError('Username is required.');
      return false;
    } else if (username.length > 25) {
      setUsernameError('Username may not exceed 25 characters.');
      return false;
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(username)) {
      setUsernameError('Username may only contain letters, numbers, underscores, and dashes, and cannot start with underscores or dashes.');
      return false;
    } else {
      setUsernameError('');
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (email.trim() === '') {
      setEmailError('Email is required.');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
      return false;
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (password.trim() === '') {
      setPasswordError('Password is required.');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be 8 or more characters long.');
      return false;
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Password confirmation is required.');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateTerms = () => {
    if (!termsAccepted) {
      setTermsError('You must accept the Terms of Service.');
      return false;
    } else {
      setTermsError('');
    }
  };

  const validatePrivacy = () => {
    if (!privacyAccepted) {
      setPrivacyError('You must accept the Privacy Policy.');
      return false;
    } else {
      setPrivacyError('');
    }
  };

  const handleSignup = async () => {
    let results = [
      validateUsername(),
      validateEmail(),
      validatePassword(),
      validateConfirmPassword(),
      validateTerms(),
      validatePrivacy(),
    ]

    if (results.some((result) => result === false)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          terms_accepted: termsAccepted,
          privacy_accepted: privacyAccepted,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission behavior
      handleSignup();
    }
  };

  return (
    <PrimaryLayout>
      <div className="table w-full h-screen">
        <div className="table-cell align-middle">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Signup</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={validateUsername}
              onKeyUp={handleKeyUp}
              className="w-full p-2 mb-1 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
            />
            {usernameError && <p className="text-red-500 mb-4">{usernameError}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              onKeyUp={handleKeyUp}
              className="w-full p-2 mb-1 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
            />
            {emailError && <p className="text-red-500 mb-4">{emailError}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              onKeyUp={handleKeyUp}
              className="w-full p-2 mb-1 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
            />
            {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              onKeyUp={handleKeyUp}
              className="w-full p-2 mb-1 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
            />
            {confirmPasswordError && <p className="text-red-500 mb-4">{confirmPasswordError}</p>}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                onBlur={validateTerms}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
                I accept the <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>.
              </label>
            </div>
            {termsError && <p className="text-red-500 mb-4">{termsError}</p>}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                onBlur={validatePrivacy}
                className="mr-2"
              />
              <label htmlFor="privacy" className="text-gray-600 dark:text-gray-400">
                I accept the <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
              </label>
            </div>
            {privacyError && <p className="text-red-500 mb-4">{privacyError}</p>}
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className={`w-full p-2 rounded-md shadow-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'} text-white`}
            >
              {isLoading ? 'Signing up...' : 'Signup'}
            </button>
          </div>
        </div>
      </div>
    </PrimaryLayout>
  );
};

export default SignupPage;
