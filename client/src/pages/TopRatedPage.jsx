import { useState, useEffect, useCallback } from 'react';
import { getTopRated } from '../services/tmdbService';
import usePageTitle from '../hooks/usePageTitle';
import MovieCard from '../components/ui/MovieCard';
import MovieCardSkeleton from '../components/ui/MovieCardSkeleton';
import Pagination from '../components/ui/Pagination';
import { MEDIA_TYPES } from '../utils/constants';

const TopRatedPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTopRated = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTopRated(page);
      const data = response.data;
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch top rated movies.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTopRated();
  }, [fetchTopRated]);

  usePageTitle('Top Rated Movies');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text sm:text-3xl dark:text-text-dark">
        Top Rated Movies
      </h1>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <MovieCardSkeleton count={20} />
        </div>
      )}

      {error && !loading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
          <p className="text-lg text-danger">{error}</p>
          <button
            onClick={fetchTopRated}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType={MEDIA_TYPES.MOVIE} />
            ))}
          </div>

          {movies.length === 0 && (
            <p className="py-20 text-center text-text-muted dark:text-text-muted-dark">
              No results found.
            </p>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TopRatedPage;
