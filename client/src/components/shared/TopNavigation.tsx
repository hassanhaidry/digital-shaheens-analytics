import React from 'react';

const TopNavigation: React.FC = () => {
  return (
    <header className="bg-primary shadow-md z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button type="button" className="md:hidden p-2 text-white">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-white text-lg font-medium ml-2 md:ml-0">Digital Shaheens Analytics</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <input 
              type="text" 
              placeholder="Search analytics..." 
              className="w-64 px-4 py-2 pl-10 bg-primary-dark bg-opacity-50 rounded-md text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-blue-200"></i>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="text-white p-2 rounded-full hover:bg-primary-dark relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full"></span>
            </button>
            <button className="text-white p-2 rounded-full hover:bg-primary-dark">
              <i className="fas fa-shopping-bag"></i>
            </button>
            <button className="text-white p-2 rounded-full hover:bg-primary-dark">
              <i className="fas fa-dollar-sign"></i>
            </button>
            <button className="text-white p-2 rounded-full hover:bg-primary-dark">
              <i className="fas fa-users"></i>
            </button>
            <button className="text-white p-2 rounded-full hover:bg-primary-dark">
              <i className="fas fa-cog"></i>
            </button>
            <div className="flex items-center pl-2">
              <button className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-primary font-medium">
                <i className="fas fa-user text-sm"></i>
              </button>
              <div className="ml-2 hidden md:block">
                <p className="text-white text-sm">Admin User</p>
                <p className="text-blue-200 text-xs">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
