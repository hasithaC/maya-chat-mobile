import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  avatarSize,
  borderWidth,
  colors,
  manrope,
  spacing,
  fontSize,
  iconSize,
  lineHeight,
  borderRadius,
} from "../../constants/tokens";

interface AvatarStackProps {
  count: number;
  sources?: (ImageSourcePropType | undefined)[];
  visibleCount?: number;
}

export function AvatarStack({
  count,
  sources,
  visibleCount = 2,
}: AvatarStackProps) {
  const shown = Math.min(visibleCount, count);
  const remaining = count - shown;

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        {Array.from({ length: shown }).map((_, index) => {
          const source = sources?.[index];

          return (
            <View
              key={index}
              style={[styles.avatar, index > 0 && styles.overlap]}
            >
              {source ? (
                <Image source={source} style={styles.avatarImage} />
              ) : (
                <HugeiconsIcon
                  icon={UserIcon}
                  size={iconSize.xs}
                  color={colors.textSecondary}
                />
              )}
            </View>
          );
        })}
      </View>
      {remaining > 0 ? (
        <View style={[styles.counterAvatar, styles.counter]}>
          <Text style={styles.counterText}>+{remaining}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xs,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  overlap: {
    marginLeft: -spacing.xs,
  },
  counterAvatar: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: avatarSize.sm / 2,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: spacing.xs,
  },
  counter: {
    backgroundColor: colors.backgroundAccent,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textAccent,
  },
});
