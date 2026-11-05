import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../store/authStore.ts';
import { useToastStore } from '../../store/toastStore';
import ConfirmDialog from '../common/ConfirmDialog';
import type { Role } from '../../types';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

// One place that decides which links each type of user sees
const getNavLinks = (role?: Role): NavItem[] => {
  const common: NavItem[] = [
    { to: '/', label: 'Home', end: true },
    { to: '/classes', label: 'Explore Classes' },
  ];

  if (role === 'admin') {
    return [
      ...common,
      { to: '/profile', label: 'My Profile' },
      { to: '/my-bookings', label: 'My Bookings' },
      { to: '/admin/classes', label: 'Manage Classes' },
    ];
  }

  if (role === 'member') {
    return [
      ...common,
      { to: '/my-bookings', label: 'My Bookings' },
      { to: '/profile', label: 'My Profile' },
    ];
  }

  return common; // guest
};

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const showToast = useToastStore((state) => state.showToast);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const links = getNavLinks(user?.role);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    signOut();
    setConfirmOpen(false);
    closeMenu();
    showToast('success', 'Signed out', { description: 'See you at your next class.' });
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu} aria-label="FitSpace home">
          <img src={logo} alt="FitSpace - Find Your Class. Book Your Fitness." />
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav aria-label="Main navigation">
          <ul id="main-menu" className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li>
              {user ? (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setConfirmOpen(true)}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out?"
        message="Are you sure you want to log out of FitSpace?"
        confirmText="Yes, log out"
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  );
}

export default Navbar;