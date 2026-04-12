import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, message, actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <Icon className="mb-4 h-16 w-16 text-text-muted-dark opacity-50" />
      )}

      <h2 className="mb-2 text-xl font-semibold text-text dark:text-text-dark">
        {title}
      </h2>

      <p className="mb-6 max-w-md text-sm text-text-muted dark:text-text-muted-dark">
        {message}
      </p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
