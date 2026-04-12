import api from '../api/axios';

export const getTrending = (page = 1, timeWindow = 'week') =>
  api.get('/movies/trending', { params: { page, timeWindow } });

export const searchMovies = (query, page = 1) =>
  api.get('/movies/search', { params: { query, page } });

export const getMovieDetails = (mediaType, id) =>
  api.get(`/movies/${mediaType}/${id}`);

export const getMovieCredits = (mediaType, id) =>
  api.get(`/movies/${mediaType}/${id}/credits`);

export const getPopular = (page = 1) =>
  api.get('/movies/popular', { params: { page } });

export const getTopRated = (page = 1) =>
  api.get('/movies/top-rated', { params: { page } });
