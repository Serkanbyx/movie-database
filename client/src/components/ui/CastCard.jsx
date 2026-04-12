import { getImageUrl } from '../../utils/helpers';
import { PROFILE_SIZES } from '../../utils/constants';
import { FaUser } from 'react-icons/fa';

const CastCard = ({ person }) => {
  const profileUrl = person.profile_path
    ? getImageUrl(person.profile_path, PROFILE_SIZES.medium)
    : null;

  return (
    <div className="flex w-32 shrink-0 flex-col items-center text-center md:w-36">
      <div className="mb-2 h-32 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 md:h-36 md:w-36">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
            <FaUser />
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold leading-tight text-text dark:text-text-dark">
        {person.name}
      </h4>
      <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
        {person.character}
      </p>
    </div>
  );
};

export default CastCard;
