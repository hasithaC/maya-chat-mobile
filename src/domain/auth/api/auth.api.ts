import {apiClient} from '../../../core/api/api-client';
import type {
  AuthResponse,
  LoginWithOTPRequest,
  LoginWithOTPResponse,
  RequestOTPRequest,
  RequestOTPResponse,
  SignUpPayload,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../types/auth.types';

const ENDPOINTS = {
  REQUEST_OTP: '/api/v1/auth/send-otp',
  VERIFY_OTP: '/api/v1/auth/verify-otp',
  LOGIN_WITH_OTP: '/api/v1/auth/login',
  SIGN_UP: '/api/v1/auth/signup',
};

export const authApi = {
  requestOtp: (payload: RequestOTPRequest) =>
    apiClient
      .post<RequestOTPResponse>(ENDPOINTS.REQUEST_OTP, payload)
      .then(res => res.data),

  verifyOtp: (payload: VerifyOTPRequest) =>
    apiClient
      .post<VerifyOTPResponse>(ENDPOINTS.VERIFY_OTP, payload)
      .then(res => res.data),

  loginWithOtp: (payload: LoginWithOTPRequest) =>
    apiClient
      .post<LoginWithOTPResponse>(ENDPOINTS.LOGIN_WITH_OTP, payload)
      .then(res => res.data),

  signUp: (payload: SignUpPayload) =>
    apiClient
      .post<AuthResponse>(ENDPOINTS.SIGN_UP, payload)
      .then(res => res.data),
};
