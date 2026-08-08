import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useAuthStore} from '../../src/domain/auth/store/auth.store';

export default function DashboardScreen() {
  const logout = useAuthStore(s => s.logout);

  return (
    <View style={styles.container}>
      <Text>You're signed in.</Text>
      <Pressable style={styles.signOutButton} onPress={() => logout()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
