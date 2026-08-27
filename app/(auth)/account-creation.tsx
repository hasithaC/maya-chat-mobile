import {useLocalSearchParams} from 'expo-router';
import {StyleSheet, Text, View} from 'react-native';
import {colors, fontSize, lineHeight, manrope, spacing} from '../../src/constants/tokens';
import {useAuthStore} from '../../src/domain/auth/store/auth.store';

// Placeholder until the real account-creation screen (name/persona/etc.) is built.
export default function AccountCreationRoute() {
  const {identifier} = useLocalSearchParams<{identifier: string}>();
  const verifyToken = useAuthStore(s => s.verifyToken);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Account creation for {identifier}</Text>
      <Text style={styles.token}>verifyToken: {verifyToken}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  text: {
    fontFamily: manrope.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  token: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
