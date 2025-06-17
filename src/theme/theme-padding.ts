import {
  getThemeSpacings,
  ThemeSpacingKey,
  ThemeSpacingValue,
} from '@/theme/theme-spacing';

export type ThemePaddingKey = keyof typeof marginMap;
export type CssPadding = (typeof marginMap)[ThemePaddingKey];

const marginMap = {
  p: 'padding',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
} as const;

type ThemePaddingVariants = {
  [K in ThemePaddingKey]: {
    [P in ThemeSpacingKey]?: {
      [M in CssPadding]: ThemeSpacingValue;
    };
  };
};

export const mapThemePaddingVariants = (): ThemePaddingVariants => {
  const ret = {} as ThemePaddingVariants;
  for (const [padding, cssPadding] of Object.entries(marginMap)) {
    for (const [spacingKey, spacingValue] of Object.entries(getThemeSpacings())) {
      ret[padding as ThemePaddingKey] = {
        ...ret[padding as ThemePaddingKey],
        [spacingKey]: {
          [cssPadding]: spacingValue,
        },
      };
    }
  }
  return ret;
};
