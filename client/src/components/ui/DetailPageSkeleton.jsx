const DetailPageSkeleton = () => (
  <div className="min-h-screen animate-pulse">
    {/* Hero Skeleton */}
    <div className="relative bg-gray-200 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:py-20">
        <div className="mx-auto h-[336px] w-56 rounded-xl bg-gray-300 dark:bg-gray-700 md:mx-0 md:h-[432px] md:w-72" />
        <div className="flex-1 space-y-4">
          <div className="mx-auto h-10 w-3/4 rounded bg-gray-300 dark:bg-gray-700 md:mx-0" />
          <div className="mx-auto h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-700 md:mx-0" />
          <div className="flex justify-center gap-3 md:justify-start">
            <div className="h-10 w-28 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="h-10 w-28 rounded-lg bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>

    {/* Info Skeleton */}
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    {/* Cast Skeleton */}
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-32 shrink-0 flex-col items-center gap-2 md:w-36">
            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 md:h-36 md:w-36" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DetailPageSkeleton;
