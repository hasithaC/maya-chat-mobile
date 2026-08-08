import { Search01Icon, Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  borderRadius,
  borderWidth,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  primaryFontFamily,
  spacing,
  withAlpha,
} from "../../constants/tokens";

interface PrimarySearchInputProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  debounceDelay?: number;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function PrimarySearchInput({
  placeholder = "Search...",
  onSearch,
  debounceDelay = 500,
  value: controlledValue,
  onChangeText,
}: PrimarySearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [value, debounceDelay, onSearch]);

  const handleChangeText = (text: string) => {
    if (isControlled) {
      onChangeText?.(text);
    } else {
      setInternalValue(text);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? colors.borderAccent
            : withAlpha(colors.borderAccent, 0),
        },
      ]}
    >
      <HugeiconsIcon
        icon={Search02Icon}
        size={iconSize.xs}
        color={colors.textPrimary}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor={colors.textSecondary}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: controlHeight.lg,
    gap: spacing.md,
    borderRadius: borderRadius["2xl"],
    backgroundColor: colors.backgroundSecondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: borderWidth.thin,
  },
  input: {
    flex: 1,
    fontFamily: primaryFontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textPrimary,
  },
});
