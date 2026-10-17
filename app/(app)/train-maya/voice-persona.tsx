import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import {
  PrimaryPressable,
  SetupHeader,
  VoiceRecordSheet,
} from "../../../src/components";
import { ROUTES } from "../../../src/constants/routes";
import { showToast } from "../../../src/core/toast/toast.store";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";
import { mayaApi } from "../../../src/domain/maya/api/maya.api";
import type { MayaPersonaType } from "../../../src/domain/maya/types/maya.types";
import {
  badgeSize,
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  deviceWidth,
  fontSize,
  geist,
  lineHeight,
  manrope,
  spacing,
} from "../../../src/constants/tokens";

const glowSize = deviceWidth * 0.5;

const PERSONA_OPTIONS: {
  id: string;
  title: string;
  subtitle: string;
  persona: MayaPersonaType;
}[] = [
  {
    id: "professional-calm",
    title: "Professional & Calm",
    subtitle: "Clear, steady, and confident.",
    persona: "professional_calm",
  },
  {
    id: "friendly-conversational",
    title: "Friendly & Conversational",
    subtitle: "Warm, approachable, and natural",
    persona: "friendly_conversational",
  },
  {
    id: "confident-direct",
    title: "Confident & Direct",
    subtitle: "Straight to the point",
    persona: "confident_direct",
  },
];

interface PersonaOptionRowProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

function PersonaOptionRow({
  title,
  subtitle,
  selected,
  onPress,
}: PersonaOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionRow, selected && styles.optionRowSelected]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.optionTextGroup}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function VoicePersonaScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState(PERSONA_OPTIONS[0].id);
  const [isRecordSheetVisible, setIsRecordSheetVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { initialMessage, initialOptions } = useLocalSearchParams<{
    initialMessage?: string;
    initialOptions?: string;
  }>();
  const selectedPersona = PERSONA_OPTIONS.find((option) => option.id === selectedId);

  async function startRecording() {
    if (!user || !selectedPersona) return;
    try {
      const response = await mayaApi.selectPersona(user.id, selectedPersona.persona);
      if (!response.success) {
        showToast(response.message || "Couldn't save your voice persona. Please try again.");
        return;
      }
      setIsRecordSheetVisible(true);
    } catch (error) {
      showToast(
        error instanceof Error && error.message
          ? error.message
          : "Couldn't save your voice persona. Please try again.",
      );
    }
  }

  async function handleSampleRecorded(uri: string) {
    if (!user) return;
    setIsUploading(true);
    try {
      const response = await mayaApi.uploadVoiceSample(user.id, uri);
      if (!response.success) {
        showToast(response.message || "Couldn't upload your voice sample. Please try again.");
        return;
      }
      setIsRecordSheetVisible(false);
      router.push({
        pathname: ROUTES.trainMayaAboutYou,
        params: { initialMessage, initialOptions },
      });
    } catch (error) {
      showToast(
        error instanceof Error && error.message
          ? error.message
          : "Couldn't upload your voice sample. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  return (
    <View style={styles.screen}>
      <View style={styles.glow}>
        <Svg width={glowSize} height={glowSize}>
          <Defs>
            <RadialGradient id="voicePersonaGlow" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0%"
                stopColor={colors.backgroundAccent}
                stopOpacity={0.72}
              />
              <Stop
                offset="100%"
                stopColor={colors.backgroundAccent}
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>
          <Circle
            cx={glowSize / 2}
            cy={glowSize / 2}
            r={glowSize / 2}
            fill="url(#voicePersonaGlow)"
          />
        </Svg>
      </View>

      <View style={[styles.container, containerInsetStyle]}>
        <View style={styles.content}>
          <SetupHeader mutedTitle="Let's" title=", Set up Maya." progress={0.18} />

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Choose your voice persona</Text>
            <View style={styles.optionsList}>
              {PERSONA_OPTIONS.map((option) => (
                <PersonaOptionRow
                  key={option.id}
                  title={option.title}
                  subtitle={option.subtitle}
                  selected={selectedId === option.id}
                  onPress={() => setSelectedId(option.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              Record a short sample so the agent can better match your tone and
              speaking style.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryPressable
            text="Let's Start Recording"
            onPress={startRecording}
          />
          <PrimaryPressable
            text="Maybe Later"
            appearance="outline"
            onPress={() => router.dismissTo(ROUTES.dashboard)}
          />
        </View>
      </View>

      <VoiceRecordSheet
        visible={isRecordSheetVisible}
        onClose={() => setIsRecordSheetVisible(false)}
        onDone={(uri) => void handleSampleRecorded(uri)}
        isUploading={isUploading}
        sampleText="Hi, this is Robert. Feel free to reach out if you need any help."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  glow: {
    position: "absolute",
    top: glowSize / 2,
    left: -glowSize / 2,
  },
  content: {
    flex: 1,
  },
  formSection: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
  },
  sectionLabel: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundInverseSecondaryStrong,
  },
  optionRowSelected: {
    borderColor: colors.borderAccent,
    backgroundColor: colors.buttonSecondary,
  },
  radioOuter: {
    width: controlHeight["3xs"],
    height: controlHeight["3xs"],
    borderRadius: controlHeight["3xs"] / 2,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.borderAccent,
  },
  radioInner: {
    width: controlHeight["3xs"] / 2,
    height: controlHeight["3xs"] / 2,
    borderRadius: controlHeight["3xs"] / 4,
    backgroundColor: colors.borderAccent,
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  optionSubtitle: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  noteSection: {
    paddingVertical: spacing["2xl"],
    borderTopWidth: borderWidth.thin,
    borderColor: colors.border,
  },
  noteText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
});
