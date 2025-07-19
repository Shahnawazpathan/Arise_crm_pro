import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration purposes
const mockClients = [
  { id: 'cli-001', name: 'Wafid Medical Services' },
  { id: 'cli-002', name: 'Global Tech Solutions' },
  { id: 'cli-003', name: 'Innovate Inc.' },
];

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Client Dashboard</h1>
      <p>This is the main dashboard for Arise Enterprises CRM.</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Client List</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mockClients.map(client => (
            <li key={client.id} style={{ background: '#333', margin: '0.5rem 0', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{client.name}</span>
              <Link to={`/client/${client.id}`} style={{ color: '#87CEEB', textDecoration: 'none', background: '#555', padding: '0.5rem 1rem', borderRadius: '5px' }}>
                View Details
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;