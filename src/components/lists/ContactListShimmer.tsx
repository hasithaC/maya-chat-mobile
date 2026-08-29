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

interface ContactListShimmerProps {
  rows?: number;
  showSectionLabel?: boolean;
}

const ContactRowSkeleton = ({ showDivider }: { showDivider: boolean }) => (
  <View style={[styles.row, showDivider && styles.divider]}>
    <Shimmer style={styles.avatar} linearGradients={shimmerGray} />
    <View style={styles.content}>
      <Shimmer style={styles.nameLine} linearGradients={shimmerGray} />
      <Shimmer style={styles.phoneLine} linearGradients={shimmerGray} />
    </View>
  </View>
);

export function ContactListShimmer({
  rows = 6,
  showSectionLabel = true,
}: ContactListShimmerProps) {
  const items = Array.from({ length: rows }, (_, index) => index);

  return (
    <ShimmerProvider duration={1500}>
      <View style={styles.container}>
        {showSectionLabel ? (
          <Shimmer style={styles.sectionLabel} linearGradients={shimmerGray} />
        ) : null}
        {items.map((index) => (
          <ContactRowSkeleton
            key={index}
            showDivider={index < items.length - 1}
          />
        ))}
      </View>
    </ShimmerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },
  sectionLabel: {
    width: 120,
    height: 12,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: avatarSize.md / 2,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  nameLine: {
    width: "50%",
    height: 14,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
  },
  phoneLine: {
    width: "35%",
    height: 11,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
  },
});
