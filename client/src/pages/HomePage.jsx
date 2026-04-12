import { useState, useEffect, useCallback } from 'react';
import { getTrending, getPopular, getTopRated } from '../services/tmdbService';
import { getImageUrl, getMediaTitle, truncateText } from '../utils/helpers';
import { BACKDROP_SIZES } from '../utils/constants';
import MovieCard from '../components/ui/MovieCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';

const TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
  { id: 'top-rated', label: 'Top Rated' },
];

const TIME_WINDOWS = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This Week' },
];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('trending');
  const [timeWindow, setTimeWindow] = useState('week');

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (activeTab) {
        case 'trending':
          response = await getTrending(page, timeWindow);
          break;
        case 'popular':
          response = await getPopular(page);
          break;
        case 'top-rated':
          response = await getTopRated(page);
          break;
        default:
          response = await getTrending(page, timeWindow);
      }

      const data = response.data;
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, timeWindow]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setPage(1);
  };

  const handleTimeWindowChange = (tw) => {
    if (tw === timeWindow) return;
    setTimeWindow(tw);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const heroMovie = movies[0];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {heroMovie && !loading && (
        <div className="relative h-[400px] w-full overflow-hidden sm:h-[450px] md:h-[500px]">
          <img
            src={getImageUrl(heroMovie.backdrop_path, BACKDROP_SIZES.large)}
            alt={getMediaTitle(heroMovie)}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent dark:from-background-dark dark:via-background-dark/60" />
          <div className="absolute bottom-0 left-0 w-full px-4 pb-8 sm:px-6 md:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-text sm:text-3xl md:text-4xl dark:text-text-dark">
                {getMediaTitle(heroMovie)}
              </h2>
              {heroMovie.overview && (
                <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base dark:text-text-muted-dark">
                  {truncateText(heroMovie.overview, 200)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-border/50 text-text-muted hover:bg-border dark:bg-border-dark/50 dark:text-text-muted-dark dark:hover:bg-border-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Time Window Toggle — only visible for Trending tab */}
          {activeTab === 'trending' && (
            <div className="ml-auto flex items-center gap-1 rounded-full border border-border p-1 dark:border-border-dark">
              {TIME_WINDOWS.map((tw) => (
                <button
                  key={tw.id}
                  onClick={() => handleTimeWindowChange(tw.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    timeWindow === tw.id
                      ? 'bg-secondary text-white'
                      : 'text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark'
                  }`}
                >
                  {tw.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <p className="text-lg text-danger">{error}</p>
            <button
              onClick={fetchMovies}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} mediaType="movie" />
              ))}
            </div>

            {movies.length === 0 && (
              <p className="py-20 text-center text-text-muted dark:text-text-muted-dark">
                No results found.
              </p>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
