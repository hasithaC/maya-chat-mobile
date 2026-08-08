import {create} from 'zustand';
import {logger} from '../../../core/store/logger';
import {queryClient} from '../../../core/query/query-client';
import {tokenManager} from '../../../core/auth/token-manager';
import type {User} from '../types/auth.types';

interface AuthState {
  // ── State ──
  isAuthenticated: boolean;
  user: User | null;
  verifyToken: string | null;

  // ── Actions ──
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User) => void;
  setVerifyToken: (verifyToken: string | null) => void;
  logout: () => Promise<void>;
}

const initialState = {
  isAuthenticated: false,
  user: null as User | null,
  verifyToken: null as string | null,
};

export const useAuthStore = create<AuthState>()(
  logger(
    set => ({
      ...initialState,

      setAuthenticated: isAuthenticated => set({isAuthenticated}),

      setUser: user => set({user}),

      setVerifyToken: verifyToken => set({verifyToken}),

      logout: async () => {
        await tokenManager.clearTokens();
        queryClient.clear();
        set({...initialState});
      },
    }),
    'AuthStore',
  ),
);
