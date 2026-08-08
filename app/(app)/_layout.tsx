import {Redirect, Stack} from 'expo-router';
import {useAuthStore} from '../../src/domain/auth/store/auth.store';

export default function AppLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{headerShown: false}} />;
}
