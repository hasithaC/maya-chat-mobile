import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Shimmer, ShimmerProvider } from "react-native-fast-shimmer";
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
import { downloadAttachment } from "../../domain/attachments/utils/download-attachment";
import { formatDuration } from "../../utils/date";

interface VoiceNotePlayerProps {
  audioUrl: string;
}

const WAVEFORM_HEIGHTS = [
  6, 10, 16, 22, 12, 18, 24, 14, 20, 10, 16, 22, 12, 18, 8, 14, 20, 10, 16, 24,
  12, 18, 8, 14, 10, 20, 6, 12,
];

const shimmerGray: string[] = [
  colors.backgroundSecondary,
  colors.border,
  colors.backgroundSecondary,
];

export function VoiceNotePlayer({ audioUrl }: VoiceNotePlayerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedUrl(null);

    // Private S3 objects need a presigned URL; if that (or the download)
    // fails, fall back to the raw URL rather than blocking playback.
    downloadAttachment(audioUrl).then((result) => {
      if (cancelled) return;
      setResolvedUrl(result.success ? result.localUri : audioUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  if (!resolvedUrl) {
    return (
      <ShimmerProvider duration={1500}>
        <Shimmer style={styles.placeholder} linearGradients={shimmerGray} />
      </ShimmerProvider>
    );
  }

  // Mounted only once the final URL is known, since `useAudioPlayer` reads
  // its source on creation and doesn't react to it changing across renders.
  return <VoiceNotePlayerContent audioUrl={resolvedUrl} />;
}

function VoiceNotePlayerContent({ audioUrl }: { audioUrl: string }) {
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);

  const isFinished =
    status.duration > 0 && status.currentTime >= status.duration - 0.05;

  useEffect(() => {
    if (status.didJustFinish) {
      player.pause();
      player.seekTo(0).catch(() => {});
    }
  }, [status.didJustFinish, player]);

  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;
  const playedBarCount = isFinished ? 0 : Math.round(progress * WAVEFORM_HEIGHTS.length);
  const timeLabel = formatDuration(
    !isFinished && (status.playing || status.currentTime > 0)
      ? status.currentTime
      : status.duration,
  );

  const handleTogglePlayback = async () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (isFinished) {
      await player.seekTo(0);
    }
    player.play();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable style={styles.playButton} onPress={handleTogglePlayback}>
          <HugeiconsIcon
            icon={status.playing && !isFinished ? PauseIcon : PlayIcon}
            size={iconSize.sm}
            color={colors.textInverse}
          />
        </Pressable>
        <View style={styles.waveform}>
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                { height },
                index < playedBarCount && styles.barPlayed,
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.duration}>{timeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
  },
  placeholder: {
    minWidth: 200,
    height: controlHeight.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
  },
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
