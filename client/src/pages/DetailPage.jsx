import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as tmdbService from '../services/tmdbService';
import * as listService from '../services/listService';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl, formatDate, getYear, getMediaTitle, getMediaReleaseDate } from '../utils/helpers';
import { POSTER_SIZES, BACKDROP_SIZES, MEDIA_TYPES } from '../utils/constants';
import StarRating from '../components/ui/StarRating';
import CastCard from '../components/ui/CastCard';
import ListButton from '../components/ui/ListButton';
import MovieCard from '../components/ui/MovieCard';
import DetailPageSkeleton from '../components/ui/DetailPageSkeleton';
import NotFoundPage from './NotFoundPage';

const DetailPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [listStatus, setListStatus] = useState({ isFavorite: false, isWatchlist: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isValidMediaType = mediaType === MEDIA_TYPES.MOVIE || mediaType === MEDIA_TYPES.TV;

  useEffect(() => {
    if (!isValidMediaType) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const requests = [
          tmdbService.getMovieDetails(mediaType, id),
        ];

        if (isAuthenticated) {
          requests.push(listService.checkListStatus(id));
        }

        const results = await Promise.all(requests);
        setMovie(results[0].data);

        if (results[1]) {
          setListStatus(results[1].data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('notFound');
        } else {
          setError('generic');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType, id, isAuthenticated, isValidMediaType]);

  const handleListToggle = (type) => {
    setListStatus((prev) => ({
      ...prev,
      [type === 'favorite' ? 'isFavorite' : 'isWatchlist']:
        !prev[type === 'favorite' ? 'isFavorite' : 'isWatchlist'],
    }));
  };

  const formatRuntime = (runtime) => {
    if (!runtime) return null;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const scrollContainer = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isValidMediaType) return <NotFoundPage />;

  if (loading) return <DetailPageSkeleton />;

  if (error === 'notFound') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark">
          {mediaType === MEDIA_TYPES.TV ? 'TV Show' : 'Movie'} Not Found
        </h2>
        <p className="text-text-muted dark:text-text-muted-dark">
          The content you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary-hover"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark">
          Something went wrong
        </h2>
        <p className="text-text-muted dark:text-text-muted-dark">
          We couldn&apos;t load the details. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  const title = getMediaTitle(movie);
  const releaseDate = getMediaReleaseDate(movie);
  const year = getYear(releaseDate);
  const backdropUrl = getImageUrl(movie.backdrop_path, BACKDROP_SIZES.large);
  const posterUrl = getImageUrl(movie.poster_path, POSTER_SIZES.large);
  const cast = movie?.credits?.cast?.slice(0, 15) || [];
  const similarItems = movie.similar?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          {movie.backdrop_path ? (
            <img
              src={backdropUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40 dark:from-background-dark dark:via-background-dark/80 dark:to-background-dark/40" />
          <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent dark:from-background-dark/90 dark:via-background-dark/50" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:py-20">
          {/* Poster */}
          <div className="mx-auto w-56 shrink-0 md:mx-0 md:w-72">
            <img
              src={posterUrl}
              alt={title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          {/* Title & Actions */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold text-text dark:text-text-dark md:text-5xl">
              {title}
              {year !== 'N/A' && (
                <span className="ml-3 text-xl font-normal text-text-muted dark:text-text-muted-dark md:text-2xl">
                  ({year})
                </span>
              )}
            </h1>

            {movie.tagline && (
              <p className="text-base italic text-text-muted dark:text-text-muted-dark">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <ListButton
                movieId={movie.id}
                movieData={movie}
                mediaType={mediaType}
                listType="favorite"
                isActive={listStatus.isFavorite}
                onToggle={() => handleListToggle('favorite')}
              />
              <ListButton
                movieId={movie.id}
                movieData={movie}
                mediaType={mediaType}
                listType="watchlist"
                isActive={listStatus.isWatchlist}
                onToggle={() => handleListToggle('watchlist')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Rating */}
            <div className="flex flex-wrap items-center gap-4">
              <StarRating rating={movie.vote_average} size="lg" />
              {movie.vote_count > 0 && (
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted dark:text-text-muted-dark">
              {releaseDate && (
                <span>{formatDate(releaseDate)}</span>
              )}
              {releaseDate && (movie.runtime || movie.number_of_seasons) && (
                <span className="text-border dark:text-border-dark">•</span>
              )}
              {mediaType === MEDIA_TYPES.MOVIE && movie.runtime ? (
                <span>{formatRuntime(movie.runtime)}</span>
              ) : mediaType === MEDIA_TYPES.TV && movie.number_of_seasons ? (
                <span>
                  {movie.number_of_seasons} Season{movie.number_of_seasons !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/20"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div>
                <h2 className="mb-2 text-xl font-bold text-text dark:text-text-dark">
                  Overview
                </h2>
                <p className="leading-relaxed text-text-muted dark:text-text-muted-dark">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4 rounded-xl bg-surface p-6 shadow-sm dark:bg-surface-dark">
            {movie.status && (
              <InfoItem label="Status" value={movie.status} />
            )}
            {movie.original_language && (
              <InfoItem label="Language" value={movie.original_language.toUpperCase()} />
            )}
            {movie.budget > 0 && (
              <InfoItem
                label="Budget"
                value={`$${movie.budget.toLocaleString()}`}
              />
            )}
            {movie.revenue > 0 && (
              <InfoItem
                label="Revenue"
                value={`$${movie.revenue.toLocaleString()}`}
              />
            )}
            {movie.production_companies?.length > 0 && (
              <InfoItem
                label="Production"
                value={movie.production_companies.map((c) => c.name).join(', ')}
              />
            )}
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold text-text dark:text-text-dark">
            Cast
          </h2>
          <div className="group/scroll relative">
            <button
              onClick={() => scrollContainer('cast-scroll', 'left')}
              className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-surface p-2 shadow-lg transition-opacity hover:bg-gray-100 group-hover/scroll:block dark:bg-surface-dark dark:hover:bg-gray-700"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-text dark:text-text-dark" />
            </button>
            <div
              id="cast-scroll"
              className="scrollbar-hide flex gap-5 overflow-x-auto pb-4"
            >
              {cast.map((person) => (
                <CastCard key={person.id || person.credit_id} person={person} />
              ))}
            </div>
            <button
              onClick={() => scrollContainer('cast-scroll', 'right')}
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-surface p-2 shadow-lg transition-opacity hover:bg-gray-100 group-hover/scroll:block dark:bg-surface-dark dark:hover:bg-gray-700"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-text dark:text-text-dark" />
            </button>
          </div>
        </section>
      )}

      {/* Similar Movies/Shows Section */}
      {similarItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 pb-16">
          <h2 className="mb-6 text-2xl font-bold text-text dark:text-text-dark">
            Similar {mediaType === MEDIA_TYPES.TV ? 'TV Shows' : 'Movies'}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {similarItems.map((item) => (
              <MovieCard key={item.id} movie={item} mediaType={mediaType} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
      {label}
    </dt>
    <dd className="mt-1 text-sm font-medium text-text dark:text-text-dark">
      {value}
    </dd>
  </div>
);

export default DetailPage;
