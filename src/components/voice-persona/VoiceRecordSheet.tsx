import {
  InformationCircleIcon,
  Mic01Icon,
  PauseIcon,
  PlayIcon,
  ReloadIcon,
  StopIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  requestRecordingPermissionsAsync,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import uploadAnimation from "@/assets/lottie/animated-upload.json";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  palette,
  spacing,
} from "../../constants/tokens";
import { BottomSheet } from "../overlays/BottomSheet";
import { formatDuration } from "../../utils/date";

const MAX_RECORDING_MS = 15_000;
const SAMPLE_INTERVAL_MS = 100;
const MAX_SAMPLES = MAX_RECORDING_MS / SAMPLE_INTERVAL_MS + 1;
const BAR_COUNT = 50;
const HALF_BAR_COUNT = Math.floor(BAR_COUNT / 2);
const PLAYBACK_UPDATE_MS = 50;
const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT = 44;

type Phase = "idle" | "recording" | "recorded";

interface VoiceRecordSheetProps {
  visible: boolean;
  onClose: () => void;
  onDone: (uri: string) => void;
  sampleText: string;
  isUploading?: boolean;
}

function toBarHeight(metering: number | undefined): number {
  if (metering == null) return MIN_BAR_HEIGHT;
  const level = Math.min(Math.max((metering + 50) / 40, 0), 1);
  return MIN_BAR_HEIGHT + level * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
}

export function VoiceRecordSheet({
  visible,
  onClose,
  onDone,
  sampleText,
  isUploading = false,
}: VoiceRecordSheetProps) {
  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  };
  const recorder = useAudioRecorder(recordingOptions);
  const recorderState = useAudioRecorderState(recorder, SAMPLE_INTERVAL_MS);

  const [phase, setPhase] = useState<Phase>("idle");
  const [samples, setSamples] = useState<number[]>([]);
  const [recordedMs, setRecordedMs] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const elapsedMs = phase === "recording" ? recorderState.durationMillis : recordedMs;

  useEffect(() => {
    if (phase !== "recording") return;
    setSamples((previous) => [
      ...previous.slice(-(MAX_SAMPLES - 1)),
      toBarHeight(recorderState.metering),
    ]);
  }, [recorderState.durationMillis, recorderState.metering]);

  useEffect(() => {
    if (phase === "recording" && recorderState.durationMillis >= MAX_RECORDING_MS) {
      void stopRecording();
    }
  }, [phase, recorderState.durationMillis]);

  async function startRecording() {
    setError(null);
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone access is needed to record your voice.");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync(recordingOptions);
      setSamples([]);
      setPhase("recording");
      recorder.record();
    } catch {
      setError("Couldn't start recording. Please try again.");
    }
  }

  async function stopRecording() {
    if (!recorder.isRecording) return;
    setRecordedMs(recorderState.durationMillis);
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setRecordedUri(recorder.uri);
    setPhase("recorded");
  }

  async function reset() {
    if (recorder.isRecording) {
      await recorder.stop().catch(() => {});
    }
    setPhase("idle");
    setSamples([]);
    setRecordedMs(0);
    setRecordedUri(null);
    setError(null);
  }

  function handleClose() {
    void reset();
    onClose();
  }

  function handleDone() {
    if (recordedUri) onDone(recordedUri);
  }

  useEffect(() => {
    if (!visible) void reset();
  }, [visible]);

  const liveBars = [
    ...Array<number>(Math.max(BAR_COUNT - samples.length, 0)).fill(MIN_BAR_HEIGHT),
    ...samples.slice(-BAR_COUNT),
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Record for 10 - 15 seconds"
    >
     <View>
       <View style={styles.content}>
        {phase === "idle" ? (
          <>
            <View style={styles.infoBanner}>
              <HugeiconsIcon
                icon={InformationCircleIcon}
                size={iconSize.sm}
                color={colors.info}
              />
              <Text style={styles.infoText}>
                Your voice is used only to personalize your agent and is never
                shared.
              </Text>
            </View>
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Please start recording and read the below phrase.
              </Text>
              <Text style={styles.sampleText}>{`"${sampleText}"`}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.timerPill}>
              <Text style={styles.timerText}>
                {formatDuration(elapsedMs / 1000)}
              </Text>
            </View>
            {phase === "recording" ? (
              <WaveformBars heights={liveBars} />
            ) : isUploading ? (
              <UploadingAnimation />
            ) : recordedUri ? (
              <RecordedPlayback
                uri={recordedUri}
                samples={samples}
                onRetake={() => void reset()}
                onDone={handleDone}
              />
            ) : null}
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {phase !== "recorded" ? (
      <View style={styles.footer}>
        {phase === "idle" ? (
          <SheetButton
            variant="danger"
            icon={Mic01Icon}
            label="Record"
            onPress={() => void startRecording()}
          />
        ) : null}

        {phase === "recording" ? (
          <SheetButton
            variant="danger"
            icon={StopIcon}
            label="Stop Recording"
            onPress={() => void stopRecording()}
          />
        ) : null}

      </View>
      ) : null}
     </View>
    </BottomSheet>
  );
}

function WaveformBars({
  heights,
  playedBefore,
}: {
  heights: number[];
  playedBefore?: number;
}) {
  return (
    <View style={styles.waveform}>
      {heights.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            { height },
            playedBefore !== undefined &&
              index >= playedBefore &&
              styles.barUpcoming,
          ]}
        />
      ))}
    </View>
  );
}

interface RecordedPlaybackProps {
  uri: string;
  samples: number[];
  onRetake: () => void;
  onDone: () => void;
}

function UploadingAnimation() {
  return (
    <View style={styles.upload}>
      <LottieView
        source={uploadAnimation}
        autoPlay
        loop
        style={styles.uploadAnimation}
      />
      <Text style={styles.uploadText}>Uploading…</Text>
    </View>
  );
}

function RecordedPlayback({ uri, samples, onRetake, onDone }: RecordedPlaybackProps) {
  const player = useAudioPlayer(uri, PLAYBACK_UPDATE_MS);
  const status = useAudioPlayerStatus(player);

  const isAtEnd = status.duration > 0 && status.currentTime >= status.duration - 0.05;
  const isPlaying = status.playing && !isAtEnd;
  const cursor =
    status.duration > 0
      ? (status.currentTime / status.duration) * samples.length
      : 0;
  const center = Math.floor(cursor);
  const heights = Array.from({ length: BAR_COUNT }, (_, offset) => {
    const index = center - HALF_BAR_COUNT + offset;
    return index >= 0 && index < samples.length ? samples[index] : MIN_BAR_HEIGHT;
  });

  function togglePlayback() {
    if (isPlaying) {
      player.pause();
      return;
    }
    if (isAtEnd) {
      void player.seekTo(0);
    }
    player.play();
  }

  return (
    <>
      <WaveformBars heights={heights} playedBefore={HALF_BAR_COUNT} />
      <SheetButton
        variant="outline"
        icon={isPlaying ? PauseIcon : PlayIcon}
        label={isPlaying ? "Pause" : "Play"}
        onPress={togglePlayback}
      />
      <View style={styles.row}>
        <SheetButton
          variant="danger"
          icon={ReloadIcon}
          label="Retake"
          onPress={onRetake}
          style={styles.flex}
        />
        <SheetButton
          variant="success"
          icon={Tick02Icon}
          label="Done"
          onPress={onDone}
          style={styles.flex}
        />
      </View>
    </>
  );
}

type SheetButtonVariant = "danger" | "success" | "outline";

interface SheetButtonProps {
  variant: SheetButtonVariant;
  icon: IconSvgElement;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

function SheetButton({ variant, icon, label, onPress, style }: SheetButtonProps) {
  const isOutline = variant === "outline";
  const backgroundColor =
    variant === "danger"
      ? colors.buttonDanger
      : variant === "success"
        ? colors.buttonPrimary
        : "transparent";
  const foregroundColor = isOutline ? colors.textAccent : colors.textInverse;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor },
        isOutline && styles.buttonOutline,
        style,
      ]}
    >
      <HugeiconsIcon icon={icon} size={iconSize.sm} color={foregroundColor} />
      <Text style={[styles.buttonText, { color: foregroundColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: palette.blue[100],
  },
  infoText: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: palette.blue[900],
  },
  instructions: {
    gap: spacing.sm,
  },
  instructionText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  sampleText: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  timerPill: {
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
  },
  timerText: {
    fontFamily: geist.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
  waveform: {
    height: MAX_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs / 2,
  },
  bar: {
    width: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.buttonDanger,
  },
  upload: {
    alignItems: "center",
    gap: spacing.sm,
  },
  uploadAnimation: {
    width: controlHeight["3xl"],
    height: controlHeight["3xl"],
  },
  uploadText: {
    fontFamily: geist.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  barUpcoming: {
    backgroundColor: colors.backgroundSecondaryStrong,
  },
  errorText: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.error,
  },
  footer: {
    justifyContent:'flex-end',
    height: controlHeight["4xl"],
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  button: {
    height: controlHeight.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  buttonOutline: {
    borderWidth: borderWidth.thin,
    borderColor: colors.borderAccent,
  },
  buttonText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
});
