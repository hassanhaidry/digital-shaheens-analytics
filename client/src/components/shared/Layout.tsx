import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, ShoppingBag, DollarSign, Users, Settings, LogOut, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        {/* Top Navigation Bar */}
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="bg-yellow-400 text-primary rounded-md p-1.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg flex items-center">
                    EcomOS <span className="text-xs bg-blue-700 px-1.5 py-0.5 rounded ml-1.5">PRO</span>
                  </div>
                  <div className="text-xs text-blue-200">Enterprise Analytics</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            {/* Search Bar */}
            <div className="relative hidden md:block mx-4 w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-300" />
              </div>
              <input
                type="text"
                placeholder="Search analytics..."
                className="w-full bg-blue-800 text-white placeholder-blue-300 pl-10 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <DollarSign className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-800">
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Profile */}
              <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center text-white hover:bg-blue-800">
                    <div className="h-7 w-7 rounded-full bg-blue-700 flex items-center justify-center mr-2">
                      <span className="text-xs">A</span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm">Admin User</div>
                      <div className="text-xs text-blue-200">admin@example.com</div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="p-3 border-b">
                    <div className="font-semibold">Admin User</div>
                    <div className="text-sm text-gray-500">admin@example.com</div>
                    <div className="text-xs text-blue-600 mt-1">Admin Account</div>
                  </div>
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Manage Stores
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Agency Profit
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="px-4 flex space-x-6 border-t border-blue-800">
          <Link href="/">
            <div className={`py-3 border-b-2 px-1 cursor-pointer ${location === '/' ? 'border-yellow-400 text-white font-medium' : 'border-transparent text-blue-300 hover:text-white'}`}>
              Overview
            </div>
          </Link>
          <Link href="/shops">
            <div className={`py-3 border-b-2 px-1 cursor-pointer ${location === '/shops' ? 'border-yellow-400 text-white font-medium' : 'border-transparent text-blue-300 hover:text-white'}`}>
              Shops
            </div>
          </Link>
          <Link href="/settings">
            <div className={`py-3 border-b-2 px-1 cursor-pointer ${location === '/settings' ? 'border-yellow-400 text-white font-medium' : 'border-transparent text-blue-300 hover:text-white'}`}>
              Settings
            </div>
          </Link>
          <Link href="/agency-profit">
            <div className={`py-3 border-b-2 px-1 cursor-pointer ${location === '/agency-profit' ? 'border-yellow-400 text-white font-medium' : 'border-transparent text-blue-300 hover:text-white'}`}>
              Agency Profit
            </div>
          </Link>
          <Link href="/user-management">
            <div className={`py-3 border-b-2 px-1 cursor-pointer ${location === '/user-management' ? 'border-yellow-400 text-white font-medium' : 'border-transparent text-blue-300 hover:text-white'}`}>
              User Management
            </div>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-5">
        {children}
      </main>
    </div>
  );
};

export default Layout;
