import {
  Call02Icon,
  CallEnd01Icon,
  ChevronLeftIcon,
  Clock01Icon,
  Message01Icon,
  MicOff01Icon,
  MoreVerticalIcon,
  Video01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  manrope,
  minHitSlop,
  palette,
  spacing,
} from "../../constants/tokens";
import { useCallDuration } from "../../domain/calls/hooks/useCallDuration";
import { voiceService } from "../../domain/calls/services/voice.service";
import { useCallStore } from "../../domain/calls/store/call.store";
import { CallAvatar } from "./CallAvatar";
import { getCallStatusLabel } from "./call-status";

const AVATAR_SIZE = 200;
const AVATAR_RING = 6;
const GLOW_SIZE = AVATAR_SIZE * 2;
const CONTROL_SIZE = 56;
const SECONDARY_ACTION_SIZE = 48;
const CONTROL_ICON_SIZE = 22;
const CONTROL_BORDER_WIDTH = 1.4;

interface CallControlButtonProps {
  icon: typeof VolumeHighIcon;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  onPress?: () => void;
}

function CallControlButton({
  icon,
  active = false,
  danger = false,
  disabled = false,
  accessibilityLabel,
  onPress,
}: CallControlButtonProps) {
  const filled = active || danger;

  return (
    <Pressable
      style={[
        styles.control,
        danger
          ? styles.controlDanger
          : active
            ? styles.controlActive
            : styles.controlOutline,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
    >
      <HugeiconsIcon
        icon={icon}
        size={CONTROL_ICON_SIZE}
        color={filled ? colors.textInverse : palette.green[800]}
      />
    </Pressable>
  );
}

// Full-screen call UI for every call state (incoming, dialing, in call).
// Mounted once at the app root and driven by the call store; "back"
// minimizes to the CallBanner instead of ending the call.
export function CallScreen() {
  const session = useCallStore((state) => state.session);
  const setMinimized = useCallStore((state) => state.setMinimized);
  const duration = useCallDuration(session?.connectedAt);
  const insets = useSafeAreaInsets();

  const visible = Boolean(session && !session.isMinimized);
  const isRinging = session?.status === "ringing";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => setMinimized(true)}
    >
      {session ? (
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              style={styles.headerButton}
              onPress={() => setMinimized(true)}
              hitSlop={spacing.sm}
              accessibilityLabel="Minimize call"
            >
              <HugeiconsIcon
                icon={ChevronLeftIcon}
                size={iconSize.md}
                color={colors.textPrimary}
              />
            </Pressable>
            <Pressable style={styles.headerButton} hitSlop={minHitSlop}>
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={iconSize.md}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={styles.peer}>
              <View style={styles.avatarArea}>
                <View style={styles.glow} pointerEvents="none">
                  <Svg width={GLOW_SIZE} height={GLOW_SIZE}>
                    <Defs>
                      <RadialGradient
                        id="callGlow"
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <Stop
                          offset="0%"
                          stopColor={colors.backgroundAccentStrong}
                          stopOpacity={0.4}
                        />
                        <Stop
                          offset="100%"
                          stopColor={colors.backgroundAccentStrong}
                          stopOpacity={0}
                        />
                      </RadialGradient>
                    </Defs>
                    <Circle
                      cx={GLOW_SIZE / 2}
                      cy={GLOW_SIZE / 2}
                      r={GLOW_SIZE / 2}
                      fill="url(#callGlow)"
                    />
                  </Svg>
                </View>
                <CallAvatar
                  peer={session.peer}
                  size={AVATAR_SIZE}
                  borderWidth={AVATAR_RING}
                />
              </View>

              <View style={styles.titles}>
                <Text style={styles.name} numberOfLines={1}>
                  {session.peer.name}
                </Text>
                <Text style={styles.status}>
                  {getCallStatusLabel(session.status, duration)}
                </Text>
              </View>

              {isRinging ? (
                <View style={styles.secondaryActions}>
                  <Pressable
                    style={styles.secondaryAction}
                    accessibilityLabel="Remind me later"
                  >
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={CONTROL_ICON_SIZE}
                      color={palette.ink[600]}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.secondaryAction}
                    accessibilityLabel="Reply with a message"
                  >
                    <HugeiconsIcon
                      icon={Message01Icon}
                      size={iconSize.md}
                      color={palette.ink[600]}
                    />
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.footer}>
            {isRinging ? (
              <View style={styles.answerRow}>
                <Pressable
                  style={[styles.answerButton, styles.controlDanger]}
                  onPress={() => voiceService.reject()}
                  accessibilityRole="button"
                >
                  <HugeiconsIcon
                    icon={CallEnd01Icon}
                    size={iconSize.lg}
                    color={colors.textInverse}
                  />
                  <Text style={styles.answerLabel}>Hangup</Text>
                </Pressable>
                <Pressable
                  style={[styles.answerButton, styles.controlActive]}
                  onPress={() => voiceService.accept()}
                  accessibilityRole="button"
                >
                  <HugeiconsIcon
                    icon={Call02Icon}
                    size={iconSize.lg}
                    color={colors.textInverse}
                  />
                  <Text style={styles.answerLabel}>Answer</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.controlRow}>
                <CallControlButton
                  icon={VolumeHighIcon}
                  active={session.isSpeakerOn}
                  accessibilityLabel="Speaker"
                  onPress={() => voiceService.toggleSpeaker()}
                />
                <CallControlButton
                  icon={Video01Icon}
                  disabled
                  accessibilityLabel="Video"
                />
                <CallControlButton
                  icon={MicOff01Icon}
                  active={session.isMuted}
                  disabled={session.status !== "connected"}
                  accessibilityLabel="Mute"
                  onPress={() => voiceService.toggleMute()}
                />
                <CallControlButton
                  icon={CallEnd01Icon}
                  danger
                  accessibilityLabel="End call"
                  onPress={() => voiceService.hangup()}
                />
              </View>
            )}
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  headerButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["2xl"],
  },
  peer: {
    width: "100%",
    alignItems: "center",
    gap: spacing["2xl"],
  },
  avatarArea: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    top: (AVATAR_SIZE - GLOW_SIZE) / 2,
    left: (AVATAR_SIZE - GLOW_SIZE) / 2,
  },
  titles: {
    width: "100%",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    fontFamily: manrope.extraBold,
    fontSize: fontSize["2xl"],
    lineHeight: lineHeight.xl,
    letterSpacing: -0.48,
    color: colors.textPrimary,
    textAlign: "center",
  },
  status: {
    fontFamily: geist.regular,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.1,
    color: palette.border[900],
    textAlign: "center",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing["2xl"],
  },
  secondaryAction: {
    width: SECONDARY_ACTION_SIZE,
    height: SECONDARY_ACTION_SIZE,
    borderRadius: SECONDARY_ACTION_SIZE / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing["2xl"],
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  control: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: CONTROL_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  controlActive: {
    backgroundColor: colors.buttonPrimary,
  },
  controlDanger: {
    backgroundColor: colors.buttonDanger,
  },
  controlOutline: {
    backgroundColor: colors.backgroundPrimary,
    borderWidth: CONTROL_BORDER_WIDTH,
    borderColor: palette.green[800],
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["2xl"],
  },
  answerButton: {
    height: CONTROL_SIZE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingLeft: spacing["2xl"],
    paddingRight: spacing["3xl"],
    borderRadius: borderRadius.full,
  },
  answerLabel: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.1,
    color: colors.textInverse,
  },
});
