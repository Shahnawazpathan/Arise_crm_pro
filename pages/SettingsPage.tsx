import React, { useState } from 'react';
import { useAuth } from '../App';
import { useToast } from '../context/ToastContext';
import { UserIcon, LockClosedIcon, BellIcon } from '../components/shared/Icons';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    fullName: user?.username || '',
    currentPassword: '',
    newPassword: '',
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // In a real app, you'd send this to a server.
    // For now, we'll just show a toast notification.
    console.log('Saving settings:', settings);
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-text-primary mb-6">Settings</h1>
      
      <div className="bg-surface p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-8">

        {/* Profile Settings */}
        <div className="border-b pb-8">
            <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 mr-3 text-secondary"/>
                <h2 className="text-xl font-bold text-text-primary">Profile Information</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Full Name</label>
                    <input type="text" name="fullName" value={settings.fullName} onChange={handleChange} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">Email Address</label>
                    <input type="email" value={user?.email} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" readOnly/>
                </div>
            </div>
        </div>

        {/* Security Settings */}
        <div className="border-b pb-8">
            <div className="flex items-center mb-4">
                <LockClosedIcon className="h-6 w-6 mr-3 text-secondary"/>
                <h2 className="text-xl font-bold text-text-primary">Security</h2>
            </div>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Current Password</label>
                    <input type="password" name="currentPassword" value={settings.currentPassword} onChange={handleChange} placeholder="••••••••" className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary">New Password</label>
                    <input type="password" name="newPassword" value={settings.newPassword} onChange={handleChange} placeholder="••••••••" className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"/>
                </div>
            </div>
        </div>
        
        {/* Notification Settings */}
        <div>
            <div className="flex items-center mb-4">
                <BellIcon className="h-6 w-6 mr-3 text-secondary"/>
                <h2 className="text-xl font-bold text-text-primary">Notifications</h2>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-text-secondary">Email notifications for status changes</p>
                    <label className="switch">
                        <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                 <div className="flex items-center justify-between">
                    <p className="text-text-secondary">SMS notifications for appointments</p>
                    <label className="switch">
                        <input type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange}/>
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
        
        <div className="flex justify-end pt-6">
            <button onClick={handleSave} className="px-6 py-2 bg-primary text-on_primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all">
                Save Changes
            </button>
        </div>

      </div>
      <style>{`
        .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #118AB2; }
        input:focus + .slider { box-shadow: 0 0 1px #118AB2; }
        input:checked + .slider:before { transform: translateX(22px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
    </div>
  );
};

export default SettingsPage;