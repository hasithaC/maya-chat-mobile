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

export interface LoginWithOtpPayload {
  phoneNumber: string;
  otp: string;
}

export interface SignUpPayload {
  phoneNumber: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  phoneNumber: string;
  name?: string;
}

export type AuthResponse = AuthTokens & {
  user?: AuthUser;
};
