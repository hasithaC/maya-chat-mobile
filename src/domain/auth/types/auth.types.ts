export interface RequestOTPRequest {
  type: 'mobile' | 'email';
  value: string;
}

export interface RequestOTPResponse {
  message: string;
  isNewUser: boolean;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  otp: string;
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

export interface SignUpPayload {
  phoneNumber: string;
  name: string;
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

export type AuthResponse = AuthTokens & {
  user?: User;
};
