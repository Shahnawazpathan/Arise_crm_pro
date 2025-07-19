
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardStats from '../components/dashboard/DashboardStats';
import ClientList from '../components/dashboard/ClientList';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import { useClients } from '../context/ClientContext';
import { Spinner } from '../components/shared/Spinner';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPage: React.FC = () => {
  const { clients, loading, error } = useClients();

  const layout = [
    { i: 'stats', x: 0, y: 0, w: 12, h: 1 },
    { i: 'clients', x: 0, y: 1, w: 8, h: 4 },
    { i: 'chart', x: 8, y: 1, w: 4, h: 4 },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        <div key="stats" className="bg-white p-6 rounded-lg shadow-md">
          <DashboardStats />
        </div>
        <div key="clients" className="bg-white p-6 rounded-lg shadow-md">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-96">
                <Spinner />
                <p className="mt-4 text-gray-600">Loading Client Data...</p>
            </div>
           ) : (
             <ClientList 
                clients={clients}
                error={error}
                title="Recent Clients"
                maxItems={5}
             />
           )}
        </div>
        <div key="chart" className="bg-white p-6 rounded-lg shadow-md">
          <AppointmentsChart />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardPage;