
import React, { useState, useMemo } from 'react';
import useApi from '../hooks/useApi';
import ClientList from '../components/dashboard/ClientList';
import { Spinner } from '../components/shared/Spinner';
import { PlusIcon, DownloadIcon, AlertTriangleIcon } from '../components/shared/Icons';
import { useNavigate } from 'react-router-dom';
import { BookingStatus, Client } from '../types';

const ClientsPage: React.FC = () => {
  const { data: clientsData, loading, error, refetch } = useApi<{ message: string, data: Client[] }>('/clients');
  const clients = clientsData?.data || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();

  const filteredClients = useMemo(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      // Assuming location is a property on the client object
      // @ts-ignore
      filtered = filtered.filter(client => client.location === locationFilter);
    }

    return filtered;
  }, [clients, searchTerm, locationFilter]);

  const handleExport = () => {
    const clientsToExport = clients.filter(c => c.appointment?.bookingStatus === BookingStatus.DATA_PREPARED);
    if (clientsToExport.length === 0) {
      alert("No clients with status 'Data Prepared' to export.");
      return;
    }
    const headers = ["Full Name", "Passport Number", "Date of Birth", "Nationality", "Contact Number", "Email Address"];
    const csvContent = [
      headers.join(","),
      ...clientsToExport.map(c => [
        `"${c.firstName} ${c.lastName}"`,
        c.passportNumber,
        c.dateOfBirth,
        c.nationality,
        c.contactNumber,
        c.email
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "wafid_data_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Client Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all"
          >
            <DownloadIcon className="h-5 w-5" />
            Export for Wafid
          </button>
          <button
            onClick={() => navigate('/dashboard/add-client')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Client
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, passport, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <select
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="">All Locations</option>
            <option value="dubai">Dubai</option>
            <option value="abu_dhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
          </select>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Spinner />
            <p className="mt-4 text-gray-600">Loading Clients...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96 bg-red-50 text-red-700 rounded-lg">
            <AlertTriangleIcon className="h-12 w-12" />
            <p className="mt-4 text-lg font-semibold">Error loading clients</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ClientList
            clients={filteredClients}
            error={null}
            title=""
          />
        )}
      </div>
    </div>
  );
};

export default ClientsPage;