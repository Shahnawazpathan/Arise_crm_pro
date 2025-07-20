export async function fetchDemands() {
  try {
    const response = await fetch('http://localhost:3001/api/demands');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch demands:', error);
    return [];
  }
}

export async function fetchClients() {
  try {
    const response = await fetch('http://localhost:3001/api/clients');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
}

export async function fetchNotifications() {
  try {
    const response = await fetch('http://localhost:3001/api/notifications');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

export async function fetchDashboardStats() {
  try {
    const response = await fetch('http://localhost:3001/api/dashboard-stats');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}

export interface NotificationInput {
  message: string;
  type: 'status' | 'client' | 'system';
}

export async function addNotification(notification: NotificationInput) {
  try {
    const response = await fetch('http://localhost:3001/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Failed to add notification:', error);
    return null;
  }
}
