import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTheme, toggleTheme } from '@/theme/theme-slice';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export const ModeToggle = () => {
  const { theme } = useUnistyles();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectTheme);

  const onPressFunction = () => {
    dispatch(toggleTheme());
  };

  return (
    <Pressable hitSlop={24} style={styles.container} onPress={onPressFunction}>
      <MaterialIcons
        size={24}
        name={currentTheme === 'dark' ? 'light-mode' : 'dark-mode'}
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
