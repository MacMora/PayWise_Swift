"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from './AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex h-screen  bg-[#f8fbff]">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col pl-64 overflow-hidden">
        <div className="fixed top-0 right-0 left-64 z-40">
          <Topbar onLogout={() => { logout(); router.push('/login'); }} />
        </div>
        <main className=" flex-1 p-8 mt-16 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 