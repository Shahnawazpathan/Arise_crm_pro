import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:3001/api';

const register = (data: Omit<User, 'id'>) => {
  return axios.post(`${API_URL}/register`, data);
};

const login = async (data: Omit<User, 'id' | 'role'>) => {
  const response = await axios.post(`${API_URL}/login`, data);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
