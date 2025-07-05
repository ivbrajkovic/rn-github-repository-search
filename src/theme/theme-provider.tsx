import { useAppSelector } from '@/store/hooks';
import { selectTheme } from '@/theme/theme-slice';
import { PropsWithChildren, useEffect } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    if (UnistylesRuntime.themeName !== theme) {
      UnistylesRuntime.setTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
};
