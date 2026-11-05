import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from '../common/ToastContainer';
import type { ScrollTargetState } from '../../types';

function Layout() {
  const { pathname, state } = useLocation();
  const hasScrollTarget = Boolean((state as ScrollTargetState | null)?.scrollTo);

  useEffect(() => {
    // Pages that scroll to one of their own sections (like Contact Us) skip the jump to top
    if (!hasScrollTarget) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hasScrollTarget]);

  // Moves keyboard focus to the main content without touching the URL hash
  const skipToMain = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link" onClick={skipToMain}>
        Skip to main content
      </a>
      <Navbar />
      <ToastContainer />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;