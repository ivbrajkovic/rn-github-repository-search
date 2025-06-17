const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
} as const;

export type ThemeBreakpoints = typeof breakpoints;
export type ThemeBreakpointsKey = keyof typeof breakpoints;
export type ThemeBreakpointsValue = (typeof breakpoints)[ThemeBreakpointsKey];
export const themeBreakpointsKeys = Object.keys(breakpoints) as ThemeBreakpointsKey[];

export const getThemeBreakpoints = () => ({ ...breakpoints });
export const getThemeBreakpoint = (key: ThemeBreakpointsKey) => breakpoints[key];
