import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qc_token');
      localStorage.removeItem('qc_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getReceipt: (id) => api.get(`/bookings/${id}/receipt`, { responseType: 'blob' }),
};

// Connection APIs
export const connectionAPI = {
  verify: (data) => api.post('/connections/verify', data),
  save: (data) => api.post('/connections', data),
  getAll: () => api.get('/connections'),
  delete: (id) => api.delete(`/connections/${id}`),
};

// Address APIs
export const addressAPI = {
  save: (data) => api.post('/addresses', data),
  getAll: () => api.get('/addresses'),
  delete: (id) => api.delete(`/addresses/${id}`),
};

// Price APIs
export const priceAPI = {
  getPrice: (provider, cylinderType, city) =>
    api.get(`/prices?provider=${provider}&type=${cylinderType}&city=${city}`),
  getAllPrices: () => api.get('/prices/all'),
};

// Support APIs
export const supportAPI = {
  create: (data) => api.post('/support', data),
  getAll: () => api.get('/support'),
  getById: (id) => api.get(`/support/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  updatePrice: (data) => api.put('/admin/prices', data),
  getTickets: () => api.get('/admin/tickets'),
  respondTicket: (id, data) => api.put(`/admin/tickets/${id}`, data),
};

export default api;
