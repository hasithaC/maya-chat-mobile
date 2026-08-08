import {useLocalSearchParams} from 'expo-router';
import {SignUpOTPValidationScreen} from '../../src/domain/auth/screens/SignUpOTPValidationScreen';

export default function SignUpOtpRoute() {
  const {identifier = '', identifierType = 'mobile'} = useLocalSearchParams<{
    identifier: string;
    identifierType: 'mobile' | 'email';
  }>();

  return (
    <SignUpOTPValidationScreen
      identifier={identifier}
      identifierType={identifierType}
    />
  );
}
