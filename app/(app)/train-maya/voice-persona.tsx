import mayaAvatar from "@/assets/images/avatars/maya-avatar-large.png";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { PrimaryPressable } from "../../../src/components";
import {
  avatarSize,
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

const avatarRingSize = controlHeight["3xl"];
const avatarRingStrokeWidth = 4;
const avatarRingRadius = (avatarRingSize - avatarRingStrokeWidth) / 2;
const avatarRingCircumference = 2 * Math.PI * avatarRingRadius;
const avatarRingProgress = 0.18;

const PERSONA_OPTIONS = [
  {
    id: "professional-calm",
    title: "Professional & Calm",
    subtitle: "Clear, steady, and confident.",
  },
  {
    id: "friendly-conversational",
    title: "Friendly & Conversational",
    subtitle: "Warm, approachable, and natural",
  },
  {
    id: "confident-direct",
    title: "Confident & Direct",
    subtitle: "Straight to the point",
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
          <View style={styles.header}>
            <Text style={styles.title}>
              <Text style={styles.titleMuted}>Let's</Text>, Set up Maya.
            </Text>
            <View style={styles.headerAvatar}>
              <Image source={mayaAvatar} style={styles.headerAvatarImage} />
              <Svg
                width={avatarRingSize}
                height={avatarRingSize}
                style={styles.headerAvatarRing}
              >
                <Circle
                  cx={avatarRingSize / 2}
                  cy={avatarRingSize / 2}
                  r={avatarRingRadius}
                  stroke={colors.buttonPrimary}
                  strokeWidth={avatarRingStrokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${avatarRingCircumference * avatarRingProgress} ${avatarRingCircumference}`}
                  fill="none"
                  rotation="-90"
                  origin={`${avatarRingSize / 2}, ${avatarRingSize / 2}`}
                />
              </Svg>
            </View>
          </View>

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
          <PrimaryPressable text="Let's Start Recording" onPress={() => {}} />
          <PrimaryPressable
            text="Maybe Later"
            appearance="outline"
            onPress={() => router.back()}
          />
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: manrope.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textPrimary,
  },
  titleMuted: {
    color: colors.textSecondary,
  },
  headerAvatar: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: controlHeight["3xl"],
    height: controlHeight["3xl"],
    borderRadius: controlHeight.xl / 2,
  },
  headerAvatarImage: {
    width: avatarSize.xl,
    height: avatarSize.xl,
    borderRadius: avatarSize.xl / 2,
  },
  headerAvatarRing: {
    position: "absolute",
    top: 0,
    left: 0,
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
