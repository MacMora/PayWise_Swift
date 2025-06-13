import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { GoChevronDown } from "react-icons/go";
import { Menu } from "lucide-react";

interface TopbarProps {
  onLogout: () => void;
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout, onMenuClick }) => {
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 w-full">
      {/* Mobile menu button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
      >
        <Menu className="h-6 w-6 text-gray-500" />
      </button>

      <div className="flex-1 flex items-center justify-end space-x-4">
        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f6fa] hover:bg-[#e6eef7] font-semibold text-[#1e5fa6]"
            onClick={() => setShowMenu((v) => !v)}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">U</span>
            </div>
            <span className="hidden sm:inline text-gray-700">{user?.name || 'User'}</span>
            <GoChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          {showMenu && (
            <div 
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
      </div>
    </header>
  );
};

export default Topbar; 