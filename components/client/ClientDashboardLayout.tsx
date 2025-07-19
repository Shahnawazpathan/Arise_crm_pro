
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Header from '../shared/Header';
import { AriseLogoIcon, DashboardIcon, DocumentTextIcon, ClockRewindIcon, LifebuoyIcon } from '../shared/Icons';

const ClientDashboardLayout: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/client-dashboard', text: 'Overview', icon: <DashboardIcon className="h-5 w-5 mr-2" />, exact: true },
    { to: '/client-dashboard/documents', text: 'My Documents', icon: <DocumentTextIcon className="h-5 w-5 mr-2" /> },
    { to: '/client-dashboard/history', text: 'History', icon: <ClockRewindIcon className="h-5 w-5 mr-2" /> },
    { to: '/client-dashboard/support', text: 'Support', icon: <LifebuoyIcon className="h-5 w-5 mr-2" /> },
  ];

  const getNavLinkClass = (path: string, exact?: boolean) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    const baseClasses = "flex items-center justify-center sm:justify-start px-4 py-3 font-semibold text-sm sm:text-base rounded-lg transition-all duration-200";
    const activeClasses = "bg-primary text-on_primary shadow-md";
    const inactiveClasses = "text-text-secondary hover:bg-background";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-surface rounded-2xl shadow-lg p-4 mb-8">
            <nav className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                {navLinks.map(link => (
                    <NavLink key={link.to} to={link.to} className={() => getNavLinkClass(link.to, link.exact)}>
                        {link.icon}
                        <span className="hidden sm:inline">{link.text}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
        <main>
            <Outlet />
        </main>
      </div>
      <footer className="text-center py-6 text-sm text-text-secondary">
         <div className="flex justify-center items-center gap-2">
            <AriseLogoIcon className="h-8 w-8" />
            <span>© {new Date().getFullYear()} Arise Enterprises. All rights reserved.</span>
         </div>
      </footer>
    </div>
  );
};

export default ClientDashboardLayout;