import axios from 'axios';
import config from '../config';

export const validateUser = ({ user, password }) => {
  const endpoint = '/login';
  const { url } = config;
  return axios.post(`${url}${endpoint}`, { user_name: user, password });
};
