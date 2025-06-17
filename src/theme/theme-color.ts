const sharedThemeColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  textLight: '#e5e5e7ff',
  gray0: '#f8f9fa',
  gray1: '#f1f3f5',
  gray2: '#e9ecef',
  gray3: '#dee2e6',
  gray4: '#ced4da',
  gray5: '#adb5bd',
  gray6: '#868e96',
  gray7: '#495057',
  gray8: '#343a40',
  gray9: '#212529',
  gray10: '#121416',
  gray11: '#0b0c0e',
  gray12: '#000000',
  silver: '#bdc3c7',
  dark0: '#C9C9C9',
  dark1: '#b8b8b8',
  dark2: '#828282',
  dark3: '#696969',
  dark4: '#424242',
  dark5: '#3b3b3b',
  dark6: '#2e2e2e',
  dark7: '#242424',
  dark8: '#1f1f1f',
  dark9: '#141414',
} as const;

const lightThemeColors = {
  ...sharedThemeColors,
  primary: '#007affff',
  secondary: '#5856d6ff',
  error: '#ff3b30ff',
  success: '#4cd964ff',
  warning: '#ffcc00ff',
  tint: '#007affff',
  link: '#007affff',
  body: sharedThemeColors.white,
  background: sharedThemeColors.gray1,
  text: sharedThemeColors.black,
  textSecondary: '#808a92ff',
  placeholder: sharedThemeColors.gray5,
  textInvert: '#e5e5e7ff',
  dimmed: '#868e96ff',
  cardBackground: sharedThemeColors.white,
  cardShadowColor: '#0000001a',
  border: '#d1d5dbff',
  borderLight: '#e2e8f0ff',
  borderDark: '#4a5568ff',
} as const;

const darkThemeColors = {
  ...sharedThemeColors,
  primary: '#0a84ffff',
  secondary: '#5e5ce6ff',
  error: '#ff6b6b',
  success: '#30d158ff',
  warning: '#ffd60aff',
  tint: '#0a84ffff',
  link: '#0a84ffff',
  text: sharedThemeColors.dark0,
  textInvert: '#1c1c1eff',
  textSecondary: '#818b94ff',
  placeholder: sharedThemeColors.dark3,
  dimmed: '#828282',
  body: sharedThemeColors.dark7,
  background: sharedThemeColors.dark8,
  cardBackground: sharedThemeColors.dark6,
  cardShadowColor: '#0000001a',
  border: '#4a5568ff',
  borderLight: '#2d3748ff',
  borderDark: '#a0aec0ff',
} as const;

export const getLightThemeColors = () => ({ ...lightThemeColors });
export const getDarkThemeColors = () => ({ ...darkThemeColors });

type ThemeColorKey = keyof typeof lightThemeColors | keyof typeof darkThemeColors;
type ThemeColorValue =
  | (typeof lightThemeColors)[keyof typeof lightThemeColors]
  | (typeof darkThemeColors)[keyof typeof darkThemeColors];

type Color = keyof typeof colorMap;
type CssColor = (typeof colorMap)[Color];

const colorMap = {
  c: 'color',
} as const;

type ThemeColorVariants = {
  [K in Color]: {
    [P in ThemeColorKey]?: {
      [M in CssColor]: ThemeColorValue;
    };
  };
};

export const mapThemeColorVariants = (): ThemeColorVariants => {
  const ret = {} as ThemeColorVariants;
  for (const [colorKey, cssColor] of Object.entries(colorMap)) {
    for (const [themeColorKey, themeColorValue] of Object.entries({
      ...lightThemeColors,
      ...darkThemeColors,
    })) {
      ret[colorKey as Color] = {
        ...ret[colorKey as Color],
        [themeColorKey]: {
          [cssColor]: themeColorValue,
        },
      };
    }
  }
  return ret;
};
