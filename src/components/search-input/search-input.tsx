import { useDebounceCallback } from '@/hooks/use-debounce-callback';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const DEBOUNCE_DELAY = 500;

export const SearchInput = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { q: searchQueryParam = '' } = useLocalSearchParams<{ q: string }>();
  const [searchQuery, setSearchQuery] = useState(searchQueryParam.trim());

  const setParamsDebounced = useDebounceCallback((query: string) => {
    // Resetting to page 1 ensures we always start fresh with search results
    router.setParams({ q: query || undefined, page: 1 });
  }, DEBOUNCE_DELAY);

  const handleTextChange = (text: string) => {
    const trimmedText = text.trim();
    setSearchQuery(trimmedText);
    setParamsDebounced(trimmedText);
  };

  const handleClear = () => {
    setSearchQuery('');
    setParamsDebounced('');
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        testID="search-input"
        returnKeyType="search"
        placeholder="Search repositories..."
        placeholderTextColor={theme.colors.placeholder}
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleTextChange}
        accessible={true}
        accessibilityLabel="Search repositories"
        accessibilityHint="Enter repository name to search GitHub"
      />
      {searchQuery ? (
        <TouchableOpacity
          testID="search-clear-button"
          activeOpacity={0.7}
          onPress={handleClear}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          accessibilityHint="Tap to clear the search input"
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.dimmed} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
  },
}));
