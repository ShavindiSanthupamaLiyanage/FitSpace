export type Role = 'member' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  mockPassword: string;
}

// The user object we keep in the app (never includes the password)
export type AuthUser = Omit<User, 'mockPassword'>;

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number; // timestamp in milliseconds
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastSurface = 'light' | 'dark';
export type ToastDuration = 'short' | 'normal' | 'long' | 'persistent';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: ToastDuration;
  surface?: ToastSurface;
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
  action?: ToastAction;
  duration: ToastDuration;
  surface: ToastSurface;
}

export type ClassCategoryName = 'Yoga' | 'HIIT' | 'Spin' | 'Pilates' | 'Boxing' | 'Zumba';

export interface ScrollTargetState {
  scrollTo?: string; // id of the section to scroll to after navigating
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}