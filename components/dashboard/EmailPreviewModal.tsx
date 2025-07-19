
import React from 'react';
import { Client } from '../../types';
import { XIcon, MailIcon, AriseLogoIcon } from '../shared/Icons';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client.appointment) return null;
  const { appointment } = client;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-4 bg-surface border-b">
          <div className="flex items-center gap-2 text-gray-600">
            <MailIcon className="h-5 w-5"/>
            <h2 className="text-lg font-bold">Email Preview</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
            <div className="bg-white p-8 rounded-md shadow-inner border">
                {/* Email Header */}
                <div className="flex items-center justify-between pb-4 border-b mb-6">
                    <div className="flex items-center gap-3">
                        <AriseLogoIcon className="h-10 w-10 text-primary" />
                        <span className="text-xl font-bold text-primary">Arise Enterprises</span>
                    </div>
                     <span className="text-sm text-gray-500">Appointment Confirmation</span>
                </div>
                
                {/* Email Body */}
                <p className="text-gray-700 mb-4">
                    Dear {client.firstName} {client.lastName},
                </p>
                <p className="text-gray-700 mb-6">
                    This email is to confirm that your Wafid.com medical appointment has been successfully booked. Please find the details below.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Appointment Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-gray-600">Applicant:</strong><br/>{client.firstName} {client.lastName}</div>
                        <div><strong className="text-gray-600">Wafid ID:</strong><br/>{appointment.wafidApplicationId}</div>
                        <div><strong className="text-gray-600">Date:</strong><br/>{new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}</div>
                        <div><strong className="text-gray-600">Time:</strong><br/>{appointment.appointmentTime}</div>
                        <div className="col-span-2"><strong className="text-gray-600">Medical Center:</strong><br/>{appointment.medicalCenterName}</div>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-gray-800 mb-2">Important Instructions:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Please arrive at the medical center 15 minutes prior to your appointment time.</li>
                        <li>Carry a printout of this confirmation and your original passport.</li>
                        <li>Follow all instructions provided by the medical center staff.</li>
                    </ul>
                </div>

                {/* Email Footer */}
                <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
                    Thank you for choosing Arise Enterprises.<br/>
                    <a href="mailto:arise.enterprises100@gmail.com" className="text-secondary">arise.enterprises100@gmail.com</a>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 p-4 bg-surface border-t">
          <button onClick={onClose} className="px-6 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-sm hover:bg-opacity-90 transition-all">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;
