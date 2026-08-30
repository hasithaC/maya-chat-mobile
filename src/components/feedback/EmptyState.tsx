import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, geist, lineHeight, manrope, spacing } from "../../constants/tokens";

interface EmptyStateProps {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

export function EmptyState({ image, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
