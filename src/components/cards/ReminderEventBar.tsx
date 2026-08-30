import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderRadius,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";
import type { CalendarSourceKind } from "../../domain/device-calendar/types/device-calendar.types";
import { CalendarSourceBadge } from "./CalendarSourceBadge";

interface ReminderEventBarProps {
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  color: string;
  sourceKind?: CalendarSourceKind;
  style?: StyleProp<ViewStyle>;
}

export function ReminderEventBar({
  icon,
  title,
  subtitle,
  color,
  sourceKind,
  style,
}: ReminderEventBarProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: withAlpha(color, 0.16) }, style]}
    >
      <View style={[styles.iconBadge, { backgroundColor: colors.backgroundPrimary }]}>
        <HugeiconsIcon icon={icon} size={iconSize.sm} color={color} />
        {sourceKind ? (
          <View style={styles.sourceBadge}>
            <CalendarSourceBadge sourceKind={sourceKind} size={14} />
          </View>
        ) : null}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  iconBadge: {
    position: "relative",
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceBadge: {
    position: "absolute",
    right: -spacing.xs / 2,
    bottom: -spacing.xs / 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  subtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
});
