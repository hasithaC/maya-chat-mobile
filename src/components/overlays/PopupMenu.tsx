import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Platform } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import {
  BackHandler,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
} from "../../constants/tokens";

interface PopupMenuProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

// Deliberately NOT using React Native's <Modal> here — on Android it opens
// a separate native window that conflicts with react-native-screens'
// Fragment-based screen management (used by expo-router), which is a
// documented cause of app freezes. This is just an in-app overlay, so a
// plain absolutely-positioned View avoids that conflict entirely.
export function PopupMenu({ visible, onClose, style, children }: PopupMenuProps) {
  useEffect(() => {
    if (!visible || Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => subscription.remove();
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.menu, style]}>{children}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing["2xl"],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  menu: {
    width: "100%",
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundPrimary,
    overflow: "hidden",
    ...shadows.md,
  },
});
