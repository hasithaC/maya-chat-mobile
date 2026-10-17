import {Tabs} from 'expo-router';
import {TabBar} from '../../../src/components';

export default function TabsLayout() {
  return (
    <Tabs
      // Home is hidden from the tab bar for v1.0.0 (see TabBar's
      // HIDDEN_ROUTE_NAMES) — Chats is the landing tab while it's out.
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
