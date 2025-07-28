import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import DictionaryShortcut from './DictionaryShortcut';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
      {/* Dictionary Shortcut - Available on all pages */}
      <DictionaryShortcut position="bottom-right" />
    </div>
  );
};

export default Layout;