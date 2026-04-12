import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbService';
import useDebounce from '../hooks/useDebounce';
import MovieCard from '../components/ui/MovieCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setResults([]);
        setTotalPages(1);
        setTotalResults(0);
        setHasSearched(false);
        setSearchParams({}, { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      setSearchParams({ query: debouncedQuery }, { replace: true });

      try {
        const response = await searchMovies(debouncedQuery, page);
        const data = response.data;

        setResults(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
        setTotalResults(data.total_results || 0);
        setHasSearched(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, page, setSearchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      {/* Search Header */}
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-text sm:text-4xl dark:text-text-dark">
          Search
        </h1>

        <div className="relative">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search movies and TV shows..."
            className="w-full rounded-xl border border-border bg-surface py-4 pr-12 pl-12 text-lg text-text shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-text-muted transition-colors hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
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
        </div>
      )}

      {/* Initial State — no query yet */}
      {!loading && !error && !hasSearched && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-border dark:text-border-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg text-text-muted dark:text-text-muted-dark">
            Start typing to search for movies and TV shows
          </p>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-border dark:text-border-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-text dark:text-text-dark">
            No results found for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Try different keywords or check the spelling
          </p>
        </div>
      )}

      {/* Results Found */}
      {!loading && !error && hasSearched && results.length > 0 && (
        <>
          <p className="mt-8 mb-6 text-sm text-text-muted dark:text-text-muted-dark">
            Found <span className="font-semibold text-text dark:text-text-dark">{totalResults.toLocaleString()}</span> results for &ldquo;
            <span className="font-semibold text-text dark:text-text-dark">{debouncedQuery}</span>&rdquo;
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

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

export default SearchPage;
