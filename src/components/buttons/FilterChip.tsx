import { Pressable, StyleSheet, Text } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function FilterChip({
  label,
  selected = false,
  onPress,
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  chipSelected: {
    borderWidth: borderWidth.thin,
    borderColor: colors.borderAccent,
    backgroundColor: colors.backgroundAccent,
  },
  label: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.textPrimary,
  },
});
