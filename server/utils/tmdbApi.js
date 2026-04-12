const axios = require('axios');
const { TMDB_BASE_URL, TMDB_API_KEY } = require('../config/env');

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY },
  timeout: 10000,
});

module.exports = tmdbApi;
