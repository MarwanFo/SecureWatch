const API_BASE = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sw_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('sw_access_token');
    localStorage.removeItem('sw_refresh_token');
    localStorage.removeItem('sw_user');
    window.location.reload();
    throw new Error('Session expired');
  }
  return response.json();
};

export const api = {
  get: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },
  post: async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },
  put: async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  }
};

export default api;
