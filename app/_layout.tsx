import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from '@expo-google-fonts/geist';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import {QueryClientProvider} from '@tanstack/react-query';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {authEvents} from '../src/core/auth/auth-events';
import {tokenManager} from '../src/core/auth/token-manager';
import {queryClient} from '../src/core/query/query-client';
import {authApi} from '../src/domain/auth/api/auth.api';
import {useAuthStore} from '../src/domain/auth/store/auth.store';

SplashScreen.preventAutoHideAsync();

function ForceLogoutBridge() {
  const logout = useAuthStore(s => s.logout);

  useEffect(() => authEvents.on('forceLogout', () => logout()), [logout]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const setAuthenticated = useAuthStore(s => s.setAuthenticated);
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);

  useEffect(() => {
    if (!fontsLoaded) return;

    (async () => {
      const accessToken = await tokenManager.getAccessToken();

      if (accessToken) {
        setAccessToken(accessToken);
        try {
          const user = await authApi.getMe();
          setUser(user);
          setAuthenticated(true);
        } catch {
          await logout();
        }
      } else {
        setAuthenticated(false);
      }

      setIsHydrated(true);
      await SplashScreen.hideAsync();
    })();
  }, [fontsLoaded, setAccessToken, setAuthenticated, setUser, logout]);

  if (!fontsLoaded || !isHydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ForceLogoutBridge />
        <Stack screenOptions={{headerShown: false}} />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
