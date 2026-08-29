import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "../../src/components";
import {
  colors,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../src/constants/tokens";

export default function TrainMayaScreen() {
  const insets = useSafeAreaInsets();
  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.header}>
        <BackHeader title="Train Maya" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Training Maya</Text>
        <Text style={styles.subtitle}>
          This is where you'll teach Maya your voice, preferences, and
          working style. Coming soon.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize["2xl"],
    lineHeight: lineHeight["2xl"],
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: manrope.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
