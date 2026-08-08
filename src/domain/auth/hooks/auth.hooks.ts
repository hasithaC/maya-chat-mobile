import {useMutation} from '@tanstack/react-query';
import {tokenManager} from '../../../core/auth/token-manager';
import {authApi} from '../api/auth.api';
import {useAuthStore} from '../store/auth.store';
import type {
  LoginWithOTPRequest,
  RequestOTPRequest,
  SignUpPayload,
  VerifyOtpPayload,
} from '../types/auth.types';

export const useRequestOtp = () =>
  useMutation({
    mutationFn: (payload: RequestOTPRequest) => authApi.requestOtp(payload),
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
  });

export const useLoginWithOtp = () => {
  const setAuthenticated = useAuthStore(s => s.setAuthenticated);
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginWithOTPRequest) => authApi.loginWithOtp(payload),
    onSuccess: async response => {
      await tokenManager.setTokens(response);
      setUser(response.user);
      setAuthenticated(true);
    },
  });
};

export const useSignUp = () => {
  const setAuthenticated = useAuthStore(s => s.setAuthenticated);

  return useMutation({
    mutationFn: (payload: SignUpPayload) => authApi.signUp(payload),
    onSuccess: async response => {
      await tokenManager.setTokens(response);
      setAuthenticated(true);
    },
  });
};
