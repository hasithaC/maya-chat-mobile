import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  spacing,
} from "../../constants/tokens";

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

const IntroBlockSkeleton = () => (
  <View style={styles.introBlock}>
    <View style={styles.introHeader}>
      <Shimmer style={styles.avatar} linearGradients={shimmerGray} />
      <Shimmer style={styles.nameLine} linearGradients={shimmerGray} />
    </View>
    <Shimmer style={styles.textLine} linearGradients={shimmerGray} />
  </View>
);

const ParagraphBlockSkeleton = ({ lines }: { lines: number }) => (
  <View style={styles.paragraphBlock}>
    {Array.from({ length: lines }, (_, index) => (
      <Shimmer
        key={index}
        style={
          index === lines - 1
            ? [styles.textLine, styles.textLineShort]
            : styles.textLine
        }
        linearGradients={shimmerGray}
      />
    ))}
  </View>
);

export function CallSummaryShimmer() {
  return (
    <ShimmerProvider duration={1500}>
      <View style={styles.container}>
        <IntroBlockSkeleton />
        <ParagraphBlockSkeleton lines={4} />
        <ParagraphBlockSkeleton lines={2} />
      </View>
    </ShimmerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  introBlock: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  introHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    backgroundColor: colors.backgroundSecondaryStrong,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse,
  },
  nameLine: {
    width: 96,
    height: 14,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  paragraphBlock: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
  },
  textLine: {
    width: "100%",
    height: 11,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  textLineShort: {
    width: "60%",
  },
});
