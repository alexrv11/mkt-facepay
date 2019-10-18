import axios from 'axios';
import config from '../config';
import { getFromLocalStorage, clearLocalStorage } from '../services/storage.service';

export const validateUser = ({ user, password }) => {
  const endpoint = '/login';
  const { url } = config;
  return axios.post(`${url}${endpoint}`, { user_name: user, password });
};

export const registerPayer = (face) => {
  const endpoint = "/payer/face"
  const { url } = config
  var payload = {
    face,
  }
  return axios.post(`${url}${endpoint}`, payload);
};

export const getUser = () => {
  const user = getFromLocalStorage('user')
  return user && user !== 'null' ? user : undefined;
};

export const logout = () => {
  clearLocalStorage('user')
};
