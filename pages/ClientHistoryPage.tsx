
import React from 'react';
import { useAuth } from '../App';
import { useClients } from '../context/ClientContext';
import { Spinner } from '../components/shared/Spinner';
import { STATUS_COLORS } from '../constants';
import { CheckCircleIcon, ClockRewindIcon } from '../components/shared/Icons';

const ClientHistoryPage: React.FC = () => {
    const { user } = useAuth();
    const { getClientById, loading } = useClients();
    const clientData = user?.clientId ? getClientById(user.clientId) : null;
    const history = clientData?.appointment?.history?.slice().reverse() || [];

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${colorClass}`}>
            {status}
            </span>
        );
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Application History</h1>
            <p className="text-lg text-text-secondary mb-6">Track the progress of your application from start to finish.</p>

            <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flow-root">
                {history.length > 0 ? (
                    <ul className="-mb-8">
                        {history.map((item, itemIdx) => (
                        <li key={item.date}>
                            <div className="relative pb-8">
                            {itemIdx !== history.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-surface">
                                    <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                    <p className="text-sm text-text-secondary">
                                        Status changed to <StatusBadge status={item.status} />
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-text-secondary">
                                    <time dateTime={item.date}>{new Date(item.date).toLocaleDateString()}</time>
                                </div>
                                </div>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <ClockRewindIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No History to Display</h3>
                        <p className="text-text-secondary mt-1">Your application history will be tracked here as soon as the process begins.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default ClientHistoryPage;