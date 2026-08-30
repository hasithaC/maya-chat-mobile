import {
  AppleIcon,
  Calendar01Icon,
  GoogleIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, View } from "react-native";
import type { CalendarSourceKind } from "../../domain/device-calendar/types/device-calendar.types";
import { colors, borderRadius, borderWidth } from "../../constants/tokens";

interface CalendarSourceBadgeProps {
  sourceKind: CalendarSourceKind;
  size?: number;
}

const SOURCE_ICON: Record<CalendarSourceKind, IconSvgElement> = {
  google: GoogleIcon,
  apple: AppleIcon,
  device: SmartPhone01Icon,
  other: Calendar01Icon,
};

export function CalendarSourceBadge({
  sourceKind,
  size = 16,
}: CalendarSourceBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <HugeiconsIcon
        icon={SOURCE_ICON[sourceKind]}
        size={size * 0.6}
        color={colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundPrimary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
  },
});
