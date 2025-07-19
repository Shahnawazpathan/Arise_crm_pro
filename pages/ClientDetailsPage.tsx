
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import { useNotifications } from '../context/NotificationContext';
import { Client, BookingStatus, MedicalResultStatus } from '../types';
import { Spinner } from '../components/shared/Spinner';
import { UserCircleIcon, PassportIcon, CalendarIcon, PhoneIcon, MailIcon, BriefcaseIcon, MapPinIcon, ClockIcon } from '../components/shared/Icons';
import BookAppointmentModal from '../components/dashboard/BookAppointmentModal';
import EmailPreviewModal from '../components/dashboard/EmailPreviewModal';
import { MEDICAL_RESULT_STATUS_COLORS, BOOKING_STATUS_COLORS } from '../constants';

const InfoCard: React.FC<{ icon: React.ReactNode, label: string, value?: string | null }> = ({ icon, label, value }) => (
    <div className="flex items-start text-sm">
        <div className="text-gray-500 mr-3 mt-1">{icon}</div>
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-gray-600">{value || 'N/A'}</p>
        </div>
    </div>
);

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, loading, error, updateClientStatus } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      setClient(foundClient || null);
    }
  }, [id, getClientById, client]);
  
  const handleStatusChange = (type: 'booking' | 'medical', value: string) => {
      if(!id) return;
      if (type === 'booking') {
          updateClientStatus(id, { bookingStatus: value as BookingStatus });
      } else {
          updateClientStatus(id, { medicalResultStatus: value as MedicalResultStatus });
      }
      // The component will re-render due to context update, and useEffect will fetch the latest client data.
  }

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  if (!client) return <div className="text-center text-gray-500 p-8">Client not found.</div>;
  
  const appointment = client.appointment;

  return (
    <div className="container mx-auto">
       <BookAppointmentModal 
            isOpen={isBookingModalOpen} 
            onClose={() => setIsBookingModalOpen(false)} 
            client={client}
            onSuccess={() => {
                // The client data will be updated reactively by the useEffect hook
                // in response to the context change. No manual refetch needed here.
            }}
       />
       {appointment && <EmailPreviewModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} client={client}/>}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center">
                <img src={client.profilePicture || `https://i.pravatar.cc/150?u=${client.id}`} alt="Profile" className="h-24 w-24 rounded-full object-cover shadow-md" />
                <div className="ml-6">
                    <h1 className="text-3xl font-bold text-gray-900">{client.firstName} {client.lastName}</h1>
                    <p className="text-md text-gray-500">{client.email}</p>
                </div>
            </div>
             <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                {appointment?.bookingStatus === BookingStatus.BOOKED_CONFIRMED && (
                  <button onClick={() => setIsEmailModalOpen(true)} className="px-4 py-2 bg-secondary text-on_primary font-semibold rounded-lg shadow-sm hover:bg-opacity-90 transition-all">
                    Preview Confirmation Email
                  </button>
                )}
                <button onClick={() => setIsBookingModalOpen(true)} className="px-4 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all">
                    {appointment?.appointmentDate ? 'Update Appointment' : 'Book Appointment'}
                </button>
            </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                    <div className="space-y-4">
                        <InfoCard icon={<PassportIcon className="h-6 w-6"/>} label="Passport Number" value={client.passportNumber} />
                        <InfoCard icon={<BriefcaseIcon className="h-6 w-6"/>} label="Nationality" value={client.nationality} />
                        <InfoCard icon={<CalendarIcon className="h-6 w-6"/>} label="Date of Birth" value={client.dateOfBirth} />
                        <InfoCard icon={<PhoneIcon className="h-6 w-6"/>} label="Contact Number" value={client.contactNumber} />
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
                     <div className="space-y-4">
                        <InfoCard icon={<PassportIcon className="h-6 w-6"/>} label="Wafid Application ID" value={appointment?.wafidApplicationId} />
                        <InfoCard icon={<CalendarIcon className="h-6 w-6"/>} label="Appointment Date" value={appointment?.appointmentDate && !isNaN(new Date(appointment.appointmentDate).getTime()) ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'} />
                        <InfoCard icon={<ClockIcon className="h-6 w-6"/>} label="Appointment Time" value={appointment?.appointmentTime} />
                        <InfoCard icon={<MapPinIcon className="h-6 w-6"/>} label="Medical Center" value={appointment?.medicalCenterName} />
                        <InfoCard icon={<MailIcon className="h-6 w-6"/>} label="Payment Status" value={appointment?.paymentStatus} />
                    </div>
                </div>
            </div>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                 <h2 className="text-xl font-semibold text-gray-800">Workflow Status</h2>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Booking Status</label>
                    <select
                        value={appointment?.bookingStatus || BookingStatus.NOT_INITIATED}
                        onChange={(e) => handleStatusChange('booking', e.target.value)}
                        className={`w-full p-2 border rounded-md font-semibold ${BOOKING_STATUS_COLORS[appointment?.bookingStatus || BookingStatus.NOT_INITIATED]}`}
                    >
                        {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Medical Result Status</label>
                    <select
                        value={appointment?.medicalResultStatus || MedicalResultStatus.N_A}
                        onChange={(e) => handleStatusChange('medical', e.target.value)}
                        className={`w-full p-2 border rounded-md font-semibold ${MEDICAL_RESULT_STATUS_COLORS[appointment?.medicalResultStatus || MedicalResultStatus.N_A]}`}
                    >
                        {Object.values(MedicalResultStatus).filter(s => ![MedicalResultStatus.APPOINTMENT_BOOKED, MedicalResultStatus.PENDING_INFO, MedicalResultStatus.RESULTS_AWAITING, MedicalResultStatus.MEDICAL_DONE].includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-right">
             <button onClick={() => navigate('/dashboard/clients')} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all">
              Back to Client List
            </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
