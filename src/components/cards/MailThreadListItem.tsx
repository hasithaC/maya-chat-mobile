import { PinIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  badgeSize,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  getAvatarColor,
  iconSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

export interface MailThreadParticipant {
  id: string;
  name: string;
}

interface MailThreadListItemProps {
  title: string;
  summary: string;
  participants: MailThreadParticipant[];
  newThreadsCount?: number;
  pinned?: boolean;
  showDivider?: boolean;
}

function ParticipantChip({ name }: { name: string }) {
  const avatarColor = getAvatarColor(name);

  return (
    <View style={styles.chip}>
      <View style={[styles.chipAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.chipAvatarInitial}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.chipLabel} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

export function MailThreadListItem({
  title,
  summary,
  participants,
  newThreadsCount,
  pinned = false,
  showDivider = true,
}: MailThreadListItemProps) {
  return (
    <View style={[styles.container, showDivider && styles.divider]}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {newThreadsCount ? (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>
              {newThreadsCount} New Thread{newThreadsCount === 1 ? "" : "s"}
            </Text>
          </View>
        ) : pinned ? (
          <HugeiconsIcon
            icon={PinIcon}
            size={iconSize.md}
            color={colors.textSecondary}
          />
        ) : null}
      </View>
      <Text style={styles.summary} numberOfLines={2}>
        {summary}
      </Text>
      <View style={styles.participants}>
        {participants.map((participant) => (
          <ParticipantChip key={participant.id} name={participant.name} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  newBadge: {
    paddingHorizontal: spacing.md,
    height: badgeSize.lg,
    justifyContent: "center",
    borderRadius: badgeSize.lg / 2,
    backgroundColor: colors.backgroundAccent,
  },
  newBadgeText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textAccent,
  },
  summary: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  participants: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xs,
    height: controlHeight["2xs"],
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.backgroundSecondary,
  },
  chipAvatar: {
    width: avatarSize["3xs"],
    height: avatarSize["3xs"],
    borderRadius: avatarSize["3xs"] / 2,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse,
    alignItems: "center",
    justifyContent: "center",
  },
  chipAvatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize["2xs"],
    lineHeight: lineHeight["2xs"],
    color: colors.textInverse,
  },
  chipLabel: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
    marginHorizontal: spacing.xs
  },
});
