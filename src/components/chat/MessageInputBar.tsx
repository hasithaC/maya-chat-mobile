import { Camera01Icon, Mic01Icon } from "@hugeicons/core-free-icons";
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
  onCameraPress?: () => void;
  onMicPress?: () => void;
  placeholder?: string;
}

export function MessageInputBar({
  value,
  onChangeText,
  onCameraPress,
  onMicPress,
  placeholder = "Type something...",
}: MessageInputBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <Pressable style={styles.iconButton} onPress={onCameraPress}>
        <HugeiconsIcon
          icon={Camera01Icon}
          size={iconSize.sm}
          color={colors.textPrimary}
        />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onMicPress}>
        <HugeiconsIcon
          icon={Mic01Icon}
          size={iconSize.sm}
          color={colors.textPrimary}
        />
      </Pressable>
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
});
