
import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../../types';
import { STATUS_COLORS } from '../../constants';
import { UserCircleIcon } from '../shared/Icons';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

interface ClientListProps {
    clients: Client[];
    error: string | null;
    title?: string;
    maxItems?: number;
}

const ClientList: React.FC<ClientListProps> = ({ clients, error, title, maxItems }) => {

  if (error) {
    return <div className="text-danger bg-red-100 p-4 rounded-lg">{error}</div>;
  }
  
  const displayedClients = maxItems ? clients.slice(0, maxItems) : clients;

  if (displayedClients.length === 0 && !error) {
    return (
        <div>
            {title && <h2 className="text-xl font-semibold text-text-primary mb-4">{title}</h2>}
            <div className="text-center text-text-secondary p-8">
                <h3 className="text-lg font-medium">No Clients Found</h3>
                <p className="text-sm">Your search returned no results, or no clients have been added yet.</p>
            </div>
        </div>
    );
  }

  return (
    <div>
        {title && <h2 className="text-xl font-semibold text-text-primary mb-4">{title}</h2>}
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-surface">
                <thead className="bg-background">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Passport No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Medical Center</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {displayedClients.map((client) => (
                        <tr key={client.id} className="hover:bg-background">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {client.profilePicture ? (
                                            <img className="h-10 w-10 rounded-full object-cover" src={client.profilePicture} alt={`${client.firstName} ${client.lastName}`} />
                                        ) : (
                                            <UserCircleIcon className="h-10 w-10 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-text-primary">{client.firstName} {client.lastName}</div>
                                        <div className="text-sm text-text-secondary">{client.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{client.passportNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{client.appointment?.medicalCenterName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {client.appointment ? <StatusBadge status={client.appointment.medicalResultStatus} /> : <StatusBadge status="N/A" />}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link to={`/dashboard/clients/${client.id}`} className="text-secondary hover:text-primary font-bold">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
            {displayedClients.map((client) => (
                <div key={client.id} className="bg-surface rounded-lg shadow p-4 border-l-4 border-secondary">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                                {client.profilePicture ? (
                                    <img className="h-12 w-12 rounded-full object-cover" src={client.profilePicture} alt="" />
                                ) : (
                                    <UserCircleIcon className="h-12 w-12 text-gray-300" />
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-md font-bold text-text-primary">{client.firstName} {client.lastName}</p>
                                <p className="text-sm text-text-secondary">{client.email}</p>
                            </div>
                        </div>
                        <Link to={`/dashboard/clients/${client.id}`} className="px-3 py-1 bg-secondary text-on_primary rounded-full text-xs font-bold">View</Link>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <div>
                             <p className="text-xs text-text-secondary">Passport:</p>
                             <p className="text-sm font-medium text-text-primary">{client.passportNumber}</p>
                        </div>
                        <div>
                            {client.appointment ? <StatusBadge status={client.appointment.medicalResultStatus} /> : <StatusBadge status="N/A" />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ClientList;
