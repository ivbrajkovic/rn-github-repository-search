/* eslint-disable @typescript-eslint/no-empty-object-type */

import { getThemeBreakpoints, ThemeBreakpoints } from '@/theme/theme-breakpoints';
import { getDarkThemeColors, getLightThemeColors } from '@/theme/theme-color';
import { getThemeSpacings } from '@/theme/theme-spacing';
import { StyleSheet } from 'react-native-unistyles';

// Import mmkvStore directly, but access it conditionally in the code
// This ensures we don't try to use it during SSR on web
import { reduxStorage } from '@/mmkv-store/mmkv-store-store';

const shared = {
  utility: {
    gap: (v: number) => v * 8,
    radius: (v: number) => v * 4,
  },
  spacings: getThemeSpacings(),
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      headings:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      huge: 32,
      massive: 36,
      title: 40,
      display: 48,
    },
    lineHeights: {
      xs: 18,
      sm: 20,
      md: 22,
      lg: 24,
      xl: 26,
      xxl: 28,
      xxxl: 30,
      huge: 32,
    },
    fontWeights: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
      black: '900',
    },
    headings: {
      h1: {
        fontSize: 34,
        lineHeight: 40,
        fontWeight: '700',
      },
      h2: {
        fontSize: 26,
        lineHeight: 32,
        fontWeight: '700',
      },
      h3: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '700',
      },
      h4: {
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '700',
      },
      h5: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
      },
      h6: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: '700',
      },
    },
  },
} as const;

const lightTheme = {
  utility: shared.utility,
  spacing: shared.spacings,
  borderRadius: shared.borderRadius,
  typography: shared.typography,
  colors: getLightThemeColors(),
} as const;

const darkTheme = {
  utility: shared.utility,
  spacing: shared.spacings,
  borderRadius: shared.borderRadius,
  typography: shared.typography,
  colors: getDarkThemeColors(),
} as const;

const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

type AppThemes = typeof themes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends ThemeBreakpoints {}
}

// Default theme to use when storage isn't available or there's an error
const defaultTheme: keyof AppThemes = 'light';

// Configure the StyleSheet with proper platform handling
StyleSheet.configure({
  settings: {
    // Use a function for both platforms, but handle them differently
    initialTheme: () => {
      // For safety, always have a default
      let themeToUse: keyof AppThemes = defaultTheme;

      try {
        // Check if we're in a server-side context or browser
        const isServerSide = typeof window === 'undefined';

        // Skip storage access during server-side rendering
        if (isServerSide) {
          return defaultTheme;
        }

        // Now we're sure we're in browser context or native app
        const storedTheme = reduxStorage.getItemSync('preferredTheme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          themeToUse = storedTheme as keyof AppThemes;
          __DEV__ && console.log('Loading stored theme preference:', storedTheme);
        }
      } catch (error) {
        __DEV__ &&
          console.warn(
            'Failed to load theme preference from mmkvStore, using default light theme',
            error
          );
      }

      return themeToUse;
    },
  },
  breakpoints: getThemeBreakpoints(),
  themes: themes,
});
