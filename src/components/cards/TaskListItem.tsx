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
  manrope,
  geist,
  spacing,
  withAlpha,
} from "../../constants/tokens";

export type TaskPriority = "high" | "medium" | "low";

interface TaskListItemProps {
  icon: IconSvgElement;
  iconColor: string;
  title: string;
  highlight?: string;
  subtitle: string;
  priority: TaskPriority;
}

const PRIORITY_STYLES: Record<
  TaskPriority,
  { background: string; text: string; label: string }
> = {
  high: {
    background: withAlpha(colors.error, 0.12),
    text: colors.error,
    label: "High",
  },
  medium: {
    background: withAlpha(colors.warning, 0.12),
    text: colors.warning,
    label: "Medium",
  },
  low: {
    background: withAlpha(colors.info, 0.12),
    text: colors.info,
    label: "Low",
  },
};

export function TaskListItem({
  icon,
  iconColor,
  title,
  highlight,
  subtitle,
  priority,
}: TaskListItemProps) {
  const priorityStyle = PRIORITY_STYLES[priority];
  const highlightIndex = highlight ? title.indexOf(highlight) : -1;

  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <HugeiconsIcon icon={icon} size={iconSize.md} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {highlight && highlightIndex >= 0 ? (
            <>
              {title.slice(0, highlightIndex)}
              <Text style={styles.highlight}>{highlight}</Text>
              {title.slice(highlightIndex + highlight.length)}
            </>
          ) : (
            title
          )}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View
        style={[
          styles.priorityBadge,
          { backgroundColor: priorityStyle.background },
        ]}
      >
        <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
          {priorityStyle.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  iconBadge: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: avatarSize.sm / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  highlight: {
    color: colors.textAccent,
  },
  subtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    justifyContent: "center",
  },
  priorityText: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
});
