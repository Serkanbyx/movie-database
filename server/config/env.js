const dotenv = require('dotenv');
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
};

if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Please set it in your .env file.');
}

if (env.NODE_ENV === 'production' && env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production.');
}

if (!env.TMDB_API_KEY || env.TMDB_API_KEY.startsWith('your_')) {
  throw new Error(
    'TMDB_API_KEY is required. Replace the placeholder with your actual API key.\n' +
    'Get one at: https://www.themoviedb.org/settings/api'
  );
}

module.exports = env;
