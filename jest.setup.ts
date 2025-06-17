// Mock react-native-unistyles
jest.mock('react-native-unistyles', () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        placeholder: '#999',
        dimmed: '#666',
        cardBackground: '#fff',
        text: '#000',
      },
      borderRadius: { lg: 8 },
      spacing: { md: 16, sm: 8 },
      typography: { fontSizes: { md: 14 } },
    },
  }),
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
  },
}));
