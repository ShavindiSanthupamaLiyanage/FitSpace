import { create } from 'zustand';
import type { ToastMessage, ToastType } from '../types';

interface ToastState {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (type, message) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    // Auto-dismiss after 4 seconds
    setTimeout(() => get().removeToast(id), 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));