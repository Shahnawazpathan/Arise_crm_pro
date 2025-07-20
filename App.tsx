
import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/shared/DashboardLayout';
import ClientDashboardLayout from './components/client/ClientDashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import AddClientPage from './pages/AddClientPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import NotificationsPage from './pages/NotificationsPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ClientDocumentsPage from './pages/ClientDocumentsPage';
import ClientHistoryPage from './pages/ClientHistoryPage';
import ClientSupportPage from './pages/ClientSupportPage';
import { ClientProvider } from './context/ClientContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import authService from './services/authService';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser()?.user);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    login,
    logout
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: User['role'][] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
      const homePath = user.role === 'employee' ? '/dashboard' : '/client-dashboard';
      return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { ToastComponent } = useToast();

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <ToastComponent />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Employee Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <NotificationProvider>
                  <ClientProvider>
                    <DashboardLayout />
                  </ClientProvider>
                </NotificationProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailsPage />} />
            <Route path="add-client" element={<AddClientPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Client Routes */}
           <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                 <NotificationProvider>
                   <ClientProvider>
                      <ClientDashboardLayout />
                   </ClientProvider>
                 </NotificationProvider>
              </ProtectedRoute>
            }
          >
             <Route index element={<ClientDashboardPage />} />
             <Route path="documents" element={<ClientDocumentsPage />} />
             <Route path="history" element={<ClientHistoryPage />} />
             <Route path="support" element={<ClientSupportPage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;