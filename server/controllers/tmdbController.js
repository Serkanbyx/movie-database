const tmdbApi = require('../utils/tmdbApi');

const VALID_MEDIA_TYPES = ['movie', 'tv'];
const VALID_TIME_WINDOWS = ['day', 'week'];

const clampPage = (raw) => {
  const page = parseInt(raw, 10) || 1;
  return Math.max(1, Math.min(page, 500));
};

const getTrending = async (req, res, next) => {
  try {
    const page = clampPage(req.query.page);
    const timeWindow = VALID_TIME_WINDOWS.includes(req.query.timeWindow)
      ? req.query.timeWindow
      : 'week';

    const { data } = await tmdbApi.get(`/trending/all/${timeWindow}`, {
      params: { page },
    });

    res.status(200).json({
      success: true,
      data: {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
    });
  } catch (err) {
    next(createTmdbError(err));
  }
};

const searchMovies = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      const error = new Error('Search query is required');
      error.statusCode = 400;
      throw error;
    }

    const page = clampPage(req.query.page);

    const { data } = await tmdbApi.get('/search/multi', {
      params: { query, page, include_adult: false },
    });

    const filteredResults = data.results.filter((item) =>
      VALID_MEDIA_TYPES.includes(item.media_type),
    );

    res.status(200).json({
      success: true,
      data: {
        results: filteredResults,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
    });
  } catch (err) {
    if (err.statusCode) return next(err);
    next(createTmdbError(err));
  }
};

const getMovieDetails = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;

    if (!VALID_MEDIA_TYPES.includes(mediaType)) {
      const error = new Error('Invalid media type');
      error.statusCode = 400;
      throw error;
    }

    if (!isPositiveInteger(id)) {
      const error = new Error('Invalid ID');
      error.statusCode = 400;
      throw error;
    }

    const { data } = await tmdbApi.get(`/${mediaType}/${id}`, {
      params: { append_to_response: 'credits,videos,similar' },
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.statusCode) return next(err);
    next(createTmdbError(err));
  }
};

const getMovieCredits = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;

    if (!VALID_MEDIA_TYPES.includes(mediaType)) {
      const error = new Error('Invalid media type');
      error.statusCode = 400;
      throw error;
    }

    if (!isPositiveInteger(id)) {
      const error = new Error('Invalid ID');
      error.statusCode = 400;
      throw error;
    }

    const { data } = await tmdbApi.get(`/${mediaType}/${id}/credits`);

    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.statusCode) return next(err);
    next(createTmdbError(err));
  }
};

const getPopular = async (req, res, next) => {
  try {
    const page = clampPage(req.query.page);

    const { data } = await tmdbApi.get('/movie/popular', {
      params: { page },
    });

    res.status(200).json({
      success: true,
      data: {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
    });
  } catch (err) {
    next(createTmdbError(err));
  }
};

const getTopRated = async (req, res, next) => {
  try {
    const page = clampPage(req.query.page);

    const { data } = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });

    res.status(200).json({
      success: true,
      data: {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
    });
  } catch (err) {
    next(createTmdbError(err));
  }
};

/* ── Helpers ── */

const isPositiveInteger = (value) => /^\d+$/.test(value) && Number(value) > 0;

const createTmdbError = (err) => {
  if (err.response?.status === 404) {
    const error = new Error('The requested content was not found');
    error.statusCode = 404;
    return error;
  }

  const error = new Error('Failed to fetch data from TMDB');
  error.statusCode = 502;
  return error;
};

module.exports = {
  getTrending,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getPopular,
  getTopRated,
};
