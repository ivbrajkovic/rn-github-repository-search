import { UniStack } from '@/components/uni-stack/uni-stack';
import { Stack } from 'expo-router';

export default function RepositoriesStack() {
  return (
    <UniStack>
      <Stack.Screen name="index" options={{ headerTitle: 'GitHub Repository Search' }} />
      <Stack.Screen name="repository/[id]" options={{ title: 'Repository Details' }} />
    </UniStack>
  );
}
