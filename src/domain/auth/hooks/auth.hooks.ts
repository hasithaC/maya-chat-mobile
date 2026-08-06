import {useMutation} from '@tanstack/react-query';
import {tokenManager} from '../../../core/auth/token-manager';
import {authApi} from '../api/auth.api';
import {useAuthStore} from '../store/auth.store';
import type {
  LoginWithOtpPayload,
  RequestOTPRequest,
  SignUpPayload,
  VerifyOtpPayload,
} from '../types/auth.types';

export const useRequestOtp = () => {
  const markOtpSent = useAuthStore(s => s.markOtpSent);

  return useMutation({
    mutationFn: (payload: RequestOTPRequest) => authApi.requestOtp(payload),
    onSuccess: () => markOtpSent(),
  });
};

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
  });

export const useLoginWithOtp = () => {
  const setAuthenticated = useAuthStore(s => s.setAuthenticated);

  return useMutation({
    mutationFn: (payload: LoginWithOtpPayload) => authApi.loginWithOtp(payload),
    onSuccess: async response => {
      await tokenManager.setTokens(response);
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
