import { useState, useEffect, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as listService from '../../services/listService';
import usePageTitle from '../../hooks/usePageTitle';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import ConfirmModal from './ConfirmModal';

const ListPageContent = ({
  listType,
  icon: Icon,
  iconColor,
  title,
  emptyTitle,
  emptyMessage,
  listName,
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  usePageTitle(title);

  const fetchItems = useCallback(
    async (pageNum) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await listService.getList(listType, pageNum);
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setPage(data.page);
      } catch {
        setError(`Failed to load ${listName}.`);
        toast.error(`Failed to load ${listName}`);
      } finally {
        setLoading(false);
      }
    },
    [listType, listName],
  );

  useEffect(() => {
    fetchItems(page);
  }, [fetchItems, page]);

  const handleRemoveClick = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMovie) return;

    const movieId = selectedMovie.movieId;

    setModalOpen(false);
    setSelectedMovie(null);

    setItems((prev) => prev.filter((item) => item.movieId !== movieId));
    setTotal((prev) => prev - 1);

    try {
      await listService.removeFromList(listType, movieId);
      toast.success(`Removed from ${listName}`);

      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchItems(page);
      }
    } catch {
      toast.error('Failed to remove movie');
      fetchItems(page);
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
      <div className="mb-6 flex items-center gap-3">
        <Icon className={`text-2xl ${iconColor}`} />
        <h1 className="text-2xl font-bold text-text sm:text-3xl dark:text-text-dark">
          {title}
        </h1>
        {total > 0 && (
          <span className="rounded-full bg-primary/20 px-3 py-0.5 text-sm font-medium text-primary">
            {total} {total === 1 ? 'title' : 'titles'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={emptyTitle}
          message={emptyMessage}
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
                  aria-label={`Remove ${item.movieTitle} from ${listName}`}
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

      <ConfirmModal
        isOpen={modalOpen}
        title={`Remove from ${title}?`}
        message={`Are you sure you want to remove "${selectedMovie?.movieTitle}" from your ${listName}?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        variant="danger"
      />
    </div>
  );
};

export default ListPageContent;
