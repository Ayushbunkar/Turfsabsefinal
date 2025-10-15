import api from "../config/Api";

// Single merged superAdminService with placeholder methods used by superadmin pages.
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function safeFetch(url) {
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

const superAdminService = {
  async fetchOverview() {
    try {
      const res = await api.get('/superadmin/overview');
      return res.data;
    } catch (e) {
      return {};
    }
  },

  async fetchTurfAdmins() {
    try {
      const res = await api.get('/superadmin/turfadmins');
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async getNotifications() {
    try {
      const data = await safeFetch(`${API_BASE}/superadmin/notifications`);
      return data;
    } catch (err) {
      return {
        notifications: [
          { id: 1, type: 'warning', title: 'High Server Load', message: 'CPU at 85%', time: '2 mins ago', read: false },
          { id: 2, type: 'success', title: 'New Turf Admin', message: 'John Doe registered', time: '15 mins ago', read: false },
          { id: 3, type: 'info', title: 'Daily Report', message: 'Analytics ready', time: '1 hour ago', read: true }
        ]
      };
    }
  },

  async getSystemAlerts() {
    try {
      const data = await safeFetch(`${API_BASE}/superadmin/alerts`);
      return data;
    } catch (err) {
      return {
        alerts: [
          { id: 1, type: 'warning', message: 'Database backup overdue', severity: 'medium' },
          { id: 2, type: 'success', message: 'All services operational', severity: 'low' }
        ]
      };
    }
  }
  ,

  // Notification helpers used by the UI pages
  async getNotificationStats() {
    try {
      const res = await api.get('/superadmin/notifications/stats');
      return res.data;
    } catch (err) {
      return { total: 0, sent: 0, draft: 0, scheduled: 0, delivered: 0, opened: 0 };
    }
  },

  async createNotification(payload) {
    try {
      const res = await api.post('/superadmin/notifications', payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  async sendNotification(id) {
    try {
      const res = await api.post(`/superadmin/notifications/${id}/send`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  async deleteNotification(id) {
    try {
      const res = await api.delete(`/superadmin/notifications/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  async getNotificationSettings() {
    try {
      const res = await api.get('/superadmin/notifications/settings');
      return res.data;
    } catch (err) {
      return {};
    }
  },

  // System health helpers
  async getSystemMetrics() {
    try {
      const res = await api.get('/superadmin/system/metrics');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  async getSystemServices() {
    try {
      const res = await api.get('/superadmin/system/services');
      return res.data;
    } catch (err) {
      return [];
    }
  },

  async getPerformanceHistory(range = '1h') {
    try {
      const res = await api.get(`/superadmin/system/performance?range=${range}`);
      return res.data;
    } catch (err) {
      return [];
    }
  }
};

export default superAdminService;
