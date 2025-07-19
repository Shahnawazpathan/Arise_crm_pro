
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from '../components/shared/Icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  ToastComponent: React.FC;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
     setTimeout(() => {
      setToast(null);
    }, 3500); // Allow time for fade-out
  }, []);

  const ToastComponent = () => {
    if (!toast) return null;

    const ICONS = {
      success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      error: <XCircleIcon className="h-6 w-6 text-red-500" />,
      info: <InfoIcon className="h-6 w-6 text-blue-500" />,
    };

    const BG_COLORS = {
        success: 'bg-green-100 border-green-400',
        error: 'bg-red-100 border-red-400',
        info: 'bg-blue-100 border-blue-400',
    }

    const TEXT_COLORS = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
    }

    return (
      <div 
        className={`fixed top-5 right-5 z-[100] transition-all duration-300 ease-in-out transform ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        >
        <div className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${BG_COLORS[toast.type]}`}>
            <div className="flex-shrink-0">
                {ICONS[toast.type]}
            </div>
            <div className={`ml-3 text-sm font-medium ${TEXT_COLORS[toast.type]}`}>
               {toast.message}
            </div>
        </div>
      </div>
    );
  };
  
  const value = { showToast, ToastComponent };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
