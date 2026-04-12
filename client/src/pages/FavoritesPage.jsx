import { useState, useEffect, useCallback } from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as listService from '../services/listService';
import { LIST_TYPES } from '../utils/constants';
import MovieCard from '../components/ui/MovieCard';
import MovieCardSkeleton from '../components/ui/MovieCardSkeleton';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';

const FavoritesPage = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchFavorites = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await listService.getList(LIST_TYPES.FAVORITE, pageNum);
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(data.page);
    } catch {
      setError('Failed to load favorites.');
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites(page);
  }, [fetchFavorites, page]);

  const handleRemoveClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMovie) return;

    const movieId = selectedMovie.movieId;
    const movieTitle = selectedMovie.movieTitle;

    setModalOpen(false);
    setSelectedMovie(null);

    // Optimistic update
    setItems((prev) => prev.filter((item) => item.movieId !== movieId));
    setTotal((prev) => prev - 1);

    try {
      await listService.removeFromList(LIST_TYPES.FAVORITE, movieId);
      toast.success(`Removed from favorites`);

      const newTotal = total - 1;
      const newTotalPages = Math.ceil(newTotal / items.length) || 1;

      // Navigate to previous page if current page is now empty
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchFavorites(page);
      }
    } catch {
      toast.error('Failed to remove movie');
      fetchFavorites(page);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-7 w-7 animate-pulse rounded bg-gray-700" />
          <div className="h-9 w-48 animate-pulse rounded bg-gray-700" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <MovieCardSkeleton count={10} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <FaHeart className="text-2xl text-red-500" />
        <h1 className="text-2xl font-bold text-text sm:text-3xl dark:text-text-dark">
          My Favorites
        </h1>
        {total > 0 && (
          <span className="rounded-full bg-primary/20 px-3 py-0.5 text-sm font-medium text-primary">
            {total} {total === 1 ? 'movie' : 'movies'}
          </span>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="No favorites yet"
          message="Start adding movies you love!"
          actionLabel="Browse Movies"
          actionTo="/"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item.movieId} className="group/card relative">
                <MovieCard
                  movie={{
                    id: item.movieId,
                    title: item.movieTitle,
                    poster_path: item.posterPath,
                    vote_average: item.voteAverage,
                    release_date: item.releaseDate,
                  }}
                  mediaType={item.mediaType}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClick(item);
                  }}
                  className="absolute top-2 right-2 z-10 rounded-full bg-black/70 p-2 text-white opacity-0 transition-all hover:bg-danger group-hover/card:opacity-100"
                  aria-label={`Remove ${item.movieTitle} from favorites`}
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Remove from Favorites?"
        message={`Are you sure you want to remove "${selectedMovie?.movieTitle}" from your favorites?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        variant="danger"
      />
    </div>
  );
};

export default FavoritesPage;
