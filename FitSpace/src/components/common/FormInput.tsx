import type { InputHTMLAttributes, ReactNode } from 'react';

type HintTone = 'neutral' | 'success';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string; // optional helper or status text under the input
  hintTone?: HintTone;
  labelAction?: ReactNode; // optional extra element on the right of the label
  hideLabel?: boolean; // keeps the label for screen readers but hides it visually
}

function FormInput({
  id,
  label,
  error,
  hint,
  hintTone = 'neutral',
  labelAction,
  hideLabel = false,
  ...rest
}: FormInputProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  let describedBy: string | undefined;
  if (error) {
    describedBy = errorId;
  } else if (hint) {
    describedBy = hintId;
  }

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label htmlFor={id} className={hideLabel ? 'form-label visually-hidden' : 'form-label'}>
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={id}
        className={`form-input ${error ? 'has-error' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className={`form-hint form-hint-${hintTone}`} aria-live="polite">
          {hint}
        </p>
      )}
    </div>
  );
}

export default FormInput;