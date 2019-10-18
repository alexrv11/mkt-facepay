import axios from 'axios';
import config from '../config';
import { getFromLocalStorage, clearLocalStorage } from '../services/storage.service';

export const validateUser = ({ user, password }) => {
  const endpoint = '/login';
  const { url } = config;
  return axios.post(`${url}${endpoint}`, { user_name: user, password });
};

export const getUser = () => {
  return getFromLocalStorage('user');
}

export const logout = () => {
  clearLocalStorage('user')
}
