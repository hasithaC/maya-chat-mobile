export interface RequestOTPRequest {
  type: 'mobile' | 'email';
  value: string;
}

export interface RequestOTPResponse {
  message: string;
  isNewUser: boolean;
}

export interface VerifyOTPRequest {
  type: 'mobile' | 'email';
  value: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  verifyToken: string;
}

export interface LoginWithOTPRequest {
  type: 'mobile' | 'email';
  value: string;
  otp: string;
}

export interface LoginWithOTPResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  message: string;
  user: User;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  phone: string;
  verifyToken: string;
  avatarUrl?: string;
  industry: string;
}

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  message: string;
  user: User;
}

export interface PresignAvatarUploadRequest {
  verifyToken: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PresignAvatarUploadResponse {
  uploadUrl: string;
  s3Key: string;
  publicUrl: string;
  expiresIn: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: any;
  voiceUrl: any;
  phone: any;
  identity: any;
  persona: any;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerifiedAt: string;
  phoneVerifiedAt: any;
  createdAt: string;
  updatedAt: string;
}
