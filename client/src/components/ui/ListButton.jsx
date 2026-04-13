import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import * as listService from '../../services/listService';
import { LIST_TYPES } from '../../utils/constants';
import Spinner from './Spinner';

const ListButton = ({ movieId, movieData, mediaType, listType, isActive, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFavorite = listType === LIST_TYPES.FAVORITE;

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    try {
      if (isActive) {
        await listService.removeFromList(listType, movieId);
        toast.success(isFavorite ? 'Removed from favorites' : 'Removed from watchlist');
      } else {
        await listService.addToList({
          movieId,
          movieTitle: movieData?.title || movieData?.name,
          posterPath: movieData?.poster_path,
          mediaType,
          listType,
          voteAverage: movieData?.vote_average,
          releaseDate: movieData?.release_date || movieData?.first_air_date,
        });
        toast.success(isFavorite ? 'Added to favorites' : 'Added to watchlist');
      }
      onToggle?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = isFavorite ? FaHeart : FaBookmark;
  const InactiveIcon = isFavorite ? FaRegHeart : FaRegBookmark;
  const Icon = isActive ? ActiveIcon : InactiveIcon;
  const label = isActive
    ? isFavorite ? 'Favorited' : 'Watchlisted'
    : isFavorite ? 'Add to Favorites' : 'Add to Watchlist';

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
        isActive
          ? isFavorite
            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
            : 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <Icon className={isActive && isFavorite ? 'text-red-500' : ''} />
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

export default ListButton;
