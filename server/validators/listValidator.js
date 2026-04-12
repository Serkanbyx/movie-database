const { body, param } = require('express-validator');

const addToListValidator = [
  body('movieId')
    .notEmpty()
    .withMessage('Movie ID is required')
    .isInt({ min: 1 })
    .withMessage('Movie ID must be a positive integer'),
  body('movieTitle')
    .notEmpty()
    .withMessage('Movie title is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Movie title must be at most 200 characters')
    .escape(),
  body('posterPath').optional().trim(),
  body('mediaType')
    .notEmpty()
    .withMessage('Media type is required')
    .isIn(['movie', 'tv'])
    .withMessage('Media type must be "movie" or "tv"'),
  body('listType')
    .notEmpty()
    .withMessage('List type is required')
    .isIn(['favorite', 'watchlist'])
    .withMessage('List type must be "favorite" or "watchlist"'),
  body('voteAverage')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Vote average must be between 0 and 10'),
  body('releaseDate').optional().trim(),
];

const listTypeParamValidator = [
  param('listType')
    .isIn(['favorite', 'watchlist'])
    .withMessage('List type must be "favorite" or "watchlist"'),
];

const movieIdParamValidator = [
  param('movieId')
    .isInt({ min: 1 })
    .withMessage('Movie ID must be a positive integer'),
];

module.exports = {
  addToListValidator,
  listTypeParamValidator,
  movieIdParamValidator,
};
