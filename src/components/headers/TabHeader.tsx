import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import {
  avatarSize,
  borderRadius,
  colors,
  fontSize,
  lineHeight,
  manrope,
  shadows,
  spacing,
} from "../../constants/tokens";

interface TabHeaderProps {
  title: string;
  ctaLabel?: string;
  ctaEmoji?: string;
  avatarSource?: ImageSourcePropType;
  onCtaPress?: () => void;
  trailing?: ReactNode;
}

export function TabHeader({
  title,
  ctaLabel = "Talk to Maya",
  ctaEmoji = "👋",
  avatarSource = mayaAvatar,
  onCtaPress,
  trailing,
}: TabHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.cta} onPress={onCtaPress}>
          <Text style={styles.emoji}>{ctaEmoji}</Text>
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          <Image source={avatarSource} style={styles.avatar} />
        </Pressable>
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: manrope.extraBold,
    fontSize: fontSize["2xl"],
    lineHeight: lineHeight["2xl"],
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    gap: spacing.xs,
    ...shadows.sm,
  },
  emoji: {
    fontSize: fontSize.xs,
  },
  ctaLabel: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
  },
  avatarPlaceholder: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    backgroundColor: colors.backgroundSecondary,
  },
});
