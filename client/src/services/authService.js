import api from '../api/axios';

export const registerUser = (data) => api.post('/auth/register', data);

export const loginUser = (data) => api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

export const updateProfile = (data) => api.put('/auth/profile', data);

export const changePassword = (data) => api.put('/auth/change-password', data);

export const deleteAccount = (data) =>
  api.delete('/auth/account', { data });
