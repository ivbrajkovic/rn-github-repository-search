import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/">
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.text,
    fontSize: {
      xs: theme.typography.fontSizes.xxl,
      md: theme.typography.fontSizes.xxxl,
    },
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: {
      xs: theme.typography.fontSizes.md,
      md: theme.typography.fontSizes.lg,
    },
  },
}));
