
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface Notification {
  id: number;
  message: string;
  type: 'status' | 'client' | 'system';
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const initialNotifications: Notification[] = [
    { id: 1, message: 'Client Farhan Ahmed status changed to "Appointment Booked".', type: 'status', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 2, message: 'New client "Aisha Khan" has been added.', type: 'client', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), read: false },
    { id: 3, message: 'System maintenance scheduled for tomorrow at 2 AM.', type: 'system', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), read: true },
    { id: 4, message: 'Client John Doe status changed to "Fit".', type: 'status', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), read: true },
    { id: 5, message: 'Your report for "June 2024" is ready for download.', type: 'system', timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), read: false },
    { id: 6, message: 'Client "Maria Garcia" has been successfully onboarded.', type: 'client', timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), read: true },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
    );
  }, []);
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const value = { notifications, markAsRead, markAllAsRead, addNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
