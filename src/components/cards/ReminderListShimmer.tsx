import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  avatarSize,
  badgeSize,
  borderRadius,
  colors,
  spacing,
} from "../../constants/tokens";

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

interface ReminderListShimmerProps {
  rows?: number;
}

const ReminderRowSkeleton = () => (
  <View style={styles.row}>
    <View style={styles.header}>
      <Shimmer style={styles.iconBadge} linearGradients={shimmerGray} />
      <View style={styles.textContainer}>
        <Shimmer style={styles.subtitleLine} linearGradients={shimmerGray} />
        <Shimmer style={styles.titleLine} linearGradients={shimmerGray} />
      </View>
      <Shimmer style={styles.trailingBadge} linearGradients={shimmerGray} />
    </View>
    <Shimmer style={styles.dateTimeLine} linearGradients={shimmerGray} />
  </View>
);

export function ReminderListShimmer({ rows = 4 }: ReminderListShimmerProps) {
  const items = Array.from({ length: rows }, (_, index) => index);

  return (
    <ShimmerProvider duration={1500}>
      <View style={styles.container}>
        {items.map((index) => (
          <ReminderRowSkeleton key={index} />
        ))}
      </View>
    </ShimmerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBadge: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: avatarSize.sm / 2,
    backgroundColor: colors.backgroundPrimary,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  subtitleLine: {
    width: "45%",
    height: 11,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundPrimary,
  },
  titleLine: {
    width: "70%",
    height: 14,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundPrimary,
  },
  trailingBadge: {
    width: badgeSize.lg,
    height: badgeSize.lg,
    borderRadius: badgeSize.lg / 2,
    backgroundColor: colors.backgroundPrimary,
  },
  dateTimeLine: {
    width: "40%",
    height: 11,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundPrimary,
  },
});
