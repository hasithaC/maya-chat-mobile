import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  shadows,
  spacing,
} from "../../constants/tokens";

interface SheetOptionRowProps {
  icon: IconSvgElement;
  title: string;
  description: string;
  onPress?: () => void;
}

export function SheetOptionRow({
  icon,
  title,
  description,
  onPress,
}: SheetOptionRowProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconBadge}>
        <HugeiconsIcon icon={icon} size={iconSize.md} color={colors.textPrimary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  iconBadge: {
    width: controlHeight.md,
    height: controlHeight.md,
    borderRadius: controlHeight.md / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
