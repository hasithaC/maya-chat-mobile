import { Call02Icon, CallEnd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  fontSize,
  geist,
  iconSize,
  manrope,
  palette,
  spacing,
} from "../../constants/tokens";
import { useCallDuration } from "../../domain/calls/hooks/useCallDuration";
import { voiceService } from "../../domain/calls/services/voice.service";
import { useCallStore } from "../../domain/calls/store/call.store";
import { CallAvatar } from "./CallAvatar";
import { getCallStatusLabel } from "./call-status";

const AVATAR_SIZE = 40;
const ACTION_SIZE = 40;

function CallBanner() {
  const session = useCallStore((state) => state.session);
  const setMinimized = useCallStore((state) => state.setMinimized);
  const duration = useCallDuration(session?.connectedAt);

  if (!session) return null;

  const isRinging = session.status === "ringing";

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Pressable
          style={styles.peer}
          onPress={() => setMinimized(false)}
          accessibilityRole="button"
          accessibilityLabel="Open call"
        >
          <CallAvatar peer={session.peer} size={AVATAR_SIZE} borderWidth={1.2} />
          <View style={styles.titles}>
            <Text style={styles.name} numberOfLines={1}>
              {session.peer.name}
            </Text>
            <Text style={styles.status} numberOfLines={1}>
              {getCallStatusLabel(session.status, duration)}
            </Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={[styles.action, styles.actionDanger]}
            onPress={() => voiceService.hangup()}
            accessibilityRole="button"
            accessibilityLabel={isRinging ? "Decline call" : "End call"}
          >
            <HugeiconsIcon
              icon={CallEnd01Icon}
              size={iconSize.md}
              color={colors.textInverse}
            />
          </Pressable>
          {isRinging ? (
            <Pressable
              style={[styles.action, styles.actionAccept]}
              onPress={() => voiceService.accept()}
              accessibilityRole="button"
              accessibilityLabel="Answer call"
            >
              <HugeiconsIcon
                icon={Call02Icon}
                size={iconSize.md}
                color={colors.textInverse}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// Wraps the app's navigator so a minimized call shows as a banner pinned
// above every screen. The banner takes the top safe-area itself, so the
// inset context below it is zeroed — screens that pad by
// useSafeAreaInsets() don't leave a second status-bar gap under it.
export function CallBannerLayout({ children }: PropsWithChildren) {
  const isBannerVisible = useCallStore((state) =>
    Boolean(state.session?.isMinimized),
  );
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.layout}>
      {isBannerVisible ? (
        <View style={{ paddingTop: insets.top }}>
          <CallBanner />
        </View>
      ) : null}
      <SafeAreaInsetsContext.Provider
        value={isBannerVisible ? { ...insets, top: 0 } : insets}
      >
        {children}
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  wrapper: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundPrimary,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2xl"],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    borderColor: colors.borderAccent,
    backgroundColor: palette.green[50],
    shadowColor: palette.green[300],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.48,
    shadowRadius: 4,
    elevation: 2,
  },
  peer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titles: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontFamily: manrope.bold,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm,
    color: colors.textPrimary,
  },
  status: {
    fontFamily: geist.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs,
    color: colors.textAccent,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actionDanger: {
    backgroundColor: colors.buttonDanger,
  },
  actionAccept: {
    backgroundColor: colors.buttonPrimary,
  },
});
