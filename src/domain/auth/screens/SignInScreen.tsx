import {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  KeyboardAwareScrollContainer,
  SafeAreaContainer,
} from '../../../components';
import {useLoginWithOtp, useRequestOtp} from '../hooks/auth.hooks';
import {useAuthStore} from '../store/auth.store';

export function SignInScreen() {
  const status = useAuthStore(s => s.status);
  const submittedPhoneNumber = useAuthStore(s => s.phoneNumber);
  const setPhoneNumber = useAuthStore(s => s.setPhoneNumber);
  const reset = useAuthStore(s => s.reset);

  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const requestOtp = useRequestOtp();
  const loginWithOtp = useLoginWithOtp();

  const isOtpStep = status === 'otpSent';

  const handleSendOtp = () => {
    const phoneNumber = phoneInput.trim();
    if (!phoneNumber) return;
    setPhoneNumber(phoneNumber);
    requestOtp.mutate({type: 'mobile', value: phoneNumber});
  };

  const handleVerify = () => {
    const otp = otpInput.trim();
    if (!submittedPhoneNumber || !otp) return;
    loginWithOtp.mutate({phoneNumber: submittedPhoneNumber, otp});
  };

  const handleUseDifferentNumber = () => {
    setOtpInput('');
    reset();
  };

  return (
    <SafeAreaContainer style={styles.container}>
      <KeyboardAwareScrollContainer contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sign in</Text>

        {!isOtpStep ? (
          <View>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="+1 555 123 4567"
              keyboardType="phone-pad"
              autoComplete="tel"
              editable={!requestOtp.isPending}
            />

            {requestOtp.isError ? (
              <Text style={styles.error}>{requestOtp.error.message}</Text>
            ) : null}

            <Pressable
              style={[
                styles.button,
                (requestOtp.isPending || !phoneInput.trim()) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={requestOtp.isPending || !phoneInput.trim()}>
              {requestOtp.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send code</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>
              Enter the code sent to {submittedPhoneNumber}
            </Text>
            <TextInput
              style={styles.input}
              value={otpInput}
              onChangeText={setOtpInput}
              placeholder="6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              editable={!loginWithOtp.isPending}
            />

            {loginWithOtp.isError ? (
              <Text style={styles.error}>{loginWithOtp.error.message}</Text>
            ) : null}

            <Pressable
              style={[
                styles.button,
                (loginWithOtp.isPending || !otpInput.trim()) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loginWithOtp.isPending || !otpInput.trim()}>
              {loginWithOtp.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & sign in</Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleUseDifferentNumber}
              style={styles.linkButton}>
              <Text style={styles.linkText}>Use a different number</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
  },
});
