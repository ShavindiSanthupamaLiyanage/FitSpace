import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ClassesPage from './pages/ClassesPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import BookClassPage from './pages/BookClassPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import ManageClassesPage from './pages/ManageClassesPage';
import NotFoundPage from './pages/NotFoundPage';
import UnderConstruction from './components/common/UnderConstruction';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/classes/:id" element={<ClassDetailsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Footer pages: placeholders until the real content is written */}
        <Route path="/about" element={<UnderConstruction title="About Us" />} />
        <Route path="/contact" element={<UnderConstruction title="Contact Us" />} />
        <Route path="/privacy-policy" element={<UnderConstruction title="Privacy Policy" />} />
        <Route path="/terms-of-service" element={<UnderConstruction title="Terms of Service" />} />
      
        <Route path="/sitemap" element={<UnderConstruction title="Sitemap" />} />

        {/* Any logged-in user (member or admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/classes/:id/book" element={<BookClassPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/classes" element={<ManageClassesPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;