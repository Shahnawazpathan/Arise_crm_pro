
import React from 'react';
import { useAuth } from '../App';
import { useClients } from '../context/ClientContext';
import { DocumentTextIcon, DownloadIcon } from '../components/shared/Icons';
import { Spinner } from '../components/shared/Spinner';


const ClientDocumentsPage: React.FC = () => {
    const { user } = useAuth();
    const { getClientById, loading } = useClients();
    const clientData = user?.clientId ? getClientById(user.clientId) : null;

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    const hasMedicalSlip = clientData?.appointment?.medicalSlipUrl && clientData.appointment.medicalSlipUrl !== '#';

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
            <p className="text-lg text-gray-500 mb-6">Here you can find all documents related to your application.</p>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Available Files</h2>
                <div className="space-y-4">
                    {hasMedicalSlip ? (
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                                <DocumentTextIcon className="h-8 w-8 text-secondary mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800">Wafid Medical Slip</p>
                                    <p className="text-sm text-gray-500">Generated on: {new Date(clientData.appointment!.bookingDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                             <a 
                                href={clientData.appointment!.medicalSlipUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                Download
                            </a>
                        </div>
                    ) : (
                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                            <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">No Documents Available Yet</h3>
                            <p className="text-gray-500 mt-1">Your Wafid Medical Slip and other documents will appear here once they are generated.</p>
                        </div>
                    )}
                    {/* Add more documents here as needed */}
                </div>
            </div>
        </div>
    );
};

export default ClientDocumentsPage;