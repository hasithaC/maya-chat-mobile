import {useLocalSearchParams} from 'expo-router';
import {AccountCreationScreen} from '../../src/domain/auth/screens/AccountCreationScreen';

export default function AccountCreationRoute() {
  const {identifier = ''} = useLocalSearchParams<{identifier: string}>();

  return <AccountCreationScreen phone={identifier} />;
}
