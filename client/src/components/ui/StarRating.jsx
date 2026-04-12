import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { formatRating } from '../../utils/helpers';

const sizeMap = {
  sm: 'text-sm gap-0.5',
  md: 'text-lg gap-1',
  lg: 'text-2xl gap-1.5',
};

const numericSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const StarRating = ({ rating, size = 'md' }) => {
  const starCount = 5;
  const normalizedRating = Math.min(Math.max((rating || 0) / 2, 0), 5);

  const stars = Array.from({ length: starCount }, (_, i) => {
    const starValue = i + 1;

    if (normalizedRating >= starValue) return 'full';
    if (normalizedRating >= starValue - 0.5) return 'half';
    return 'empty';
  });

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${sizeMap[size]} text-amber-400`}>
        {stars.map((type, i) => {
          if (type === 'full') return <FaStar key={i} />;
          if (type === 'half') return <FaStarHalfAlt key={i} />;
          return <FaRegStar key={i} />;
        })}
      </div>
      <span className={`font-semibold text-text dark:text-text-dark ${numericSizeMap[size]}`}>
        {formatRating(rating)}/10
      </span>
    </div>
  );
};

export default StarRating;
