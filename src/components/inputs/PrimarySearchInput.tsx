import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  borderRadius,
  colors,
  controlHeight,
  fontSize,
  iconSize,
  lineHeight,
  geist,
  spacing,
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
    <View style={styles.container}>
      <HugeiconsIcon
        icon={Search01Icon}
        size={iconSize.sm}
        color={colors.textPrimary}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor={colors.textSecondary}
        onChangeText={handleChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: controlHeight.md,
    gap: spacing.sm,
    borderRadius: borderRadius["2xl"],
    backgroundColor: colors.backgroundSecondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    fontFamily: geist.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondary,
  },
});
