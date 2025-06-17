export type ThemeSpacingKey = keyof typeof themeSpacing;
export type ThemeSpacingValue = (typeof themeSpacing)[ThemeSpacingKey];

const themeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  huge: 56,
  massive: 64,
  '2huge': 72,
  '3huge': 80,
  '4huge': 96,
} as const;

export const themeSpacingKeys = Object.keys(themeSpacing) as ThemeSpacingKey[];
export const themeSpacingValues = Object.values(themeSpacing) as ThemeSpacingValue[];
export const getThemeSpacings = () => ({ ...themeSpacing });
export const getThemeSpacing = (key: ThemeSpacingKey) => themeSpacing[key];
