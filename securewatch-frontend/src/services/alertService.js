import api from './api';

export const alertService = {
  getAlerts: (page = 0, size = 10, severity = null) => {
    const params = new URLSearchParams({ page, size });
    if (severity) params.append('severity', severity);
    return api.get(`/api/v1/alerts?${params}`);
  },

  acknowledgeAlert: (alertId, userId) => {
    return api.post(`/api/v1/alerts/${alertId}/acknowledge?acknowledgedBy=${userId}`);
  },

  getStats: () => api.get('/api/v1/alerts/stats')
};

export default alertService;
