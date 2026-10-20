import {Redirect} from 'expo-router';
import {ROUTES} from '../src/constants/routes';
import {useAuthStore} from '../src/domain/auth/store/auth.store';

export default function Index() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <Redirect href={isAuthenticated ? ROUTES.dashboard : '/(auth)/sign-in'} />
  );
}
