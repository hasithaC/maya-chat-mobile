import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const ACCESS_TOKEN_EXPIRES_KEY = 'auth.accessTokenExpiresIn';
const REFRESH_TOKEN_EXPIRES_KEY = 'auth.refreshTokenExpiresIn';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}

export const tokenManager = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    const writes = [
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ];

    if (tokens.accessTokenExpiresIn) {
      writes.push(
        SecureStore.setItemAsync(
          ACCESS_TOKEN_EXPIRES_KEY,
          tokens.accessTokenExpiresIn,
        ),
      );
    }

    if (tokens.refreshTokenExpiresIn) {
      writes.push(
        SecureStore.setItemAsync(
          REFRESH_TOKEN_EXPIRES_KEY,
          tokens.refreshTokenExpiresIn,
        ),
      );
    }

    await Promise.all(writes);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRES_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRES_KEY),
    ]);
  },
};
