import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaContainer} from '../../../src/components';
import {colors, fontSize, lineHeight, manrope} from '../../../src/constants/tokens';

export default function CallsScreen() {
  return (
    <SafeAreaContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.text}>Calls</Text>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundPrimary,
  },
  text: {
    fontFamily: manrope.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    color: colors.textPrimary,
  },
});
