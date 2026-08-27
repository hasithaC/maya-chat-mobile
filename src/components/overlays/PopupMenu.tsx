import type { PropsWithChildren } from "react";
import { Platform } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import {
  KeyboardAvoidingView,
  Modal,
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

export function PopupMenu({ visible, onClose, style, children }: PopupMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.menu, style]}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
