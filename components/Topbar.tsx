import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { GoChevronDown } from "react-icons/go";

const Topbar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full">
      <div className="flex items-center space-x-4">{/* Breadcrumb or page title can go here */}</div>

      <div className="flex items-center space-x-4 relative">
        {/* User menu */}
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f6fa] hover:bg-[#e6eef7] font-semibold text-[#1e5fa6]"
          onClick={() => setShowMenu((v) => !v)}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">U</span>
          </div>
          <span className="text-gray-700">{user?.name || 'User'}</span>
          <GoChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        {showMenu && (
          <div 
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#f2f6fa] text-[#1e5fa6] rounded-lg"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar; 