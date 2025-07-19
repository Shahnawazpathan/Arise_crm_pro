
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useClients } from '../context/ClientContext';
import { Spinner } from '../components/shared/Spinner';
import { MedicalResultStatus } from '../types';

const COLORS = ['#073B4C', '#118AB2', '#06D6A0', '#FFD166', '#EF476F', '#7b2cbf'];

const ReportsPage: React.FC = () => {
  const { clients, loading, error } = useClients();

  const nationalityData = useMemo(() => {
    if (!clients.length) return [];
    const counts = clients.reduce((acc, client) => {
      acc[client.nationality] = (acc[client.nationality] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [clients]);
  
  const statusData = useMemo(() => {
    if(!clients.length) return [];
    
    const statusCounts = clients.reduce((acc, client) => {
        const status = client.appointment?.medicalResultStatus || MedicalResultStatus.N_A;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<MedicalResultStatus, number>);

    return Object.entries(statusCounts)
        .map(([name, count]) => ({name, count}))
        .filter(item => item.count > 0);

  }, [clients]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }
  
  if (error) {
    return <div className="text-danger bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-text-primary mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Nationality Distribution */}
        <div className="bg-surface p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Clients by Nationality</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={nationalityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return ( (percent as number) > 0.05 ?
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                        </text> : null
                    );
                }}>
                  {nationalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperClassName="!bg-surface !border-gray-200 !rounded-md !shadow-lg" />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <div className="bg-surface p-6 rounded-lg shadow-md lg:col-span-3">
           <h2 className="text-xl font-semibold text-text-primary mb-4">Appointment Status Breakdown</h2>
           <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }}/>
                        <Tooltip wrapperClassName="!bg-surface !border-gray-200 !rounded-md !shadow-lg" />
                        <Bar dataKey="count" name="Total" fill="#118AB2" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
