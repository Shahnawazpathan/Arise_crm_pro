
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircleIcon, UsersIcon, SettingsIcon } from './Icons';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead } = useNotifications();
  
  const getIcon = (type: string) => {
    switch(type) {
        case 'status': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        case 'client': return <UsersIcon className="h-5 w-5 text-blue-500" />;
        case 'system': return <SettingsIcon className="h-5 w-5 text-gray-500" />;
        default: return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  }

  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  if (!isOpen) return null;

  return (
    <div 
        className="absolute right-0 mt-4 w-80 sm:w-96 bg-surface rounded-lg shadow-xl z-30 border"
        onMouseLeave={onClose}
    >
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
                notifications.slice(0, 5).map(notification => (
                    <div 
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 transition-colors relative hover:bg-background ${!notification.read ? 'bg-background' : ''}`}
                    >
                        {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-grow">
                            <p className="text-sm text-text-primary">{notification.message}</p>
                            <p className="text-xs text-text-secondary mt-1">{timeSince(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                            <button onClick={() => markAsRead(notification.id)} className="flex-shrink-0 p-1 group" title="Mark as read">
                                <span className="h-2 w-2 rounded-full bg-secondary block group-hover:bg-accent transition-colors"></span>
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-text-secondary p-8">No new notifications.</p>
            )}
        </div>
        <div className="p-2 border-t text-center bg-gray-50 rounded-b-lg">
            <Link to="/dashboard/notifications" onClick={onClose} className="text-sm font-medium text-secondary hover:text-primary">View All Notifications</Link>
        </div>
    </div>
  );
};

export default NotificationPopover;
