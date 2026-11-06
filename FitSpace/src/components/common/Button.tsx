// import type { ButtonHTMLAttributes } from 'react';
// import type { ButtonSize, ButtonVariant } from '../../types';
// import { buildButtonClassName } from '../../utils/buttonClasses';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   loading?: boolean;
// }

// function Button({
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   disabled,
//   children,
//   className = '',
//   type = 'button',
//   ...rest
// }: ButtonProps) {
//   return (
//     <button
//       type={type}
//       className={buildButtonClassName(variant, size, className)}
//       disabled={disabled || loading}
//       {...rest}
//     >
//       {loading ? 'Please wait...' : children}
//     </button>
//   );
// }

// export default Button;


import type { ButtonHTMLAttributes } from 'react';
import type { ButtonSize, ButtonVariant } from '../../types';
import { buildButtonClassName } from '../../utils/buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string; // shown next to the spinner while loading
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Please wait...',
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildButtonClassName(variant, size, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="btn-spinner" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;