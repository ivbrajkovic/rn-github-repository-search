import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Stack } from 'expo-router';
import { withUnistyles } from 'react-native-unistyles';

export const UniStack = withUnistyles(Stack, (theme, rt) => ({
  screenOptions: {
    headerStyle: { backgroundColor: theme.colors.body },
    headerTitleStyle: { color: theme.colors.text },
    headerTintColor: theme.colors.text,
    headerRight: () => <ModeToggle />,
    contentStyle: { backgroundColor: theme.colors.background },
  },
}));
