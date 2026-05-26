import api from './api';

export const dashboardService = {
  getStats: () => api.get('/api/v1/dashboard/stats'),
  getRecentLogs: () => api.get('/api/v1/dashboard/recent-logs')
};

export default dashboardService;
