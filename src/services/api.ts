import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token in interceptor:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const analyticsApi = {
  getAnalytics: async (timeRange: string) => {
    const response = await api.get(`/analytics?timeRange=${timeRange}`);
    return response.data;
  },

  getCompanyPerformance: async () => {
    const response = await api.get('/analytics/companies');
    return response.data;
  },

  getBookingStats: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/bookings', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getRevenueStats: async (startDate: string, endDate: string) => {
    const response = await api.get('/analytics/revenue', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default api;
