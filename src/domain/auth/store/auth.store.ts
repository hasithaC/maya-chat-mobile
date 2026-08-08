import {create} from 'zustand';
import {logger} from '../../../core/store/logger';
import {queryClient} from '../../../core/query/query-client';
import {tokenManager} from '../../../core/auth/token-manager';

interface AuthState {
  // ── State ──
  isAuthenticated: boolean;

  // ── Actions ──
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => Promise<void>;
}

const initialState = {
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  logger(
    set => ({
      ...initialState,

      setAuthenticated: isAuthenticated => set({isAuthenticated}),

      logout: async () => {
        await tokenManager.clearTokens();
        queryClient.clear();
        set({...initialState});
      },
    }),
    'AuthStore',
  ),
);
