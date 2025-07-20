
import React, { useEffect, useState } from 'react';
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../shared/Icons';
import { fetchDashboardStats } from '../../services/api';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    statusFit: 0,
    statusUnfit: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats();
      if (data) {
        setStats(data);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Clients" value={stats.totalClients.toString()} icon={<UsersIcon className="h-8 w-8 text-white"/>} color="bg-blue-500" />
      <StatCard title="Status: Fit" value={stats.statusFit.toString()} icon={<CheckCircleIcon className="h-8 w-8 text-white"/>} color="bg-green-500" />
      <StatCard title="Status: Unfit" value={stats.statusUnfit.toString()} icon={<XCircleIcon className="h-8 w-8 text-white"/>} color="bg-red-500" />
      <StatCard title="Pending Appointments" value={stats.pendingAppointments.toString()} icon={<ClockIcon className="h-8 w-8 text-white"/>} color="bg-yellow-500" />
    </div>
  );
};

export default DashboardStats;
