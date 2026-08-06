import {create} from 'zustand';
import {logger} from '../../../core/store/logger';
import {queryClient} from '../../../core/query/query-client';
import {tokenManager} from '../../../core/auth/token-manager';

export type AuthStatus = 'idle' | 'otpSent' | 'authenticated';

interface AuthState {
  // ── State ──
  status: AuthStatus;
  phoneNumber: string | null;
  isAuthenticated: boolean;

  // ── Actions ──
  setPhoneNumber: (phoneNumber: string) => void;
  markOtpSent: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  status: 'idle' as AuthStatus,
  phoneNumber: null as string | null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  logger(
    set => ({
      ...initialState,

      setPhoneNumber: phoneNumber => set({phoneNumber}),

      markOtpSent: () => set({status: 'otpSent'}),

      setAuthenticated: isAuthenticated =>
        set({
          isAuthenticated,
          status: isAuthenticated ? 'authenticated' : 'idle',
        }),

      logout: async () => {
        await tokenManager.clearTokens();
        queryClient.clear();
        set({...initialState});
      },

      reset: () => set({...initialState}),
    }),
    'AuthStore',
  ),
);
