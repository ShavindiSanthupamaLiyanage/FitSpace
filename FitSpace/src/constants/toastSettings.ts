import type { ToastDuration, ToastType } from '../types';

// Keep these values in step with the animation-duration rules in styles/toast.css
export const TOAST_DURATION_MS: Record<ToastDuration, number> = {
  short: 3000,
  normal: 4500,
  long: 7000,
  persistent: 0, // stays until the user dismisses it
};

// Problems get more time on screen than confirmations
export const DEFAULT_TOAST_DURATION: Record<ToastType, ToastDuration> = {
  success: 'normal',
  info: 'normal',
  warning: 'long',
  error: 'long',
};

export const MAX_VISIBLE_TOASTS = 4;