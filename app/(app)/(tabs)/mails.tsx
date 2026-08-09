import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaContainer} from '../../../src/components';
import {colors, fontSize, lineHeight, primaryFontFamily} from '../../../src/constants/tokens';

export default function MailsScreen() {
  return (
    <SafeAreaContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.text}>Mails</Text>
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
    fontFamily: primaryFontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    color: colors.textPrimary,
  },
});
