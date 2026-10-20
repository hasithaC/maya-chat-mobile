import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  lineHeight,
  manrope,
  spacing,
} from "../../constants/tokens";
import { BottomSheet } from "./BottomSheet";

interface ConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
}

export function ConfirmationSheet({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
}: ConfirmationSheetProps) {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.content}>
        {description ? <Text style={styles.description}>{description}</Text> : null}

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              confirmVariant === "danger" ? styles.dangerButton : styles.primaryButton,
            ]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  description: {
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    height: controlHeight.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
  },
  cancelButton: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  cancelText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  dangerButton: {
    backgroundColor: colors.buttonDanger,
  },
  primaryButton: {
    backgroundColor: colors.buttonPrimary,
  },
  confirmText: {
    fontFamily: manrope.semiBold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textInverse,
  },
});
