
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} />
       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"></div>}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;