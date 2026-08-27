import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  spacing,
} from "../../constants/tokens";

interface VoiceNotePlayerProps {
  duration: string;
}

const WAVEFORM_HEIGHTS = [
  6, 10, 16, 22, 12, 18, 24, 14, 20, 10, 16, 22, 12, 18, 8, 14, 20, 10, 16, 24,
  12, 18, 8, 14, 10, 20, 6, 12,
];
const PLAYED_BAR_COUNT = 3;

export function VoiceNotePlayer({ duration }: VoiceNotePlayerProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.playButton}>
          <HugeiconsIcon icon={PlayIcon} size={iconSize.sm} color={colors.textInverse} />
        </View>
        <View style={styles.waveform}>
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                { height },
                index < PLAYED_BAR_COUNT && styles.barPlayed,
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.duration}>{duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  playButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  waveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bar: {
    width: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
  },
  barPlayed: {
    backgroundColor: colors.buttonPrimary,
  },
  duration: {
    marginTop: spacing.xs,
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textSecondary,
  },
});
