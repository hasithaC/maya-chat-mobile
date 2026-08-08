import {useLocalSearchParams, useRouter} from 'expo-router';
import {SignInOTPValidationScreen} from '../../src/domain/auth/screens/SignInOTPValidationScreen';

export default function OtpRoute() {
  const router = useRouter();
  const {identifier = '', identifierType = 'email'} = useLocalSearchParams<{
    identifier: string;
    identifierType: 'mobile' | 'email';
  }>();

  return (
    <SignInOTPValidationScreen
      identifier={identifier}
      identifierType={identifierType}
    />
  );
}
