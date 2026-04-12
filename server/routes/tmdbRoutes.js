const express = require('express');
const { tmdbLimiter } = require('../middlewares/rateLimiter');
const {
  getTrending,
  searchMovies,
  getPopular,
  getTopRated,
  getMovieDetails,
  getMovieCredits,
} = require('../controllers/tmdbController');

const router = express.Router();

// Specific routes BEFORE parameterized routes to avoid conflicts
router.get('/trending', tmdbLimiter, getTrending);
router.get('/search', tmdbLimiter, searchMovies);
router.get('/popular', tmdbLimiter, getPopular);
router.get('/top-rated', tmdbLimiter, getTopRated);

// Parameterized routes
router.get('/:mediaType/:id', tmdbLimiter, getMovieDetails);
router.get('/:mediaType/:id/credits', tmdbLimiter, getMovieCredits);

module.exports = router;
