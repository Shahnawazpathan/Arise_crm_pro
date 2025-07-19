
import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import ClientList from '../components/dashboard/ClientList';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import { useClients } from '../context/ClientContext';
import { Spinner } from '../components/shared/Spinner';

const DashboardPage: React.FC = () => {
  const { clients, loading, error } = useClients();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AppointmentsChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;