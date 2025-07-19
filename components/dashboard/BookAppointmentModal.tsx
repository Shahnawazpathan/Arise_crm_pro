
import React, { useState, useEffect } from 'react';
import { Client, PaymentStatus, BookingStatus, Appointment } from '../../types';
import { useClients } from '../../context/ClientContext';
import { useToast } from '../../context/ToastContext';
import { XIcon, CalendarIcon, ClockIcon } from '../shared/Icons';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onSuccess: () => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ isOpen, onClose, client, onSuccess }) => {
  const { updateClientAppointment } = useClients();
  const { showToast } = useToast();
  
  const initialDate = client.appointment?.appointmentDate;
  const [appointmentDetails, setAppointmentDetails] = useState({
    wafidApplicationId: client.appointment?.wafidApplicationId || '',
    medicalCenterName: client.appointment?.medicalCenterName || 'Riyadh Medical Center',
    appointmentDate: initialDate && !isNaN(new Date(initialDate).getTime()) ? new Date(initialDate).toISOString().split('T')[0] : '',
    appointmentTime: client.appointment?.appointmentTime || '',
    paymentStatus: client.appointment?.paymentStatus || PaymentStatus.PENDING_PAYMENT,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // When the modal is opened, sync the form state with the client prop
    if (isOpen && client.appointment) {
      const dateStr = client.appointment.appointmentDate;
      setAppointmentDetails({
        wafidApplicationId: client.appointment.wafidApplicationId || '',
        medicalCenterName: client.appointment.medicalCenterName || 'Riyadh Medical Center',
        appointmentDate: dateStr && !isNaN(new Date(dateStr).getTime()) ? new Date(dateStr).toISOString().split('T')[0] : '',
        appointmentTime: client.appointment.appointmentTime || '',
        paymentStatus: client.appointment.paymentStatus || PaymentStatus.PENDING_PAYMENT,
      });
    }
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData: Partial<Appointment> = {
        ...appointmentDetails,
        appointmentDate: new Date(appointmentDetails.appointmentDate).toISOString(),
        bookingStatus: BookingStatus.BOOKED_CONFIRMED,
    }

    updateClientAppointment(client.id, submissionData);

    showToast('Appointment booked successfully!', 'success');
    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Book Wafid Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">{client.firstName} {client.lastName}</p>
              <p className="text-sm text-gray-500">{client.passportNumber}</p>
            </div>

            <div>
              <label htmlFor="wafidApplicationId" className="block text-sm font-medium text-gray-700 mb-1">
                Wafid Application ID
              </label>
              <input type="text" id="wafidApplicationId" name="wafidApplicationId" value={appointmentDetails.wafidApplicationId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary" />
            </div>
            
            <div>
              <label htmlFor="medicalCenterName" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Center
              </label>
              <input type="text" id="medicalCenterName" name="medicalCenterName" value={appointmentDetails.medicalCenterName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <div className="relative">
                  <input type="date" id="appointmentDate" name="appointmentDate" value={appointmentDetails.appointmentDate} onChange={handleChange} required className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary" />
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                <div className="relative">
                  <input type="time" id="appointmentTime" name="appointmentTime" value={appointmentDetails.appointmentTime} onChange={handleChange} required className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary" />
                  <ClockIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select id="paymentStatus" name="paymentStatus" value={appointmentDetails.paymentStatus} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary">
                {Object.values(PaymentStatus).filter(v => !["Pending", "Failed"].includes(v)).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
