import { Link } from 'react-router-dom';
import { TbMovie } from 'react-icons/tb';
import usePageTitle from '../hooks/usePageTitle';

const NotFoundPage = () => {
  usePageTitle('Page Not Found');
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Film Reel Icon */}
      <div className="mb-6 rounded-full bg-primary/10 p-5 dark:bg-primary/20">
        <TbMovie className="h-12 w-12 text-primary" />
      </div>

      {/* Gradient 404 Number */}
      <h1 className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">
        404
      </h1>

      {/* Page Not Found Heading */}
      <h2 className="mt-4 text-2xl font-bold text-text dark:text-text-dark sm:text-3xl">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md text-base text-text-muted dark:text-text-muted-dark sm:text-lg">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* CTA Button */}
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
