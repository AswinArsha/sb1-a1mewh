// src/components/Sidebar.tsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Book, Home, LogOut, Menu, Search, Settings } from 'lucide-react';
import { Transition } from '@headlessui/react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'CRM', icon: <Home className="h-5 w-5" />, path: '/crm' },
    { name: 'Client Ledger', icon: <Book className="h-5 w-5" />, path: '/ledger' },
    // Add more navigation items here
  ];

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`flex flex-col h-screen bg-white shadow-lg transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {/* Logo and Title */}
          {!isCollapsed && (
            <div className="flex items-center">
          
              <span className="text-xl font-semibold text-gray-800">Wabisabi CRM</span>
            </div>
          )}
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

      
        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t">
          <div className="flex items-center">
       
            {!isCollapsed && <span className="text-gray-700">user</span>}
            <button
              className="ml-auto p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;

// Helper Input Component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
);
