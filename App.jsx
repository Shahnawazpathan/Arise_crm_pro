import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ThreeDLandingPage from './components/ThreeDLandingPage';
import Dashboard from './components/Dashboard';
import ClientDetail from './components/ClientDetail';

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#111', minHeight: '100vh' }}>
        <nav style={{ padding: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
          <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<ThreeDLandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client/:clientId" element={<ClientDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;