
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LogoutIcon, BellIcon, MenuIcon, XIcon } from './Icons';
import NotificationPopover from './NotificationPopover';
import { useNotifications } from '../../context/NotificationContext';

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    // If there are unread notifications, trigger animation on change
    if (unreadCount > 0) {
        setAnimateBell(true);
        const timer = setTimeout(() => setAnimateBell(false), 1000); // Animation duration
        return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const userName = user?.role === 'employee' ? "Mohd. Ibraheem" : user?.username;

  return (
    <header className="bg-surface shadow p-4 flex justify-between items-center z-20">
      <div className="flex items-center">
        {toggleSidebar && (
           <button onClick={toggleSidebar} className="text-text-secondary mr-4 lg:hidden">
              {isSidebarOpen ? <XIcon className="h-6 w-6"/> : <MenuIcon className="h-6 w-6"/>}
           </button>
        )}
        <h1 className="text-lg md:text-xl font-bold text-text-primary">Welcome, {userName?.split(' ')[0]}!</h1>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
         <div className="relative">
            <button onClick={() => setNotificationPopoverOpen(prev => !prev)} className={`relative text-text-secondary hover:text-primary transition-transform duration-500 ${animateBell ? 'animate-shake' : ''}`}>
                <BellIcon className="h-6 w-6"/>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-danger text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
            </button>
            <NotificationPopover isOpen={notificationPopoverOpen} onClose={() => setNotificationPopoverOpen(false)} />
         </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-text-secondary hover:text-primary focus:outline-none">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-on_primary font-semibold">
                {userName?.charAt(0)}
            </div>
            <span className="hidden md:block font-medium text-text-primary">{userName}</span>
          </button>
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-xl z-30 overflow-hidden"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <a href="#/dashboard/settings" className="block px-4 py-2 text-sm text-text-primary hover:bg-background">My Profile</a>
              <a href="#/dashboard/settings" className="block px-4 py-2 text-sm text-text-primary hover:bg-background">Settings</a>
              <div className="border-t border-background"></div>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-background">
                <LogoutIcon className="h-5 w-5"/>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
       <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </header>
  );
};

export default Header;
