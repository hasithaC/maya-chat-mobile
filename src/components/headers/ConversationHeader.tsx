import { ChevronLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  avatarSize,
  colors,
  controlHeight,
  fontSize,
  getAvatarColor,
  iconSize,
  lineHeight,
  manrope,
  geist,
  spacing,
} from "../../constants/tokens";

interface ConversationHeaderProps {
  avatarSource?: ImageSourcePropType;
  id?: string | number;
  title: string;
  status: string;
  onBack?: () => void;
  trailing?: ReactNode;
  loading?: boolean;
}

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

export function ConversationHeader({
  avatarSource,
  id,
  title,
  status,
  onBack,
  trailing,
  loading = false,
}: ConversationHeaderProps) {
  const avatarColor = getAvatarColor(id != null ? String(id) : title);

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
      {loading ? (
        <ShimmerProvider duration={1500}>
          <Shimmer style={styles.avatar} linearGradients={shimmerGray} />
        </ShimmerProvider>
      ) : avatarSource ? (
        <Image source={avatarSource} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitial}>
            {title.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        {loading ? (
          <ShimmerProvider duration={1500}>
            <View style={styles.textStack}>
              <Shimmer style={styles.titleLine} linearGradients={shimmerGray} />
              <Shimmer style={styles.statusLine} linearGradients={shimmerGray} />
            </View>
          </ShimmerProvider>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.status} numberOfLines={1}>
              {status}
            </Text>
          </>
        )}
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
    backgroundColor: colors.backgroundSecondary,
  },
  avatarFallback: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textInverse,
  },
  content: {
    flex: 1,
  },
  textStack: {
    gap: spacing.xs,
  },
  titleLine: {
    width: "60%",
    height: 14,
    borderRadius: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
  },
  statusLine: {
    width: "30%",
    height: 10,
    borderRadius: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
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
