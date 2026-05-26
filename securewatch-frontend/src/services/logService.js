import api from './api';

export const logService = {
  getLogs: (page = 0, size = 20) => {
    return api.get(`/api/v1/logs?page=${page}&size=${size}`);
  },

  verifyIntegrity: () => api.get('/api/v1/logs/verify-integrity')
};

export default logService;
