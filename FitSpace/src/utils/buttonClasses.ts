import type { ButtonSize, ButtonVariant } from '../types';

export const buildButtonClassName = (
  variant: ButtonVariant,
  size: ButtonSize,
  extraClassName = '',
): string =>
  ['btn', `btn-${variant}`, size === 'md' ? '' : `btn-${size}`, extraClassName]
    .filter(Boolean)
    .join(' ');