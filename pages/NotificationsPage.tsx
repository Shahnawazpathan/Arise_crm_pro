
import React, { useState, useMemo } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { BellIcon, CheckCircleIcon, UsersIcon, SettingsIcon, FilterIcon, CheckDoubleIcon } from '../components/shared/Icons';

type FilterType = 'all' | 'status' | 'client' | 'system';
type ReadStatus = 'all' | 'unread';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [readStatus, setReadStatus] = useState<ReadStatus>('all');

  const getIcon = (type: string) => {
    switch(type) {
        case 'status': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
        case 'client': return <UsersIcon className="h-6 w-6 text-blue-500" />;
        case 'system': return <SettingsIcon className="h-6 w-6 text-gray-500" />;
        default: return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => filterType === 'all' || n.type === filterType)
      .filter(n => readStatus === 'all' || !n.read);
  }, [notifications, filterType, readStatus]);

  const FilterButton: React.FC<{
    label: string;
    value: FilterType | ReadStatus;
    currentFilter: FilterType | ReadStatus;
    setFilter: (value: any) => void;
  }> = ({ label, value, currentFilter, setFilter }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
        currentFilter === value
          ? 'bg-primary text-on_primary'
          : 'bg-background text-text-secondary hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-semibold text-text-primary">Notifications</h1>
        <button onClick={markAllAsRead} className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 bg-secondary text-on_primary font-semibold rounded-lg shadow-sm hover:bg-opacity-90 transition-all">
          <CheckDoubleIcon className="h-5 w-5" />
          Mark all as read
        </button>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        {/* Filter Controls */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <FilterIcon className="h-5 w-5 text-text-secondary" />
            <h3 className="font-bold text-text-primary">Filter by</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="All Types" value="all" currentFilter={filterType} setFilter={setFilterType} />
            <FilterButton label="Status" value="status" currentFilter={filterType} setFilter={setFilterType} />
            <FilterButton label="Client" value="client" currentFilter={filterType} setFilter={setFilterType} />
            <FilterButton label="System" value="system" currentFilter={filterType} setFilter={setFilterType} />
            <div className="w-px bg-gray-300 mx-2"></div>
            <FilterButton label="All" value="all" currentFilter={readStatus} setFilter={setReadStatus} />
            <FilterButton label="Unread" value="unread" currentFilter={readStatus} setFilter={setReadStatus} />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg relative transition-colors ${
                  !notification.read ? 'bg-background' : ''
                }`}
              >
                {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent rounded-l-lg"></div>}
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-grow">
                  <p className="text-text-primary">{notification.message}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 px-3 py-1 text-xs font-bold bg-secondary text-on_primary rounded-full hover:bg-opacity-80"
                    title="Mark as read"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-12">
              <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Notifications Found</h3>
              <p className="text-text-secondary mt-1">
                There are no notifications matching your current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
