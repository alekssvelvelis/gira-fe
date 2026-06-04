import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const login = (email: string, password: string) =>
  API.post('/auth/login', { email, password });

export const register = (email: string, password: string, confirmpassword: string) =>
  API.post('/auth/register', { email, password, confirmpassword });