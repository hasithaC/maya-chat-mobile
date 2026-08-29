import { PinIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  badgeSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  getAvatarColor,
  iconSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface ConversationListItemProps {
  avatarSource?: ImageSourcePropType;
  id?: string | number;
  online?: boolean;
  title: string;
  time: string;
  message: string;
  pinned?: boolean;
  unreadCount?: number;
  showDivider?: boolean;
  onPress?: () => void;
}

export function ConversationListItem({
  avatarSource,
  id,
  online = false,
  title,
  time,
  message,
  pinned = false,
  unreadCount = 0,
  onPress,
}: ConversationListItemProps) {
  const avatarColor = getAvatarColor(id != null ? String(id) : title);

  return (
    <Pressable style={[styles.container, styles.divider]} onPress={onPress}>
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
        {online ? <View style={styles.onlineDot} /> : null}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
          <View style={styles.trailing}>
            {pinned ? (
              <HugeiconsIcon
                icon={PinIcon}
                size={iconSize.md}
                color={colors.textSecondary}
              />
            ) : null}
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border,
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
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: badgeSize.sm,
    height: badgeSize.sm,
    borderRadius: badgeSize.sm / 2,
    backgroundColor: colors.success,
    borderWidth: borderWidth.medium,
    borderColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  row: {
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
  time: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  message: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  unreadBadge: {
    minWidth: badgeSize.lg,
    height: badgeSize.lg,
    paddingHorizontal: spacing.xs,
    borderRadius: badgeSize.lg / 2,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontFamily: manrope.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textInverse,
  },
});
