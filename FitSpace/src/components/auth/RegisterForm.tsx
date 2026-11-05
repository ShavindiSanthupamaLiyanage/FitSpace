import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { register } from '../../services/authService';
import { useToastStore } from '../../store/toastStore';
import { validateEmail, validateName, validatePassword } from '../../utils/validators';

interface RegisterFormProps {
  onRegistered: () => void; // called after success so the page can switch to Sign In
}

type FieldName = 'name' | 'email' | 'password';

function RegisterForm({ onRegistered }: RegisterFormProps) {
  const showToast = useToastStore((state) => state.showToast);

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const errors: Record<FieldName, string> = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
  const isValid = Object.values(errors).every((message) => message === '');

  const handleChange = (field: FieldName, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleBlur = (field: FieldName) =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setFormError('');
    try {
      await register(values.name, values.email, values.password);
      showToast('success', 'Account created', { description: 'You can sign in now.' });
      onRegistered();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <p className="form-alert" role="alert">
          {formError}
        </p>
      )}

      <FormInput
        id="register-name"
        label="Full Name"
        placeholder="Enter your name"
        autoComplete="name"
        value={values.name}
        onChange={(event) => handleChange('name', event.target.value)}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : ''}
      />
      <FormInput
        id="register-email"
        label="Email Address"
        type="email"
        placeholder="name@email.com"
        autoComplete="email"
        value={values.email}
        onChange={(event) => handleChange('email', event.target.value)}
        onBlur={() => handleBlur('email')}
        error={touched.email ? errors.email : ''}
      />
      <FormInput
        id="register-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => handleChange('password', event.target.value)}
        onBlur={() => handleBlur('password')}
        error={touched.password ? errors.password : ''}
      />

      <Button type="submit" loading={submitting} disabled={!isValid} className="btn-block">
        Create FitSpace Account
      </Button>
    </form>
  );
}

export default RegisterForm;