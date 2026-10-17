import { Camera01Icon, Mic01Icon, Sent02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  geist,
  iconSize,
  lineHeight,
  spacing,
} from "../../constants/tokens";

interface MessageInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend?: () => void;
  onCameraPress?: () => void;
  onMicPress?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInputBar({
  value,
  onChangeText,
  onSend,
  onCameraPress,
  onMicPress,
  placeholder = "Type something...",
  disabled = false,
}: MessageInputBarProps) {
  const hasDraft = value.trim().length > 0;

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        editable={!disabled}
        onSubmitEditing={hasDraft && !disabled ? onSend : undefined}
        returnKeyType={hasDraft ? "send" : "default"}
      />

      {onCameraPress ? (
        <Pressable
          style={styles.iconButton}
          onPress={onCameraPress}
          disabled={disabled}
        >
          <HugeiconsIcon
            icon={Camera01Icon}
            size={iconSize.sm}
            color={colors.textPrimary}
          />
        </Pressable>
      ) : null}
      {hasDraft ? (
        <Pressable style={styles.sendButton} onPress={onSend} disabled={disabled}>
          <HugeiconsIcon
            icon={Sent02Icon}
            size={iconSize.sm}
            color={colors.textInverse}
          />
        </Pressable>
      ) : (
        <Pressable
          style={styles.iconButton}
          onPress={onMicPress}
          disabled={disabled}
        >
          <HugeiconsIcon
            icon={Mic01Icon}
            size={iconSize.sm}
            color={colors.textPrimary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: controlHeight.lg / 2,
    height: controlHeight.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.backgroundPrimary,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
  iconButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: controlHeight.xs,
    height: controlHeight.xs,
    borderRadius: controlHeight.xs / 2,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
});
