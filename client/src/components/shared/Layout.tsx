import React from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64">
        <TopNavigation />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
