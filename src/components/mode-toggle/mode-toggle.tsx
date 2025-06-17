import { mmkvStore } from '@/mmkv-store/mmkv-store-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

export const ModeToggle = () => {
  const { theme } = useUnistyles();

  const onPressFunction = () => {
    const newTheme = UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark';
    UnistylesRuntime.setTheme(newTheme);
    mmkvStore.set('preferredTheme', newTheme);
  };

  return (
    <Pressable hitSlop={24} style={styles.container} onPress={onPressFunction}>
      <MaterialIcons
        size={24}
        name={UnistylesRuntime.themeName === 'dark' ? 'light-mode' : 'dark-mode'}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    _web: {
      marginRight: theme.spacing.md,
    },
  },
}));
