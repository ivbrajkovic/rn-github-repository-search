import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { UniStack } from '@/components/uni-stack/uni-stack';
import { StoreProvider } from '@/store/store-provider';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 1000, fade: true });

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ErrorBoundary>
      <StoreProvider>
        <UniStack>
          <Stack.Screen name="index" options={{ title: 'GitHub Repository Search' }} />
          <Stack.Screen
            name="repository/[id]"
            options={{ title: 'Repository Details' }}
          />
        </UniStack>
        <StatusBar style="auto" />
      </StoreProvider>
    </ErrorBoundary>
  );
}
