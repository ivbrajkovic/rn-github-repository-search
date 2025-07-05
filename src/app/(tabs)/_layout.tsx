import { UniTabs } from '@/components/uni-tabs/uni-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <UniTabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          headerTitle: 'GitHub Repository Search',
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          headerShown: true,
          headerTitle: 'GitHub Favorite Repositories',
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Ionicons name="star" size={28} color={color} />,
        }}
      />
    </UniTabs>
  );
}
