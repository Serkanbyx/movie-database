const MovieCardSkeleton = ({ count = 10 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-surface shadow-md dark:bg-surface-dark"
        >
          <div className="relative aspect-2/3 w-full bg-gray-300 dark:bg-gray-700" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      ))}
    </>
  );
};

export default MovieCardSkeleton;
