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

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}