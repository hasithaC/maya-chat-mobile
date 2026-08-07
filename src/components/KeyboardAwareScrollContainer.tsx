import {Platform, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {KeyboardAwareScrollViewProps} from 'react-native-keyboard-aware-scroll-view';

interface KeyboardAwareScrollContainerProps
  extends KeyboardAwareScrollViewProps {}

export function KeyboardAwareScrollContainer({
  style,
  contentContainerStyle,
  children,
  ...rest
}: KeyboardAwareScrollContainerProps) {
  return (
    <KeyboardAwareScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={Platform.select({ios: 0, android: 24, default: 0})}
      {...rest}>
      {children}
    </KeyboardAwareScrollView>
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
