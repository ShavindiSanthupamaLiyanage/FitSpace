import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { login } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { validateEmail, validatePassword } from '../../utils/validators';

interface LocationState {
  from?: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from ?? '/';

  const signIn = useAuthStore((state) => state.signIn);
  const showToast = useToastStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  const isValid = !errors.email && !errors.password;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setFormError('');
    try {
      const session = await login(email, password);
      signIn(session);
      showToast('success', `Welcome back, ${session.user.name}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {redirectTo !== '/' && <p className="form-info">Please sign in to continue.</p>}
      {formError && (
        <p className="form-alert" role="alert">
          {formError}
        </p>
      )}

      <FormInput
        id="login-email"
        label="Email Address"
        type="email"
        placeholder="name@email.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setTouched((previous) => ({ ...previous, email: true }))}
        error={touched.email ? errors.email : ''}
      />
      <FormInput
        id="login-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onBlur={() => setTouched((previous) => ({ ...previous, password: true }))}
        error={touched.password ? errors.password : ''}
        labelAction={
          <Link to="/forgot-password" className="auth-forgot-link">
            Forgot password?
          </Link>
        }
      />

      <Button type="submit" loading={submitting} disabled={!isValid} className="btn-block">
        Sign in to FitSpace
      </Button>
    </form>
  );
}

export default LoginForm;