import { TMDB_IMAGE_BASE, DEFAULT_POSTER, POSTER_SIZES } from './constants';

export const getImageUrl = (path, size = POSTER_SIZES.medium) => {
  if (!path) return DEFAULT_POSTER;
  return `${TMDB_IMAGE_BASE}${size}${path}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'N/A';
  return Math.round(rating * 10) / 10;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
};

export const getMediaTitle = (item) => {
  return item?.title || item?.name || 'Untitled';
};

export const getMediaReleaseDate = (item) => {
  return item?.release_date || item?.first_air_date || '';
};
