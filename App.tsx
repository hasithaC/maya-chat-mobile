import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import {QueryClientProvider} from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {authEvents} from './src/core/auth/auth-events';
import {queryClient} from './src/core/query/query-client';
import {SignInScreen} from './src/domain/auth/screens/SignInScreen';
import {useAuthStore} from './src/domain/auth/store/auth.store';

SplashScreen.preventAutoHideAsync();

function ForceLogoutBridge() {
  const logout = useAuthStore(s => s.logout);

  useEffect(() => authEvents.on('forceLogout', () => logout()), [logout]);

  return null;
}

function SignedInScreen() {
  const logout = useAuthStore(s => s.logout);

  return (
    <View style={styles.container}>
      <Text>You're signed in.</Text>
      <Pressable style={styles.signOutButton} onPress={() => logout()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ForceLogoutBridge />
        {isAuthenticated ? <SignedInScreen /> : <SignInScreen />}
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
