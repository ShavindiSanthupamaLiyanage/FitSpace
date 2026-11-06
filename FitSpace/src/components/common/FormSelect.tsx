import type { SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../../types';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  hideLabel?: boolean;
}

function FormSelect({ id, label, options, error, hideLabel = false, ...rest }: FormSelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className="form-group">
      <label htmlFor={id} className={hideLabel ? 'form-label visually-hidden' : 'form-label'}>
        {label}
      </label>
      <select
        id={id}
        className={`form-input form-select ${error ? 'has-error' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormSelect;