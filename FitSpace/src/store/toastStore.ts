import { create } from 'zustand';
import { DEFAULT_TOAST_DURATION, MAX_VISIBLE_TOASTS } from '../constants/toastSettings';
import type { ToastMessage, ToastOptions, ToastType } from '../types';

interface ToastState {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  removeToast: (id: number) => void;
}

let nextToastId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (type, message, options = {}) => {
    // Ignore an identical toast that is already on screen (for example a double-fired effect)
    const alreadyShowing = get().toasts.some(
      (toast) => toast.type === type && toast.message === message,
    );
    if (alreadyShowing) return;

    const newToast: ToastMessage = {
      id: nextToastId++,
      type,
      message,
      description: options.description,
      action: options.action,
      duration: options.duration ?? DEFAULT_TOAST_DURATION[type],
      surface: options.surface ?? 'light',
    };

    // Keep only the newest few so a burst of toasts can't cover the page
    set((state) => ({ toasts: [...state.toasts, newToast].slice(-MAX_VISIBLE_TOASTS) }));
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));