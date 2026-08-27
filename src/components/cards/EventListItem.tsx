import { BellIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderRadius,
  colors,
  fontSize,
  iconSize,
  lineHeight,
  palette,
  manrope,
  geist,
  spacing,
  withAlpha,
} from "../../constants/tokens";
import { AvatarStack } from "./AvatarStack";

interface EventListItemProps {
  time: string;
  reminderMinutes?: number;
  icon: IconSvgElement;
  subtitle: string;
  title: string;
  participantsCount: number;
}

const URGENT_THRESHOLD_MINUTES = 15;
const SOON_THRESHOLD_MINUTES = 60;

function getReminderColor(minutes: number) {
  if (minutes <= URGENT_THRESHOLD_MINUTES) {
    return colors.error;
  }
  if (minutes <= SOON_THRESHOLD_MINUTES) {
    return colors.warning;
  }
  return colors.success;
}

function formatReminderLabel(minutes: number) {
  if (minutes < 60) {
    return `In ${minutes}min${minutes === 1 ? "" : "s"}`;
  }
  const hours = Math.round(minutes / 60);
  return `In ${hours}hr${hours === 1 ? "" : "s"}`;
}

export function EventListItem({
  time,
  reminderMinutes,
  icon,
  subtitle,
  title,
  participantsCount,
}: EventListItemProps) {
  const reminderColor =
    reminderMinutes !== undefined ? getReminderColor(reminderMinutes) : null;

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.time}>{time}</Text>
        {reminderMinutes !== undefined && reminderColor ? (
          <View
            style={[
              styles.reminder,
              { backgroundColor: withAlpha(reminderColor, 0.12) },
            ]}
          >
            <HugeiconsIcon icon={BellIcon} size={iconSize.xs} color={reminderColor} />
            <Text style={[styles.reminderText, { color: reminderColor }]}>
              {formatReminderLabel(reminderMinutes)}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.iconBadge}>
          <HugeiconsIcon
            icon={icon}
            size={iconSize.md}
            color={palette.green[700]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <AvatarStack count={participantsCount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  time: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  reminderText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  iconBadge: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: avatarSize.sm / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundAccent,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  subtitle: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
});
