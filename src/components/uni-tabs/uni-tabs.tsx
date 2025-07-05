import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Tabs } from 'expo-router';
import { withUnistyles } from 'react-native-unistyles';

export const UniTabs = withUnistyles(Tabs, (theme, rt) => ({
  screenOptions: {
    headerStyle: {
      backgroundColor: theme.colors.body,
      borderBottomColor: theme.colors.border,
      borderTopWidth: 1,
    },
    headerTitleStyle: { color: theme.colors.text },
    headerTintColor: theme.colors.text,
    headerRight: () => <ModeToggle />,
    tabBarItemStyle: {},
    tabBarActiveTintColor: theme.colors.primary,
    tabBarStyle: {
      backgroundColor: theme.colors.body,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
  },
}));
