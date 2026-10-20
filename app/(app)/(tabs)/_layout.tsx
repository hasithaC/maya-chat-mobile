import {Tabs} from 'expo-router';
import {TabBar} from '../../../src/components';

// Home is hidden from the tab bar for v1.0.0 (see TabBar's
// HIDDEN_ROUTE_NAMES) — Chats is the landing tab while it's out.
//
// This has to be set BOTH here (read statically by expo-router to resolve
// URLs like `/(app)` on login redirect) and as the `initialRouteName` prop
// below (read by the Tabs navigator once it actually mounts) — they're two
// separate mechanisms and setting only one leaves the other defaulting back
// to Home.
export const unstable_settings = {
  initialRouteName: 'chats',
};

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="chats"
      tabBar={props => <TabBar {...props} />}
      screenOptions={{headerShown: false}}
    >
      <Tabs.Screen name="index" options={{title: 'Home'}} />
      <Tabs.Screen name="profile" options={{title: 'Profile'}} />
      <Tabs.Screen name="mails" options={{title: 'Mails'}} />
      <Tabs.Screen name="remind" options={{title: 'Remind'}} />
      <Tabs.Screen name="calls" options={{title: 'Calls'}} />
      <Tabs.Screen name="chats" options={{title: 'Chats'}} />
    </Tabs>
  );
}
