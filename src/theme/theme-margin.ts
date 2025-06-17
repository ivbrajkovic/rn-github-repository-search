import {
  getThemeSpacings,
  ThemeSpacingKey,
  ThemeSpacingValue,
} from '@/theme/theme-spacing';

export type ThemeMarginKey = keyof typeof marginMap;
export type CssMargin = (typeof marginMap)[ThemeMarginKey];

const marginMap = {
  m: 'margin',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  mb: 'marginBottom',
  mx: 'marginHorizontal',
  my: 'marginVertical',
} as const;

type ThemeMarginVariants = {
  [K in ThemeMarginKey]: {
    [P in ThemeSpacingKey]?: {
      [M in CssMargin]: ThemeSpacingValue;
    };
  };
};

export const mapThemeMarginVariants = () => {
  const ret = {} as ThemeMarginVariants;
  for (const [margin, cssMargin] of Object.entries(marginMap)) {
    for (const [spacingKey, spacingValue] of Object.entries(getThemeSpacings())) {
      ret[margin as ThemeMarginKey] = {
        ...ret[margin as ThemeMarginKey],
        [spacingKey]: {
          [cssMargin]: spacingValue,
        },
      };
    }
  }
  return ret;
};
