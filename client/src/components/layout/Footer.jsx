import { HiOutlineFilm } from 'react-icons/hi2';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-dark bg-surface-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-gray-400">
            <HiOutlineFilm className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-gray-300">MovieDB</span>
          </div>

          {/* TMDB Attribution */}
          <div className="flex items-center gap-2 text-sm text-text-muted-dark">
            <span>Powered by</span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-secondary transition-colors hover:text-secondary-hover"
            >
              TMDB API
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted-dark">
            &copy; {currentYear} MovieDB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
