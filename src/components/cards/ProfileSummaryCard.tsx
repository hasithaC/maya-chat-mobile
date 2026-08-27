import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";

interface ProfileSummaryCardProps {
  name: string;
  phone: string;
  avatarSource?: ImageSourcePropType;
}

export function ProfileSummaryCard({
  name,
  phone,
  avatarSource,
}: ProfileSummaryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatarImage} />
        ) : (
          <HugeiconsIcon
            icon={UserIcon}
            size={iconSize.lg}
            color={colors.textSecondary}
          />
        )}
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  avatar: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
    backgroundColor: colors.backgroundPrimary,
    borderColor: colors.borderInverse,
    borderWidth: borderWidth.medium,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontFamily: manrope.bold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textPrimary,
  },
  phone: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
