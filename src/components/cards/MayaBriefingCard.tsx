import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import mayaAvatar from "@/assets/images/avatars/maya-avatar.png";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  fontSize,
  lineHeight,
  palette,
  manrope,
  geist,
  spacing,
  withAlpha,
} from "../../constants/tokens";
import { PrimaryPressable } from "../buttons";

interface MayaBriefingCardProps {
  userName: string;
  avatarSource?: ImageSourcePropType;
  upcomingEventsCount: number;
  conferenceCallsCount: number;
  groupCallsCount: number;
  highPriorityTasksCount: number;
  briefingSummary: string;
  ctaLabel?: string;
  onCtaPress?: () => void | Promise<void>;
}

export function MayaBriefingCard({
  userName,
  avatarSource = mayaAvatar,
  upcomingEventsCount,
  conferenceCallsCount,
  groupCallsCount,
  highPriorityTasksCount,
  briefingSummary,
  ctaLabel = "Have a Look!",
  onCtaPress = () => {},
}: MayaBriefingCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="briefingGlow" cx="94%" cy="69%" r="105%">
              <Stop offset="0%" stopColor={palette.green[500]} />
              <Stop offset="50%" stopColor={palette.green[700]} />
              <Stop offset="100%" stopColor={palette.green[900]} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#briefingGlow)" />
        </Svg>
        <View style={styles.heroContent}>
          <View>
            <Text style={styles.greeting}>
              <Text style={styles.mutedText}>Hello </Text>
              <Text>👋</Text>
              <Text style={styles.boldText}> {userName},</Text>
            </Text>
            <Text style={styles.summary}>
              <Text style={styles.mutedText}>You have </Text>
              <Text style={styles.boldText}>
                {upcomingEventsCount} upcoming events
              </Text>
              <Text style={styles.mutedText}> including </Text>
              <Text style={styles.boldText}>
                {conferenceCallsCount} conference call and {groupCallsCount}{" "}
                group voice call.
              </Text>
              <Text style={styles.mutedText}> Also look into </Text>
              <Text style={styles.boldText}>
                {highPriorityTasksCount} high priority tasks
              </Text>
              <Text style={styles.mutedText}> as well.</Text>
            </Text>
          </View>
          <View style={styles.mayaRow}>
            <Image source={avatarSource} style={styles.avatar} />
            <Text style={styles.mayaLabel}>Maya ✨</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.briefing}>{briefingSummary}</Text>
        <PrimaryPressable size="sm" text={ctaLabel} onPress={onCtaPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  hero: {
    overflow: "hidden",
     borderRadius: borderRadius.lg,
  },
  heroContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  greeting: {
    fontFamily: geist.medium,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textInverse,
  },
  summary: {
    fontFamily: geist.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textInverse,
  },
  mutedText: {
    color: withAlpha(colors.textInverse, 0.6),
  },
  boldText: {
    fontFamily: manrope.semiBold,
    color: colors.textInverse,
  },
  mayaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: avatarSize.xs / 2,
    borderWidth: borderWidth.thin,
    borderColor: colors.borderInverse,
  },
  mayaLabel: {
    fontFamily: manrope.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textInverse,
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  briefing: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.textPrimary,
  },
});
