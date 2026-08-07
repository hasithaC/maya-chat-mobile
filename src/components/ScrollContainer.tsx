import type {ScrollViewProps} from 'react-native';
import {ScrollView, StyleSheet} from 'react-native';

interface ScrollContainerProps extends ScrollViewProps {}

export function ScrollContainer({
  style,
  contentContainerStyle,
  children,
  ...rest
}: ScrollContainerProps) {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...rest}>
      {children}
    </ScrollView>
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
