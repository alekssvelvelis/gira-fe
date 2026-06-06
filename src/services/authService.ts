import axios from 'axios';
const API_URL = 'http://localhost:8000/api'

const api = axios.create({
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

export const registerRequest = async (email: string, nickname: string, password: string, confirmPassword: string) => {
  const response = await api.post('/register', {
      email,
      nickname,
      password,
      password_confirmation: confirmPassword,
  });

  const { token, user, message } = response.data;
  console.log(message);
  return { token, user };
};

export const logoutRequest = async () => {
    await api.post('/logout');
};