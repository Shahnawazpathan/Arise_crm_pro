
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AriseLogoIcon, DashboardIcon, UsersIcon, ReportIcon, PlusIcon, SettingsIcon, ContactIcon, BellIcon } from './Icons';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const navLinkClasses = "flex items-center p-3 my-1 text-gray-300 rounded-lg hover:bg-secondary/80 hover:text-white transition-all duration-200 transform hover:translate-x-2";
  const activeLinkClasses = "bg-accent text-primary font-bold";

  return (
    <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-primary text-white flex-col z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex`}>
      <div className="flex items-center justify-center h-20 border-b border-secondary/50 px-4">
        <AriseLogoIcon className="h-10 w-10 mr-3 text-accent" />
        <h1 className="text-2xl font-bold text-on_primary">Arise CRM</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`} end>
          <DashboardIcon className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/clients" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <UsersIcon className="h-6 w-6 mr-3" />
          Clients
        </NavLink>
        <NavLink to="/dashboard/add-client" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <PlusIcon className="h-6 w-6 mr-3" />
          Add New Client
        </NavLink>
        <NavLink to="/dashboard/reports" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ReportIcon className="h-6 w-6 mr-3" />
          Reports
        </NavLink>
        <NavLink to="/dashboard/notifications" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <BellIcon className="h-6 w-6 mr-3" />
          Notifications
        </NavLink>
        <NavLink to="/dashboard/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ContactIcon className="h-6 w-6 mr-3" />
          Contact
        </NavLink>
      </nav>
      <div className="px-4 py-4 border-t border-secondary/50">
        <NavLink to="/dashboard/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <SettingsIcon className="h-6 w-6 mr-3" />
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
