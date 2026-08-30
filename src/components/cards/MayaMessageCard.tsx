import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface MayaMessageCardProps {
  avatarSource?: ImageSourcePropType;
  name?: string;
  message: string;
}

export function MayaMessageCard({
  avatarSource = mayaAvatar,
  name = "Maya (PA)",
  message,
}: MayaMessageCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
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
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse
  },
  name: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  message: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
});
