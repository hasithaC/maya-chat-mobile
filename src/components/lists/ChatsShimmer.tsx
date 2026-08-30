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

const ROWS = ["s1", "s2", "s3", "s4", "s5", "s6"];

const ConversationRowSkeleton = ({ showDivider }: { showDivider: boolean }) => (
  <View style={[styles.row, showDivider && styles.divider]}>
    <Shimmer style={styles.avatar} linearGradients={shimmerGray} />
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <Shimmer style={styles.titleLine} linearGradients={shimmerGray} />
        <Shimmer style={styles.timeLine} linearGradients={shimmerGray} />
      </View>
      <Shimmer style={styles.messageLine} linearGradients={shimmerGray} />
    </View>
  </View>
);

const ChatsShimmer = () => (
  <ShimmerProvider duration={1500}>
    <View style={styles.container}>
      {ROWS.map((key, index) => (
        <ConversationRowSkeleton key={key} showDivider={index < ROWS.length - 1} />
      ))}
    </View>
  </ShimmerProvider>
);

export { ChatsShimmer };

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: avatarSize.lg,
    height: avatarSize.lg,
    borderRadius: avatarSize.lg / 2,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  titleLine: {
    width: "45%",
    height: 14,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
  },
  timeLine: {
    width: 36,
    height: 10,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
  },
  messageLine: {
    width: "80%",
    height: 12,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.backgroundSecondary,
  },
});
