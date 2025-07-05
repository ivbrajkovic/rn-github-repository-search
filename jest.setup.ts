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
    rt: {
      themeName: 'light',
    },
  }),
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
  },
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock fetch to prevent RTK Query from making actual network calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
) as jest.Mock;
