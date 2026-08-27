import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  borderWidth,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface SettingsRowProps {
  icon?: IconSvgElement;
  iconColor?: string;
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}

export function SettingsRow({
  icon,
  iconColor = colors.textPrimary,
  label,
  disabled = false,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[styles.container, disabled && styles.disabled]}
    >
      {icon ? (
        <HugeiconsIcon icon={icon} size={iconSize.md} color={iconColor} />
      ) : null}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <HugeiconsIcon
        icon={ChevronRightIcon}
        size={iconSize.md}
        color={colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    flex: 1,
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
});
