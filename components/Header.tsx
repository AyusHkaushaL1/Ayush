import React, { useState, useEffect } from 'react';
import { User, Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const [userCredentials, setUserCredentials] = useState<{email: string; name: string} | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('userCredentials');
    setUserCredentials(null);
    window.dispatchEvent(new Event('storage'));
    alert('Successfully logged out');
  };

  useEffect(() => {
    // Get user credentials from localStorage or state management
    const loadCredentials = () => {
      try {
        const savedCredentials = localStorage.getItem('userCredentials');
        if (savedCredentials && savedCredentials.trim() !== '') {
          const creds = JSON.parse(savedCredentials);
          if (creds && typeof creds === 'object') {
            setUserCredentials(creds);
          } else {
            setUserCredentials(null);
          }
        } else {
          setUserCredentials(null);
        }
      } catch (error) {
        console.warn('Failed to parse user credentials from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('userCredentials');
        setUserCredentials(null);
      }
    };

    // Load initial credentials
    loadCredentials();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      loadCredentials();
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-amber-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {userCredentials?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500">
                {userCredentials?.email || 'Not logged in'}
              </p>
            </div>
            {userCredentials && (
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
