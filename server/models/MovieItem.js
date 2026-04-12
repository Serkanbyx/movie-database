const mongoose = require('mongoose');

const movieItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  movieId: {
    type: Number,
    required: [true, 'Movie ID is required'],
  },
  movieTitle: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Movie title must be at most 200 characters'],
  },
  posterPath: {
    type: String,
    default: '',
  },
  mediaType: {
    type: String,
    required: true,
    default: 'movie',
    enum: ['movie', 'tv'],
  },
  listType: {
    type: String,
    required: [true, 'List type is required'],
    enum: ['favorite', 'watchlist'],
  },
  voteAverage: {
    type: Number,
    default: 0,
    min: [0, 'Vote average cannot be less than 0'],
    max: [10, 'Vote average cannot be more than 10'],
  },
  releaseDate: {
    type: String,
    default: '',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevents duplicate entries (same user + same movie + same list)
movieItemSchema.index({ userId: 1, movieId: 1, listType: 1 }, { unique: true });

// Fast list queries sorted by addedAt
movieItemSchema.index({ userId: 1, listType: 1, addedAt: -1 });

module.exports = mongoose.model('MovieItem', movieItemSchema);
