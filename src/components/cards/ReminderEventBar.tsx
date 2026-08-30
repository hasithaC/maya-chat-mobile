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

interface ReminderEventBarProps {
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export function ReminderEventBar({
  icon,
  title,
  subtitle,
  color,
  style,
}: ReminderEventBarProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: withAlpha(color, 0.16) }, style]}
    >
      <View style={[styles.iconBadge, { backgroundColor: colors.backgroundPrimary }]}>
        <HugeiconsIcon icon={icon} size={iconSize.sm} color={color} />
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
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    alignItems: "center",
    justifyContent: "center",
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
