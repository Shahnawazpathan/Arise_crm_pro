
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useClients } from '../context/ClientContext';
import { Client, MedicalResultStatus } from '../types';
import { Spinner } from '../components/shared/Spinner';
import { STATUS_COLORS } from '../constants';
import { UserCircleIcon, CalendarIcon, MapPinIcon, CheckCircleIcon, DocumentTextIcon, ClockRewindIcon, LifebuoyIcon, PassportIcon } from '../components/shared/Icons';

const OverviewCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string; }> = ({ icon, title, description, link }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(link)} className="bg-gray-50 hover:bg-gray-100 p-6 rounded-xl flex items-start gap-4 cursor-pointer transition-all duration-300">
            <div className="bg-secondary text-white p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
};

const ClientDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { getClientById, loading } = useClients();
    const [clientData, setClientData] = useState<Client | null>(null);

    useEffect(() => {
        if (user && user.clientId) {
            const data = getClientById(user.clientId);
            if (data) {
                setClientData(data);
            }
        }
    }, [user, getClientById]);

    if (loading && !clientData) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!clientData) {
        return <div className="text-center text-gray-500 p-8">Could not load client data. Please contact support.</div>;
    }

    const { appointment } = clientData;

    const displayStatus = (appointment?.medicalResultStatus && appointment.medicalResultStatus !== MedicalResultStatus.N_A)
        ? appointment.medicalResultStatus
        : appointment?.bookingStatus ?? 'Not Initiated';
    
    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`px-4 py-2 text-lg font-bold leading-5 rounded-full ${colorClass}`}>
            {status}
            </span>
        );
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {clientData.firstName}!</h1>
            <p className="text-lg text-gray-500 mb-6">This is your personal portal. Here's a summary of your application.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Status Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wafid Medical Appointment</h2>
                        <p className="text-gray-500 mb-6">Here's the current status of your medical examination process.</p>
                        
                        {appointment ? (
                            <div className="space-y-6">
                                <div className="text-center p-6 bg-gray-50 rounded-lg">
                                    <p className="text-md font-medium text-gray-600 mb-2">Current Status</p>
                                    <StatusBadge status={displayStatus} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-center"><CalendarIcon className="h-8 w-8 text-secondary mr-4"/><div><p className="text-sm text-gray-500">Appointment Date</p><p className="font-semibold text-gray-800">{appointment.appointmentDate && !isNaN(new Date(appointment.appointmentDate).getTime()) ? new Date(appointment.appointmentDate).toLocaleString() : 'Not Scheduled'}</p></div></div>
                                    <div className="flex items-center"><MapPinIcon className="h-8 w-8 text-secondary mr-4"/><div><p className="text-sm text-gray-500">Medical Center</p><p className="font-semibold text-gray-800">{appointment.medicalCenterName}</p></div></div>
                                    <div className="flex items-center"><CheckCircleIcon className="h-8 w-8 text-green-500 mr-4"/><div><p className="text-sm text-gray-500">Payment</p><p className="font-semibold text-gray-800">{appointment.paymentStatus}</p></div></div>
                                    <div className="flex items-center"><PassportIcon className="h-8 w-8 text-secondary mr-4"/><div><p className="text-sm text-gray-500">Passport No.</p><p className="font-semibold text-gray-800">{clientData.passportNumber}</p></div></div>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center p-8 bg-gray-50 rounded-lg"><p className="font-semibold text-gray-700 text-lg">Your application is being processed.</p><p className="text-sm text-gray-500 mt-2">An appointment has not been booked yet. Please check back later.</p></div>
                        )}
                    </div>
                     {/* Quick Actions */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Portal Sections</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <OverviewCard icon={<DocumentTextIcon className="h-6 w-6"/>} title="My Documents" description="Access your medical slip and other files." link="/client-dashboard/documents" />
                            <OverviewCard icon={<ClockRewindIcon className="h-6 w-6"/>} title="Application History" description="View the timeline of your status updates." link="/client-dashboard/history" />
                            <OverviewCard icon={<LifebuoyIcon className="h-6 w-6"/>} title="Support" description="Find contact info and get help." link="/client-dashboard/support" />
                         </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg self-start">
                     <div className="flex flex-col items-center text-center">
                        {clientData.profilePicture ? (
                            <img src={clientData.profilePicture} alt="Profile" className="h-28 w-28 rounded-full object-cover shadow-md mb-4 border-4 border-white" />
                        ) : (
                            <UserCircleIcon className="h-28 w-28 text-gray-300 mb-4" />
                        )}
                        <p className="text-xl font-bold text-gray-900">{clientData.firstName} {clientData.lastName}</p>
                        <p className="text-gray-500">{clientData.email}</p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;