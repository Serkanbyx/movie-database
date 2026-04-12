import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark text-text-dark">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1b4b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#22c55e', secondary: '#e2e8f0' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#ef4444', secondary: '#e2e8f0' },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
