
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', appointments: 400, fit: 240, unfit: 20 },
  { name: 'Feb', appointments: 300, fit: 139, unfit: 30 },
  { name: 'Mar', appointments: 500, fit: 480, unfit: 15 },
  { name: 'Apr', appointments: 478, fit: 390, unfit: 25 },
  { name: 'May', appointments: 589, fit: 480, unfit: 40 },
  { name: 'Jun', appointments: 439, fit: 380, unfit: 18 },
];

const AppointmentsChart: React.FC = () => {
  return (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Trends</h2>
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip wrapperClassName="!bg-white !border-gray-200 !rounded-md !shadow-lg" />
                    <Legend />
                    <Bar dataKey="appointments" fill="#8884d8" name="Total Appointments"/>
                    <Bar dataKey="fit" fill="#82ca9d" name="Fit"/>
                    <Bar dataKey="unfit" fill="#d88484" name="Unfit"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default AppointmentsChart;
