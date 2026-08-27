import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useCallback, useMemo, useState } from "react";
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  manrope,
  spacing,
  withAlpha,
} from "../../constants/tokens";

interface PrimaryTextInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  helperText?: string;
  leftIcon?: ComponentProps<typeof Ionicons>["name"];
}

export function PrimaryTextInput({
  label,
  containerStyle,
  inputStyle,
  disabled = false,
  helperText,
  error,
  leftIcon,
  onFocus,
  onBlur,
  ...rest
}: PrimaryTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const focusStyle = useMemo(
    () => ({
      borderColor: isFocused
        ? colors.borderAccent
        : withAlpha(colors.borderAccent, 0),
    }),
    [isFocused],
  );

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, focusStyle]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={iconSize.xs} color={colors.textSecondary} />
        )}
        <TextInput
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          {...rest}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, disabled && styles.disabled, inputStyle]}
        />
      </View>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },
  inputContainer: {
    width: "100%",
    height: controlHeight.lg,
    gap: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius["2xl"],
    borderWidth: borderWidth.thin,
    backgroundColor: colors.backgroundSecondary,
  },
  label: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontFamily: manrope.regular,
    color: colors.textPrimary,
  },
  disabled: {
    color: colors.textSecondary,
  },
  helperText: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: lineHeight.xs,
  },
  errorText: {
    fontFamily: manrope.regular,
    fontSize: fontSize.xs,
    color: colors.error,
    lineHeight: lineHeight.xs,
  },
});
