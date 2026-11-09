import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthSession, AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
  updateUserName: (name: string) => void;
}

// sessionStorage is used (not localStorage) so the session ends when the tab closes.
// NOTE: any browser storage can be read by XSS attacks. Explain this in your README.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      signIn: (session) =>
        set({ user: session.user, token: session.token, expiresAt: session.expiresAt }),
      signOut: () => set({ user: null, token: null, expiresAt: null }),
      updateUserName: (name) =>
        set((state) => (state.user ? { user: { ...state.user, name } } : {})),
    }),
    {
      name: 'fitspace-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

// Helper: is there a logged-in user with a non-expired token?
export const isSessionValid = (state: AuthState): boolean =>
  state.user !== null && state.token !== null && (state.expiresAt ?? 0) > Date.now();