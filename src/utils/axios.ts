import axios from 'axios';
const API_URL = 'http://localhost:8000/api'
export const BACKEND_URL = 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});