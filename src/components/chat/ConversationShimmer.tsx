import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  borderRadius,
  colors,
  controlHeight,
  spacing,
} from "../../constants/tokens";

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

const BUBBLES: { align: "flex-start" | "flex-end"; width: `${number}%` }[] = [
  { align: "flex-start", width: "70%" },
  { align: "flex-end", width: "55%" },
  { align: "flex-start", width: "60%" },
  { align: "flex-start", width: "40%" },
  { align: "flex-end", width: "65%" },
  { align: "flex-start", width: "50%" },
  { align: "flex-start", width: "60%" },
  { align: "flex-start", width: "40%" },
  { align: "flex-end", width: "65%" },
];

const ConversationShimmer = () => (
  <ShimmerProvider duration={1500}>
    <View style={styles.container}>
      {BUBBLES.map((bubble, index) => (
        <Shimmer
          key={index}
          style={[
            styles.bubble,
            { alignSelf: bubble.align, width: bubble.width },
          ]}
          linearGradients={shimmerGray}
        />
      ))}
    </View>
  </ShimmerProvider>
);

export { ConversationShimmer };

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  bubble: {
    height: controlHeight.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
});
