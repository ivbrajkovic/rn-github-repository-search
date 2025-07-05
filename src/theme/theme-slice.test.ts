import { selectTheme, setTheme, themeReducer, toggleTheme } from './theme-slice';

describe('themeSlice', () => {
  const initialState = {
    theme: 'light' as const,
  };

  it('should return the initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set theme to light', () => {
    const darkState = { theme: 'dark' as const };
    const actual = themeReducer(darkState, setTheme('light'));
    expect(actual.theme).toEqual('light');
  });

  it('should set theme to dark', () => {
    const actual = themeReducer(initialState, setTheme('dark'));
    expect(actual.theme).toEqual('dark');
  });

  it('should toggle theme from light to dark', () => {
    const actual = themeReducer(initialState, toggleTheme());
    expect(actual.theme).toEqual('dark');
  });

  it('should toggle theme from dark to light', () => {
    const darkState = { theme: 'dark' as const };
    const actual = themeReducer(darkState, toggleTheme());
    expect(actual.theme).toEqual('light');
  });

  describe('selectTheme', () => {
    it('should select the current theme', () => {
      const state = { theme: { theme: 'dark' as const } };
      expect(selectTheme(state)).toEqual('dark');
    });

    it('should select light theme by default', () => {
      const state = { theme: { theme: 'light' as const } };
      expect(selectTheme(state)).toEqual('light');
    });
  });
});
