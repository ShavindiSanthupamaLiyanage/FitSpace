import { Link, Navigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import AuthShowcase from '../components/auth/AuthShowcase';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { isSessionValid, useAuthStore } from '../store/authStore';
import '../styles/auth.css';

function ForgotPasswordPage() {
  const alreadySignedIn = useAuthStore(isSessionValid);

  // A signed-in user has no reason to see this page
  if (alreadySignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <AuthShowcase
        firstLine="Never Miss"
        secondLine="A"
        accent="Beat."
        text="Recovery is part of the process. We'll help you get back into your rhythm in no time."
      />

      <section className="auth-panel">
        <div className="auth-card">
          <Link to="/login" className="auth-back-link">
            <MdArrowBack aria-hidden="true" />
            Back to Login
          </Link>

          <h1 className="auth-card-heading">Forgot Password?</h1>
          <p className="auth-card-description">
            Enter your registered email address to verify your account and set a new password.
          </p>

          <ForgotPasswordForm />
        </div>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;