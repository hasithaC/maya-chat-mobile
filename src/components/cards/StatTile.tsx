import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderRadius,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";

interface StatTileProps {
  icon: IconSvgElement;
  color: string;
  count: number;
  label: string;
}

export function StatTile({ icon, color, count, label }: StatTileProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: withAlpha(color, 0.08) }]}
    >
      <View
        style={[styles.iconBadge, { backgroundColor: withAlpha(color, 0.2) }]}
      >
        <HugeiconsIcon icon={icon} size={iconSize.md} color={color} />
      </View>
      <View>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: controlHeight.md,
    height: controlHeight.md,
    borderRadius: controlHeight.md / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
