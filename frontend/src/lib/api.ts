import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const backendApi = axios.create({
  baseURL: BACKEND_URL.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default backendApi;