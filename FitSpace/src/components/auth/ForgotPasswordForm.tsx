import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { emailExists, resetPassword } from '../../services/authService';
import { useToastStore } from '../../store/toastStore';
import { validateConfirmPassword, validateEmail, validatePassword } from '../../utils/validators';

type FieldName = 'email' | 'newPassword' | 'confirmPassword';
type EmailStatus = 'idle' | 'checking' | 'found' | 'not-found' | 'error';

interface EmailLookup {
  email: string;
  exists: boolean | null; // null means the lookup itself failed
}

const EMAIL_CHECK_DELAY_MS = 300;

// Works out what the email field should say, from the typed value and the latest lookup result
const getEmailStatus = (
  formatError: string,
  lookup: EmailLookup | null,
  email: string,
): EmailStatus => {
  if (formatError) return 'idle';
  if (lookup === null || lookup.email !== email) return 'checking';
  if (lookup.exists === null) return 'error';
  return lookup.exists ? 'found' : 'not-found';
};

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [values, setValues] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [lookup, setLookup] = useState<EmailLookup | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const normalisedEmail = values.email.trim().toLowerCase();

  // Look the email up in the JSON data once the user pauses typing
  useEffect(() => {
    if (validateEmail(normalisedEmail)) return undefined; // not a valid address yet

    let cancelled = false;
    const timerId = window.setTimeout(async () => {
      try {
        const exists = await emailExists(normalisedEmail);
        if (!cancelled) setLookup({ email: normalisedEmail, exists });
      } catch {
        if (!cancelled) setLookup({ email: normalisedEmail, exists: null });
      }
    }, EMAIL_CHECK_DELAY_MS);

    // Ignore results from an older email if the user has kept typing
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [normalisedEmail]);

  const emailFormatError = validateEmail(values.email);
  const emailStatus = getEmailStatus(emailFormatError, lookup, normalisedEmail);
  const passwordFieldsEnabled = emailStatus === 'found';

  let emailError = '';
  let emailHint = '';
  if (touched.email && emailFormatError) {
    emailError = emailFormatError;
  } else if (emailStatus === 'not-found') {
    emailError = 'No account found with this email address';
  } else if (emailStatus === 'error') {
    emailError = 'We could not check this email. Please try again';
  } else if (emailStatus === 'checking') {
    emailHint = 'Checking your account...';
  } else if (emailStatus === 'found') {
    emailHint = 'Account found. You can set a new password now.';
  }

  const passwordErrors = {
    newPassword: validatePassword(values.newPassword),
    confirmPassword: validateConfirmPassword(values.newPassword, values.confirmPassword),
  };
  const canSubmit =
    passwordFieldsEnabled && !passwordErrors.newPassword && !passwordErrors.confirmPassword;

  const handleChange = (field: FieldName, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleBlur = (field: FieldName) =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setFormError('');
    try {
      await resetPassword(normalisedEmail, values.newPassword);
      showToast('success', 'Password changed', { description: 'Sign in with your new password.' });
      navigate('/login', { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong');
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
        id="forgot-email"
        label="Email Address"
        type="email"
        placeholder="name@email.com"
        autoComplete="email"
        value={values.email}
        onChange={(event) => handleChange('email', event.target.value)}
        onBlur={() => handleBlur('email')}
        error={emailError}
        hint={emailHint}
        hintTone={emailStatus === 'found' ? 'success' : 'neutral'}
      />
      <FormInput
        id="forgot-new-password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        disabled={!passwordFieldsEnabled}
        value={values.newPassword}
        onChange={(event) => handleChange('newPassword', event.target.value)}
        onBlur={() => handleBlur('newPassword')}
        error={touched.newPassword ? passwordErrors.newPassword : ''}
      />
      <FormInput
        id="forgot-confirm-password"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        disabled={!passwordFieldsEnabled}
        value={values.confirmPassword}
        onChange={(event) => handleChange('confirmPassword', event.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        error={touched.confirmPassword ? passwordErrors.confirmPassword : ''}
      />

      <Button type="submit" loading={submitting} disabled={!canSubmit} className="btn-block">
        Change Password
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;