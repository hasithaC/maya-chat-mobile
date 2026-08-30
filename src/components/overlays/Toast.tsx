import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  fontSize,
  geist,
  lineHeight,
  shadows,
  spacing,
} from "../../constants/tokens";
import { useToastStore } from "../../core/toast/toast.store";

const AUTO_DISMISS_MS = 3000;
const ANIMATION_MS = 200;

const VARIANT_COLOR: Record<"success" | "error" | "warning", string> = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
};

// Mounted once at the app root (see app/_layout.tsx) and driven entirely by
// the zustand toast store, so any code — including deep async handlers with
// no component of their own — can surface a message via showToast().
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!toast) return;

    opacity.setValue(0);
    translateY.setValue(12);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }).start(() => hideToast());
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timeout);
  }, [toast, opacity, translateY, hideToast]);

  if (!toast) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          bottom: insets.bottom + spacing.lg,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[styles.indicator, { backgroundColor: VARIANT_COLOR[toast.variant] }]}
      />
      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundInverse,
    zIndex: 2000,
    ...shadows.lg,
  },
  indicator: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: borderRadius.full,
  },
  message: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
});
