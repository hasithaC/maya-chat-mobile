import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  colors,
  fontSize,
  getAvatarColor,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface MessageGroupProps {
  avatarSource?: ImageSourcePropType;
  userId?: string;
  name: string;
  children: ReactNode;
}

export function MessageGroup({
  avatarSource,
  userId,
  name,
  children,
}: MessageGroupProps) {
  const avatarColor = getAvatarColor(userId ?? name);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
  },
  avatarFallback: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textInverse,
  },
  name: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  body: {
    gap: spacing.sm,
  },
});
