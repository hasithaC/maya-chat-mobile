import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  colors,
  fontSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface MessageGroupProps {
  avatarSource: ImageSourcePropType;
  name: string;
  children: ReactNode;
}

export function MessageGroup({
  avatarSource,
  name,
  children,
}: MessageGroupProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.avatar} />
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
  name: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  body: {
    gap: spacing.xs,
  },
});
