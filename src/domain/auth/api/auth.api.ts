import {apiClient} from '../../../core/api/api-client';
import type {
  LoginWithOTPRequest,
  LoginWithOTPResponse,
  PresignAvatarUploadRequest,
  PresignAvatarUploadResponse,
  RequestOTPRequest,
  RequestOTPResponse,
  SignUpRequest,
  SignUpResponse,
  User,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../types/auth.types';

const ENDPOINTS = {
  REQUEST_OTP: '/api/v1/auth/send-otp',
  VERIFY_OTP: '/api/v1/auth/verify-otp',
  LOGIN_WITH_OTP: '/api/v1/auth/login',
  SIGN_UP: '/api/v1/auth/signup',
  ME: '/api/v1/auth/me',
  PRESIGN_AVATAR_UPLOAD: '/api/v1/users/profile/presign-upload',
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

  signUp: (payload: SignUpRequest) =>
    apiClient
      .post<SignUpResponse>(ENDPOINTS.SIGN_UP, payload)
      .then(res => res.data),

  presignAvatarUpload: (payload: PresignAvatarUploadRequest) =>
    apiClient
      .post<PresignAvatarUploadResponse>(ENDPOINTS.PRESIGN_AVATAR_UPLOAD, {
        uploadType: 'avatar',
        fileName: payload.fileName,
        fileType: payload.fileType,
        fileSize: payload.fileSize,
        verifyToken: payload.verifyToken,
      })
      .then(res => res.data),

  getMe: () => apiClient.get<User>(ENDPOINTS.ME).then(res => res.data),
};
