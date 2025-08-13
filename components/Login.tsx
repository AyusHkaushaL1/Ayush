import React, { useState, useEffect } from 'react';
import axios from 'axios'; // This line requires the 'axios' package to be installed.
import { User, Mail, Lock, LogIn, UserPlus, Send, CheckCircle, Key, XCircle } from 'lucide-react';

// Base URL for all API endpoints
const API_BASE_URL = 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/auth';

// Define a type for the message box props
interface MessageBoxProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// A simple message box component to replace `alert()`
const MessageBox: React.FC<MessageBoxProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg border ${bgColor} ${borderColor} flex items-start space-x-3 transition-opacity duration-300 z-50`}>
      {icon}
      <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <XCircle className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

// Define a type for the message state
interface MessageState {
  text: string;
  type: 'success' | 'error';
}

const App = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('login'); // login, register, forgotPassword, verifyEmail
  const [message, setMessage] = useState<MessageState | null>(null);

  useEffect(() => {
    // Check for existing login credentials in local storage
    try {
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials) {
        const creds = JSON.parse(savedCredentials);
        if (creds && creds.email) {
          setIsLoggedIn(true);
          setEmail(creds.email);
        }
      }
    } catch (error) {
      console.warn('Failed to parse user credentials from localStorage:', error);
      localStorage.removeItem('userCredentials');
    }
  }, []);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessage('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const userCredentials = {
        email: email,
        name: response.data.user.name || email.split('@')[0],
        token: response.data.token,
      };

      localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
      setIsLoggedIn(true);
      window.dispatchEvent(new Event('storage'));
      showMessage(`Successfully logged in as ${email}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          showMessage('Invalid email or password', 'error');
        } else if (error.response.status === 400) {
           showMessage('Login failed: Your account may not be verified. Please verify your email or try the demo login.', 'error');
        } else {
          showMessage(`Login failed: ${error.response.data.message || 'An unknown error occurred'}`, 'error');
        }
      } else {
        showMessage('An error occurred during login. Please try again.', 'error');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
      showMessage('Registration successful! Please check your email to verify your account.');
      setCurrentView('login');
      setVerificationEmail(email); // Set the email for verification after registration
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Registration failed with response data:', error.response.data);
          console.error('Registration failed with response status:', error.response.status);
          showMessage(`Registration failed: ${error.response.data.message || `Server Error: ${error.response.status}`}`, 'error');
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Registration failed: No response received. Request details:', error.request);
          showMessage('Registration failed: No response from server. Check your network connection.', 'error');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error in setting up registration request:', error.message);
          showMessage(`Registration failed: An unexpected error occurred.`, 'error');
        }
      } else {
        // Fallback for non-Axios errors
        console.error('Non-Axios error during registration:', error);
        showMessage('An unexpected error occurred during registration. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials) {
        const creds = JSON.parse(savedCredentials);
        if (creds && creds.token) {
          // Post request to backend to invalidate the token
          await axios.post(`${API_BASE_URL}/logout`, {}, {
            headers: {
              Authorization: `Bearer ${creds.token}`
            }
          });
        }
      }
      localStorage.removeItem('userCredentials');
      setIsLoggedIn(false);
      setEmail('');
      setPassword('');
      setName('');
      window.dispatchEvent(new Event('storage'));
      showMessage('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      showMessage('An error occurred during logout. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!verificationEmail) {
      showMessage('Please enter an email address to send the verification token', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/send-verification`, { email: verificationEmail });
      showMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showMessage(`Failed to send verification email: ${error.response.data.message || 'An unknown error occurred'}`, 'error');
      } else {
        showMessage('An error occurred. Please try again.', 'error');
      }
      console.error('Send verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showMessage('Please enter the verification token', 'error');
      return;
    }
    if (!verificationEmail) {
      showMessage('Please enter the email address associated with the token', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/verify-email`, { token, email: verificationEmail });
      showMessage('Email verified successfully! You can now log in.');
      setToken('');
      setVerificationEmail('');
      setCurrentView('login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showMessage(`Email verification failed: ${error.response.data.message || 'An unknown error occurred'}`, 'error');
      } else {
        showMessage('An error occurred. Please try again.', 'error');
      }
      console.error('Verify email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showMessage('Please enter your email to reset the password', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      showMessage('Password reset link sent to your email address.');
      setCurrentView('login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showMessage(`Failed to send reset link: ${error.response.data.message || 'An unknown error occurred'}`, 'error');
      } else {
        showMessage('An error occurred. Please try again.', 'error');
      }
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const userCredentials = {
      email: 'demo@example.com',
      name: 'Demo User',
      token: 'this-is-a-demo-token-for-testing',
    };
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
    setIsLoggedIn(true);
    setEmail(userCredentials.email);
    showMessage('Logged in as a demo user for testing.', 'success');
  };

  const renderForm = () => {
    switch (currentView) {
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your password (min 8 characters)"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registering...</span>
                </div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </>
              )}
            </button>
            <div className="text-center text-sm text-gray-600">
              Already have an account? <button type="button" onClick={() => setCurrentView('login')} className="text-amber-600 hover:text-amber-700 font-medium">Login here</button>
            </div>
          </form>
        );

      case 'forgotPassword':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <p className="text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center text-sm text-gray-600">
              <button type="button" onClick={() => setCurrentView('login')} className="text-amber-600 hover:text-amber-700 font-medium">Back to login</button>
            </div>
          </form>
        );

      case 'verifyEmail':
        return (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <p className="text-sm text-gray-600">Enter the email address and verification token sent to your inbox.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={verificationEmail}
                  onChange={(e) => setVerificationEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Token</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your token"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={handleSendVerificationEmail}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                disabled={loading}
              >
                Resend Verification Email
              </button>
              <button
                type="submit"
                className="bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              <button type="button" onClick={() => setCurrentView('login')} className="text-amber-600 hover:text-amber-700 font-medium">Back to login</button>
            </div>
          </form>
        );

      default:
        // Login form
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your password (min 8 characters)"
                  required
                />
              </div>
              <div className="text-right mt-2 text-sm">
                <button type="button" onClick={() => setCurrentView('forgotPassword')} className="text-amber-600 hover:text-amber-700 font-medium">
                  Forgot Password?
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account? <button type="button" onClick={() => setCurrentView('register')} className="text-amber-600 hover:text-amber-700 font-medium">Sign up</button>
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              <button type="button" onClick={() => { setCurrentView('verifyEmail'); setVerificationEmail(email); }} className="text-amber-600 hover:text-amber-700 font-medium">
                Verify Email
              </button>
            </div>
            {/* <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-slate-200 text-slate-800 py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
              >
                Login as Demo User
              </button>
            </div> */}
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-extrabold text-gray-900">User Authentication</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoggedIn ? 'User Account' : currentView === 'register' ? 'Create a New Account' : currentView === 'forgotPassword' ? 'Reset Your Password' : currentView === 'verifyEmail' ? 'Verify Your Email' : 'Login to Authenticate'}
            </h2>
            {/* <p className="text-gray-600 mt-2">
              {isLoggedIn ? 'You are currently logged in' : 'Please use the forms below to authenticate'}
            </p> */}
          </div>

          {!isLoggedIn ? (
            renderForm()
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">Successfully Logged In</p>
                    <p className="text-green-600 text-sm">{email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span>Administrator</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Logout
              </button>
            </div>
          )}

          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a demo authentication flow.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default App;
