const MovieItem = require('../models/MovieItem');

const VALID_LIST_TYPES = ['favorite', 'watchlist'];
const VALID_MEDIA_TYPES = ['movie', 'tv'];

const getList = async (req, res, next) => {
  try {
    const { listType } = req.params;

    if (!VALID_LIST_TYPES.includes(listType)) {
      const error = new Error('Invalid list type. Must be "favorite" or "watchlist"');
      error.statusCode = 400;
      throw error;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const filter = { userId: req.user._id, listType };

    const [items, total] = await Promise.all([
      MovieItem.find(filter)
        .sort({ addedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      MovieItem.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        items,
        page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    next(err);
  }
};

const addToList = async (req, res, next) => {
  try {
    const { movieId, movieTitle, posterPath, mediaType, listType, voteAverage, releaseDate } =
      req.body;

    if (!VALID_LIST_TYPES.includes(listType)) {
      const error = new Error('Invalid list type. Must be "favorite" or "watchlist"');
      error.statusCode = 400;
      throw error;
    }

    if (!VALID_MEDIA_TYPES.includes(mediaType)) {
      const error = new Error('Invalid media type. Must be "movie" or "tv"');
      error.statusCode = 400;
      throw error;
    }

    const existingItem = await MovieItem.findOne({
      userId: req.user._id,
      movieId,
      listType,
    });

    if (existingItem) {
      const error = new Error(`Movie already in your ${listType} list`);
      error.statusCode = 400;
      throw error;
    }

    const item = await MovieItem.create({
      userId: req.user._id,
      movieId,
      movieTitle,
      posterPath,
      mediaType,
      listType,
      voteAverage,
      releaseDate,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const removeFromList = async (req, res, next) => {
  try {
    const { listType, movieId } = req.params;

    const deletedItem = await MovieItem.findOneAndDelete({
      userId: req.user._id,
      movieId: Number(movieId),
      listType,
    });

    if (!deletedItem) {
      const error = new Error(`Movie not found in your ${listType} list`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: `Removed from ${listType} list` });
  } catch (err) {
    next(err);
  }
};

const checkListStatus = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const [favorite, watchlist] = await Promise.all([
      MovieItem.findOne({ userId: req.user._id, movieId: Number(movieId), listType: 'favorite' }),
      MovieItem.findOne({ userId: req.user._id, movieId: Number(movieId), listType: 'watchlist' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        isFavorite: Boolean(favorite),
        isWatchlist: Boolean(watchlist),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getList, addToList, removeFromList, checkListStatus };
