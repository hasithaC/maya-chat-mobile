import { ChevronLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  geist,
  spacing,
} from "../../constants/tokens";

interface ConversationHeaderProps {
  avatarSource: ImageSourcePropType;
  title: string;
  status: string;
  onBack?: () => void;
  trailing?: ReactNode;
}

export function ConversationHeader({
  avatarSource,
  title,
  status,
  onBack,
  trailing,
}: ConversationHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={onBack ?? (() => router.back())}
        hitSlop={spacing.sm}
      >
        <HugeiconsIcon
          icon={ChevronLeftIcon}
          size={iconSize.md}
          color={colors.textPrimary}
        />
      </Pressable>
      <Image source={avatarSource} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.status} numberOfLines={1}>
          {status}
        </Text>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  backButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  status: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
