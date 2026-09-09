import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  getAvatarColor,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  spacing,
} from "../../constants/tokens";
import { PrimaryPressable } from "../buttons/PrimaryPressable";

export type CallDirection = "incoming" | "outgoing" | "missed";

interface CallListItemProps {
  avatarSource?: ImageSourcePropType;
  // The other party's user id — seeds the avatar fallback color, so it
  // stays stable per-contact instead of shifting per call record.
  id?: string | number;
  title: string;
  direction: CallDirection;
  time: string;
  showDivider?: boolean;
  // Navigates to the call summary screen.
  onViewSummary?: () => void;
  onIgnore?: () => void;
  onCallBack?: () => void;
}

const DIRECTION_LABEL: Record<CallDirection, string> = {
  incoming: "Incoming Call",
  outgoing: "Outgoing Call",
  missed: "Missed",
};

export function CallListItem({
  avatarSource,
  id,
  title,
  direction,
  time,
  showDivider = true,
  onViewSummary,
  onIgnore,
  onCallBack,
}: CallListItemProps) {
  const isMissed = direction === "missed";
  const avatarColor = getAvatarColor(id != null ? String(id) : title);

  return (
    <View style={[styles.container, showDivider && styles.divider]}>
      <View style={styles.row}>
        <View style={styles.avatarWrapper}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} />
          ) : (
            <View
              style={[styles.avatarFallback, { backgroundColor: avatarColor }]}
            >
              <Text style={styles.avatarInitial}>
                {title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, isMissed && styles.titleMissed]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={styles.timeRow}>
              <Text style={styles.time}>{time}</Text>
              {onViewSummary ? (
                <Pressable onPress={onViewSummary} hitSlop={minHitSlop}>
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={iconSize.lg}
                    color={colors.textPrimary}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {DIRECTION_LABEL[direction]}
          </Text>
        </View>
      </View>
      {isMissed ? (
        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <PrimaryPressable
              size="sm"
              appearance="outline"
              text="Ignore for Now"
              onPress={() => onIgnore?.()}
            />
          </View>
          <View style={styles.actionButton}>
            <PrimaryPressable
              size="sm"
              text="Call Back?"
              onPress={() => onCallBack?.()}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarWrapper: {
    width: avatarSize.lg,
    height: avatarSize.lg,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: avatarSize.lg / 2,
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: avatarSize.lg / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textInverse,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  titleMissed: {
    color: colors.error,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  time: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  subtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
