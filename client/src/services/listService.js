import api from '../api/axios';

export const getList = (listType, page = 1) =>
  api.get(`/list/${listType}`, { params: { page } });

export const addToList = (data) => api.post('/list', data);

export const removeFromList = (listType, movieId) =>
  api.delete(`/list/${listType}/${movieId}`);

export const checkListStatus = (movieId) =>
  api.get(`/list/status/${movieId}`);
