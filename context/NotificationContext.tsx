
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { fetchNotifications, addNotification as apiAddNotification, NotificationInput } from '../services/api';

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

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    loadNotifications();
  }, []);

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
  
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationInput = {
      message: notification.message,
      type: notification.type,
    };
    const result = await apiAddNotification(newNotification);
    if (result) {
      setNotifications(prev => [
        {
          id: result.id,
          message: newNotification.message,
          type: newNotification.type,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    }
  }, []);

  const value = { notifications, markAsRead, markAllAsRead, addNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
