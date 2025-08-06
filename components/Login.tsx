import React, { useState } from 'react';
import { User, Mail, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      // Simple validation - in real app, this would be API call
      const userCredentials = {
        email: email,
        name: email.split('@')[0], // Use part before @ as name
      };
      
      // Save to localStorage
      localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
      setIsLoggedIn(true);
      
      // Trigger a page refresh to update header
      window.dispatchEvent(new Event('storage'));
      
      alert(`Successfully logged in as ${email}`);
    } else {
      alert('Please enter both email and password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userCredentials');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    
    // Trigger a page refresh to update header
    window.dispatchEvent(new Event('storage'));
    
    alert('Successfully logged out');
  };

  // Check if user is already logged in
  React.useEffect(() => {
    try {
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials && savedCredentials.trim() !== '') {
        const creds = JSON.parse(savedCredentials);
        if (creds && creds.email) {
          setIsLoggedIn(true);
          setEmail(creds.email);
        }
      }
    } catch (error) {
      console.warn('Failed to parse user credentials from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('userCredentials');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Authentication</h1>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isLoggedIn ? 'User Account' : 'Login to Dashboard'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLoggedIn ? 'You are currently logged in' : 'Enter your credentials to access the admin panel'}
          </p>
        </div>

        {!isLoggedIn ? (
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          </form>
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
            >
              Logout
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo credentials - Any email and password will work
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
