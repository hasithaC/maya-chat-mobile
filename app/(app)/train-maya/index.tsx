import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import mayaAvatar from "@/assets/images/avatars/maya-avatar-large.png";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { PrimaryPressable } from "../../../src/components";
import { ROUTES } from "../../../src/constants/routes";
import {
  avatarSize,
  borderRadius,
  borderWidth,
  colors,
  deviceWidth,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  spacing,
} from "../../../src/constants/tokens";
import { useAuthStore } from "../../../src/domain/auth/store/auth.store";

const glowSize = deviceWidth - 2 * spacing.lg;

interface IntroMessageCardProps {
  text: string;
  time: string;
}

function IntroMessageCard({ text, time }: IntroMessageCardProps) {
  return (
    <View style={styles.messageCard}>
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.messageTime}>{time}</Text>
    </View>
  );
}

export default function TrainMayaScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const containerInsetStyle = {
    paddingTop: Math.max(insets.top, spacing.lg),
    paddingBottom: Math.max(insets.bottom, spacing.lg),
  };

  return (
    <View style={[styles.container, containerInsetStyle]}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>
            <Text style={styles.titleMuted}>Alright</Text>, {firstName}
          </Text>
          <Text style={styles.title}>I'm Maya Your Personal Assistant.</Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.glow} pointerEvents="none">
            <Svg width={glowSize} height={glowSize}>
              <Defs>
                <RadialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
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
                fill="url(#heroGlow)"
              />
            </Svg>
          </View>

          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Image source={mayaAvatar} style={styles.avatarImage} />
            </View>
            <View style={[styles.avatar, styles.avatarRight]}>
              {typeof user?.avatar === "string" ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <HugeiconsIcon
                  icon={UserIcon}
                  size={iconSize["5xl"]}
                  color={colors.textSecondary}
                />
              )}
            </View>
          </View>

          <View style={styles.messageStack}>
            <View style={styles.messageStackBack} />
            <IntroMessageCard
              text="As an AI assistant I'll work alongside you to understand your work, priorities, and challenges - so I can help you better every day."
              time="Now"
            />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryPressable
          text="Let's Setup Maya"
          onPress={() => router.push(ROUTES.trainMayaVoicePersona)}
        />
        <PrimaryPressable
          text="Maybe Later"
          appearance="outline"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    gap: spacing["2xl"],
  },
  heading: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: manrope.bold,
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    color: colors.textPrimary,
  },
  titleMuted: {
    color: colors.textSecondary,
  },
  heroSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["2xl"],
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: avatarSize["3xl"],
    height: avatarSize["3xl"],
    borderRadius: avatarSize["3xl"] / 2,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: borderWidth.thick,
    borderColor: colors.borderInverse,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarRight: {
    zIndex: 1,
    marginLeft: -avatarSize["3xl"] / 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  actions: {
    gap: spacing.md,
  },
  messageStack: {
    width: "100%",
  },
  messageStackBack: {
    position: "absolute",
    top: spacing.md,
    bottom: -spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundInverseSecondaryStrong,
  },
  messageCard: {
    width: "100%",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  messageText: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  messageTime: {
    alignSelf: "flex-end",
    fontFamily: geist.regular,
    fontSize: fontSize["2xs"],
    lineHeight: lineHeight["2xs"],
    color: colors.textSecondary,
  },
});
