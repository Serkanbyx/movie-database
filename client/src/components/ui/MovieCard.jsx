import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, getMediaTitle, getYear, getMediaReleaseDate, formatRating, truncateText } from '../../utils/helpers';
import { POSTER_SIZES, MEDIA_TYPES, DEFAULT_POSTER } from '../../utils/constants';

const getRatingColor = (rating) => {
  if (rating >= 7) return 'bg-green-600';
  if (rating >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const MovieCard = ({ movie, mediaType }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const resolvedMediaType = movie.media_type || mediaType || MEDIA_TYPES.MOVIE;
  const title = getMediaTitle(movie);
  const year = getYear(getMediaReleaseDate(movie));
  const rating = formatRating(movie.vote_average);
  const posterUrl = getImageUrl(movie.poster_path, POSTER_SIZES.medium);
  const displayPoster = imgError ? DEFAULT_POSTER : posterUrl;

  const handleClick = () => {
    navigate(`/${resolvedMediaType}/${movie.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="link"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-xl bg-surface shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:bg-surface-dark"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <img
          src={displayPoster}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
        />

        {/* Rating Badge */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold text-white ${getRatingColor(movie.vote_average)}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-2 right-2 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white">
          {resolvedMediaType === MEDIA_TYPES.TV ? 'TV' : 'Movie'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold leading-tight text-text dark:text-text-dark">
          {truncateText(title, 40)}
        </h3>
        <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
          {year}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
