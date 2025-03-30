import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: 'fa-home' },
    { path: '/shops', label: 'Shops', icon: 'fa-store' },
    { path: '/settings', label: 'Settings', icon: 'fa-cog' },
    { path: '/agency-profit', label: 'Agency Profit', icon: 'fa-dollar-sign' },
    { path: '/user-management', label: 'User Management', icon: 'fa-users' }
  ];

  return (
    <div className="bg-primary hidden md:flex md:w-64 flex-col fixed inset-y-0">
      {/* Brand Logo */}
      <div className="flex items-center px-4 py-5">
        <div className="bg-amber-400 w-10 h-10 flex items-center justify-center rounded">
          <i className="fas fa-chart-line text-primary text-xl"></i>
        </div>
        <div className="ml-3">
          <h1 className="text-white font-semibold text-xl">EcomOS <span className="text-xs bg-blue-800 px-2 py-0.5 rounded text-blue-100">PRO</span></h1>
          <p className="text-blue-200 text-xs">Enterprise Analytics</p>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-5 flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex items-center px-4 py-3 rounded-md font-medium", 
              location === item.path 
                ? "text-white bg-primary-light bg-opacity-20" 
                : "text-blue-200 hover:bg-primary-light hover:bg-opacity-20"
            )}
          >
            <i className={`fas ${item.icon} mr-3`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
