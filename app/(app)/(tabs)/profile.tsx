import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaContainer} from '../../../src/components';
import {
  borderRadius,
  colors,
  fontSize,
  lineHeight,
  primaryFontFamily,
  spacing,
} from '../../../src/constants/tokens';
import {useAuthStore} from '../../../src/domain/auth/store/auth.store';

export default function ProfileScreen() {
  const logout = useAuthStore(s => s.logout);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.text}>Profile</Text>
        <Pressable style={styles.signOutButton} onPress={() => logout()}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.backgroundPrimary,
  },
  text: {
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    color: colors.textPrimary,
  },
  signOutButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.buttonDanger,
    borderRadius: borderRadius.full,
  },
  signOutText: {
    fontFamily: primaryFontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
});
