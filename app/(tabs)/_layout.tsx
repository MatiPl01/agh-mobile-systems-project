import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab
      }}>
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name='house.fill' size={28} />
          ),
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name='camera.fill' size={28} />
          ),
          title: 'Scanner'
        }}
      />
    </Tabs>
  );
}
