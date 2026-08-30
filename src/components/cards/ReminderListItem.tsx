import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  badgeSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";

interface ReminderListItemProps {
  icon: IconSvgElement;
  iconColor?: string;
  title: string;
  subtitle: string;
  time: string;
  date: string;
  assignedByAssistant?: boolean;
  completed?: boolean;
}

export function ReminderListItem({
  icon,
  iconColor = colors.textPrimary,
  title,
  subtitle,
  time,
  date,
  assignedByAssistant = false,
  completed = false,
}: ReminderListItemProps) {
  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <View style={styles.row}>
        <View style={styles.iconBadge}>
          <HugeiconsIcon icon={icon} size={iconSize.md} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {completed ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={badgeSize.lg}
            color={colors.success}
          />
        ) : assignedByAssistant ? (
          <View style={styles.assistantBadge}>
            <Text style={styles.assistantBadgeText}>By Personal Assistant</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.dateTime}>
        {time} <Text style={styles.dateTimeSeparator}>|</Text> {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  completedContainer: {
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBadge: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: avatarSize.sm / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundPrimary,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  subtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  assistantBadge: {
    height: badgeSize.lg,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    borderRadius: badgeSize.lg / 2,
    backgroundColor: colors.backgroundPrimary,
  },
  assistantBadgeText: {
    fontFamily: geist.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textLink,
  },
  dateTime: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  dateTimeSeparator: {
    color: withAlpha(colors.textSecondary, 0.5),
  },
});
