import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiOutlineFilm,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiChevronDown,
} from 'react-icons/hi2';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/popular', label: 'Popular' },
  { to: '/top-rated', label: 'Top Rated' },
];

const activeLinkClass = ({ isActive }) =>
  `transition-colors duration-200 ${
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary'
      : 'text-gray-300 hover:text-white'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-lg transition-colors duration-200 ${
    isActive
      ? 'text-primary bg-primary/10 font-semibold'
      : 'text-gray-300 hover:text-white hover:bg-white/5'
  }`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    closeMobile();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/95 backdrop-blur-sm border-b border-border-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <HiOutlineFilm className="h-7 w-7 text-primary" />
            <span>MovieDB</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={activeLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/favorites"
                  className={activeLinkClass}
                  title="Favorites"
                >
                  <HiOutlineHeart className="h-5 w-5" />
                </NavLink>
                <NavLink
                  to="/watchlist"
                  className={activeLinkClass}
                  title="Watchlist"
                >
                  <HiOutlineBookmark className="h-5 w-5" />
                </NavLink>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <HiOutlineUser className="h-5 w-5" />
                    <span className="max-w-[100px] truncate text-sm">
                      {user?.username}
                    </span>
                    <HiChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border-dark bg-surface-dark shadow-xl">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <HiOutlineUser className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger/10"
                      >
                        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? (
              <HiXMark className="h-6 w-6" />
            ) : (
              <HiBars3 className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-border-dark transition-all duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={mobileLinkClass}
              onClick={closeMobile}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-border-dark" />

          {isAuthenticated ? (
            <>
              <NavLink
                to="/favorites"
                className={mobileLinkClass}
                onClick={closeMobile}
              >
                <span className="flex items-center gap-2">
                  <HiOutlineHeart className="h-5 w-5" />
                  Favorites
                </span>
              </NavLink>
              <NavLink
                to="/watchlist"
                className={mobileLinkClass}
                onClick={closeMobile}
              >
                <span className="flex items-center gap-2">
                  <HiOutlineBookmark className="h-5 w-5" />
                  Watchlist
                </span>
              </NavLink>
              <NavLink
                to="/profile"
                className={mobileLinkClass}
                onClick={closeMobile}
              >
                <span className="flex items-center gap-2">
                  <HiOutlineUser className="h-5 w-5" />
                  Profile
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-danger transition-colors hover:bg-danger/10"
              >
                <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobile}
                className="block rounded-lg px-4 py-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobile}
                className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
