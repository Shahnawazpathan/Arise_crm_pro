
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../context/ClientContext';
import { useToast } from '../context/ToastContext';
import { Client } from '../types';
import { FileUploadIcon, UserCircleIcon } from '../components/shared/Icons';

const AddClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    passportNumber: '',
    nationality: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
  });
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfilePicture(reader.result as string);
          }
          reader.readAsDataURL(file);
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (Object.values(formData).some(value => value === '')) {
        showToast('Please fill out all fields.', 'error');
        setIsSubmitting(false);
        return;
    }

    const clientData = { ...formData, profilePicture };
    addClient(clientData as Omit<Client, 'id' | 'appointment'>);

    showToast('Client added successfully!', 'success');
    setTimeout(() => {
        setIsSubmitting(false);
        navigate('/dashboard/clients');
    }, 500);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Client</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex-shrink-0">
                {profilePicture ? (
                    <img src={profilePicture} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="h-24 w-24 text-gray-300" />
                )}
             </div>
             <div className="flex-grow">
                 <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                    Client Photo
                </label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <FileUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              {Object.keys(formData).map((key) => {
                const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const fieldType = key === 'dateOfBirth' ? 'date' : key === 'email' ? 'email' : 'text';

                return (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldName}
                    </label>
                    <input
                      type={fieldType}
                      id={key}
                      name={key}
                      value={formData[key as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                );
              })}
          </div>
          
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/clients')}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientPage;