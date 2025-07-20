
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Client, Appointment, MedicalResultStatus, PaymentStatus, BookingStatus } from '../types';
import { fetchClients } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { useNotifications } from './NotificationContext';

interface ClientContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  addClient: (client: Omit<Client, 'id' | 'appointment'>) => void;
  updateClientAppointment: (clientId: string, appointmentDetails: Partial<Appointment>) => void;
  updateClientStatus: (clientId: string, updates: { bookingStatus?: BookingStatus; medicalResultStatus?: MedicalResultStatus }) => void;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | null>(null);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const clientData = await fetchClients();
        if (clientData.length === 0) {
          setError("Failed to fetch client data from the backend.");
        }
        setClients(clientData);
      } catch (err) {
        setError('An error occurred while fetching client data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsData();
  }, []);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'appointment'>) => {
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      appointment: {
        id: `appt-${uuidv4()}`,
        appointmentDate: '',
        medicalCenterName: '',
        paymentStatus: PaymentStatus.N_A,
        bookingStatus: BookingStatus.NOT_INITIATED,
        medicalResultStatus: MedicalResultStatus.N_A,
        bookingDate: new Date().toISOString(),
        history: [{
            status: BookingStatus.NOT_INITIATED,
            date: new Date().toISOString(),
            notes: 'New client profile created.'
        }]
      }
    };
    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);
    addNotification({ message: `New client "${newClient.firstName} ${newClient.lastName}" has been added.`, type: 'client' });
  }, [clients, addNotification]);

  const updateClientStatus = useCallback((clientId: string, updates: { bookingStatus?: BookingStatus; medicalResultStatus?: MedicalResultStatus }) => {
     setClients(prevClients => {
        const updatedClients = prevClients.map(client => {
            if (client.id === clientId && client.appointment) {
                const newAppointment = { ...client.appointment, ...updates };
                let historyNote = '';
                let statusChange: BookingStatus | MedicalResultStatus | undefined;

                if (updates.bookingStatus) {
                    historyNote = `Booking status updated to ${updates.bookingStatus}.`;
                    statusChange = updates.bookingStatus;
                    // Simulate Workflow Rule 1
                    if (updates.bookingStatus === BookingStatus.DATA_PREPARED) {
                        addNotification({ message: `Task created for Wafid Booking Team: Export data for ${client.firstName} ${client.lastName}.`, type: 'system' });
                    }
                }
                if (updates.medicalResultStatus) {
                    historyNote = `Medical result status updated to ${updates.medicalResultStatus}.`;
                    statusChange = updates.medicalResultStatus;
                     // Simulate Workflow Rule 3
                    if (updates.medicalResultStatus === MedicalResultStatus.FIT || updates.medicalResultStatus === MedicalResultStatus.UNFIT || updates.medicalResultStatus === MedicalResultStatus.REQUIRES_RE_EXAMINATION) {
                        addNotification({ message: `Wafid results for ${client.firstName} ${client.lastName} are now "${updates.medicalResultStatus}".`, type: 'status' });
                         if (updates.medicalResultStatus === MedicalResultStatus.UNFIT || updates.medicalResultStatus === MedicalResultStatus.REQUIRES_RE_EXAMINATION) {
                             addNotification({ message: `High-priority task for Case Management: Address Wafid result for ${client.firstName} ${client.lastName}.`, type: 'system' });
                         }
                    }
                }
                
                newAppointment.history = [
                    ...(client.appointment.history || []),
                    { status: statusChange!, date: new Date().toISOString(), notes: historyNote }
                ];
                return { ...client, appointment: newAppointment };
            }
            return client;
        });
        return updatedClients;
    });
  }, [addNotification]);


  const updateClientAppointment = useCallback((clientId: string, appointmentDetails: Partial<Appointment>) => {
    setClients(prevClients => {
        const updatedClients = prevClients.map(client => {
            if (client.id === clientId) {
                const existingAppointment = client.appointment;
                const newAppointment: Appointment = {
                    // Sane defaults for a completely new appointment object
                    id: `appt-${uuidv4()}`,
                    appointmentDate: new Date().toISOString(),
                    medicalCenterName: '',
                    paymentStatus: PaymentStatus.N_A,
                    bookingStatus: BookingStatus.NOT_INITIATED,
                    medicalResultStatus: MedicalResultStatus.N_A,
                    bookingDate: new Date().toISOString(),
                    history: [],
                    // Overwrite with existing data if it exists
                    ...existingAppointment,
                    // Overwrite with incoming new details
                    ...appointmentDetails,
                };

                const bookingConfirmed = appointmentDetails.bookingStatus === BookingStatus.BOOKED_CONFIRMED;

                // Only add history/notifications if the status *changes* to confirmed
                if (bookingConfirmed && existingAppointment?.bookingStatus !== BookingStatus.BOOKED_CONFIRMED) {
                    newAppointment.history = [
                        ...(newAppointment.history || []),
                        { status: BookingStatus.BOOKED_CONFIRMED, date: new Date().toISOString(), notes: 'Appointment booked via modal.' }
                    ];
                    // Simulate Workflow Rule 2
                    addNotification({ message: `Email confirmation simulated for ${client.firstName} ${client.lastName}.`, type: 'client' });
                    addNotification({ message: `Internal alert: Wafid appointment booked for ${client.firstName} on ${new Date(newAppointment.appointmentDate).toLocaleDateString()}.`, type: 'system' });
                }

                return { ...client, appointment: newAppointment };
            }
            return client;
        });
        return updatedClients;
    });
    
  }, [addNotification]);

  const getClientById = useCallback((id: string) => {
    return clients.find(client => client.id === id);
  }, [clients]);

  const value = { clients, loading, error, addClient, updateClientAppointment, updateClientStatus, getClientById };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
