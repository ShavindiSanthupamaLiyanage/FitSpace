import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isSessionValid, useAuthStore } from '../../store/authStore.ts';
import { useToastStore } from '../../store/toastStore';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[]; // if omitted, any logged-in user can enter
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const valid = useAuthStore(isSessionValid);
  const signOut = useAuthStore((state) => state.signOut);
  const showToast = useToastStore((state) => state.showToast);

  // A user exists but the token has expired -> clear the session
  useEffect(() => {
    if (user && !valid) {
      signOut();
      showToast('warning', 'Session expired', { description: 'Please sign in again to continue.' });
    }
  }, [user, valid, signOut, showToast]);

  if (!user || !valid) {
    // Remember where the user wanted to go so we can send them back after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;