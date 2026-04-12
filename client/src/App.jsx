import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import GuestOnlyRoute from './components/guards/GuestOnlyRoute';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PopularPage from './pages/PopularPage';
import TopRatedPage from './pages/TopRatedPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="popular" element={<PopularPage />} />
        <Route path="top-rated" element={<TopRatedPage />} />
        <Route path=":mediaType/:id" element={<DetailPage />} />

        {/* Protected Routes — requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Guest Only Routes — redirects to home if authenticated */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
