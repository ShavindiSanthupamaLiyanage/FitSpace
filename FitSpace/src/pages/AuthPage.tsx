import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthShowcase from '../components/auth/AuthShowcase';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { isSessionValid, useAuthStore } from '../store/authStore';
import '../styles/auth.css';

type AuthMode = 'login' | 'register';

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const alreadySignedIn = useAuthStore(isSessionValid);

  // A signed-in user has no reason to see this page
  if (alreadySignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <AuthShowcase
        firstLine="Transform"
        secondLine="Your"
        accent="Pulse."
        text="Join thousands of others in the most dynamic fitness community. Book classes, track progress, and reach your goals."
      />

      <section className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-card-title">{mode === 'login' ? 'Welcome Back' : 'Join FitSpace'}</h1>

          <div className="auth-tabs" role="tablist" aria-label="Sign in or sign up">
            <button
              type="button"
              role="tab"
              id="auth-tab-login"
              className="auth-tab"
              aria-selected={mode === 'login'}
              aria-controls="auth-tab-panel"
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              id="auth-tab-register"
              className="auth-tab"
              aria-selected={mode === 'register'}
              aria-controls="auth-tab-panel"
              onClick={() => setMode('register')}
            >
              Sign Up
            </button>
          </div>

          <div
            role="tabpanel"
            id="auth-tab-panel"
            aria-labelledby={mode === 'login' ? 'auth-tab-login' : 'auth-tab-register'}
          >
            {mode === 'login' ? (
              <LoginForm />
            ) : (
              <RegisterForm onRegistered={() => setMode('login')} />
            )}
          </div>

          <p className="auth-terms">
            By continuing, you agree to our <Link to="/terms-of-service">Terms of Service</Link> and{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AuthPage;