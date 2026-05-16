import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartasset-backend.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_BASE_URL };
