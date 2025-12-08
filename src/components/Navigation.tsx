import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Brain, Trophy, User, Upload, Settings, Menu, X, LogOut, Folder, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
    item: { id: string; label: string; icon: React.ElementType };
    isActive: (path: string) => boolean;
    onClick: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick }) => {
    const Icon = item.icon;
    return (
        <button
            onClick={() => onClick(item.id)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.id)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
        >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
        </button>
    );
};

const UserMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                        onClick={() => {
                            navigate('/profile');
                            setIsOpen(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user as well for mobile view

  const navItems = [
    { id: '/community', label: 'Cộng đồng', icon: Users },
    { id: '/vocabularies', label: 'Từ vựng', icon: Folder },
    // { id: '/study-sets', label: 'Học phần', icon: BookOpen },
    { id: '/dashboard', label: 'Bảng điều khiển', icon: Home },
    // { id: '/achievements', label: 'Achievements', icon: Trophy },
  ];

  const handleNavigation = (path: string) => {
    // navigate(path);
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false); // Also close menu on mobile
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 mx-2 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VocabMaster</span>
            </div>
            <div className="flex justify-end items-center">
              <div className="hidden md:flex items-center space-x-8 ml-10">
                {navItems.map((item) => (
                    <NavItem key={item.id} item={item} isActive={isActive} onClick={handleNavigation} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
                <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation remains the same for now */}
      <nav className="md:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">VocabMaster</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && ( // Show user info if logged in
                <div className="flex items-center px-3 py-2 space-x-2 border-b mb-2">
                    <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.id)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
              {/* Logout button for mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;