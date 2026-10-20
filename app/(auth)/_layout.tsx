import {Redirect, Stack} from 'expo-router';
import {ROUTES} from '../../src/constants/routes';
import {useAuthStore} from '../../src/domain/auth/store/auth.store';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.dashboard} />;
  }

  return <Stack screenOptions={{headerShown: false}} />;
}
