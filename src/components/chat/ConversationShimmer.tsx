import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
import {
  avatarSize,
  borderRadius,
  colors,
  spacing,
} from "../../constants/tokens";

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

const IMAGE_WIDTH = 180;
const IMAGE_HEIGHT = 120;

type Segment =
  | {
      kind: "group";
      bubbleHeight: number;
      bubbleWidth: `${number}%`;
      nameWidth: number;
    }
  | {
      kind: "text";
      align: "flex-start" | "flex-end";
      height: number;
      width: `${number}%`;
    }
  | { kind: "image"; align: "flex-start" | "flex-end" };

// Mirrors the mix of content a real conversation shows: incoming groups
// (avatar + name + bubble), single- and multi-line text bubbles, and image
// attachments — instead of a uniform row of identical bars.
const SEGMENTS: Segment[] = [
  { kind: "group", bubbleHeight: 44, bubbleWidth: "55%", nameWidth: 96 },
  { kind: "text", align: "flex-end", height: 44, width: "42%" },
  { kind: "image", align: "flex-start" },
  { kind: "text", align: "flex-end", height: 64, width: "60%" },
  { kind: "group", bubbleHeight: 44, bubbleWidth: "70%", nameWidth: 112 },
];

function TextBubble({
  align,
  height,
  width,
}: {
  align: "flex-start" | "flex-end";
  height: number;
  width: `${number}%`;
}) {
  return (
    <Shimmer
      style={[styles.bubble, { alignSelf: align, height, width }]}
      linearGradients={shimmerGray}
    />
  );
}

const ConversationShimmer = () => (
  <ShimmerProvider duration={1500}>
    <View style={styles.container}>
      {SEGMENTS.map((segment, index) => {
        if (segment.kind === "group") {
          return (
            <View key={index} style={styles.group}>
              <View style={styles.groupHeader}>
                <Shimmer style={styles.avatar} linearGradients={shimmerGray} />
                <Shimmer
                  style={[styles.nameLine, { width: segment.nameWidth }]}
                  linearGradients={shimmerGray}
                />
              </View>
              <TextBubble
                align="flex-start"
                height={segment.bubbleHeight}
                width={segment.bubbleWidth}
              />
            </View>
          );
        }

        if (segment.kind === "image") {
          return (
            <Shimmer
              key={index}
              style={[styles.image, { alignSelf: segment.align }]}
              linearGradients={shimmerGray}
            />
          );
        }

        return (
          <TextBubble
            key={index}
            align={segment.align}
            height={segment.height}
            width={segment.width}
          />
        );
      })}
    </View>
  </ShimmerProvider>
);

export { ConversationShimmer };

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  nameLine: {
    height: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  bubble: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondaryStrong,
  },
});
