import type {PropsWithChildren} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';
import type {Edge} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';

interface SafeAreaContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

export function SafeAreaContainer({
  children,
  style,
  edges = ['top', 'bottom'],
}: SafeAreaContainerProps) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
