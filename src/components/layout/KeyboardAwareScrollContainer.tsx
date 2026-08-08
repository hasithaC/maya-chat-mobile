import { spacing } from "@/constants/tokens";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import type { ScrollViewProps } from "react-native";

interface KeyboardAwareScrollContainerProps extends ScrollViewProps {}

export function KeyboardAwareScrollContainer({
  style,
  contentContainerStyle,
  children,
  ...rest
}: KeyboardAwareScrollContainerProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.select({
        ios: spacing.none,
        android: spacing["2xl"],
        default: spacing.none,
      })}
    >
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
