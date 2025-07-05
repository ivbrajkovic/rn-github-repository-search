import React, { useEffect } from 'react';
import { Alert, Platform, View } from 'react-native';

import { RepositoryList } from '@/components/repository-list/repository-list';
import { SearchInput } from '@/components/search-input/search-input';
import { SearchOptions } from '@/components/search-options/search-options';
import { useSearchParams } from '@/hooks/use-search-params';
import { useLazySearchRepositoriesQuery } from '@/store/api/github-api';
import { Repository } from '@/store/api/github-api-types';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';

const emptyArray: (Repository & { isFavorite: boolean })[] = [];

const handleFetchError = (error: any) => {
  Platform.OS === 'web'
    ? alert('Failed to fetch data. Please try again later.')
    : Alert.alert('Error', 'Failed to fetch data. Please try again later.');
  __DEV__ && console.error('Fetch error:', error);
};

const HomeScreen = () => {
  const router = useRouter();
  const { query, page, per_page, sort, order } = useSearchParams();

  const [getRepositories, { isLoading, error, data, reset }] =
    useLazySearchRepositoriesQuery();

  useEffect(() => {
    if (!query) reset();
    else getRepositories({ query, page, per_page, sort, order }, true);
  }, [query, page, per_page, sort, order, getRepositories, reset]);

  useEffect(() => {
    if (error) handleFetchError(error);
  }, [error]);

  const hasNextPage =
    !!page &&
    !!per_page &&
    !!data &&
    data.total_count > page * per_page &&
    data.items.length === per_page;

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) router.setParams({ page: page + 1 });
  };
  const handleRefresh = () => {
    if (!query) return;

    // For a pull-to-refresh action:
    // 1. If already on page 1, just refetch without changing params
    // 2. If not on page 1, set page to 1 (which will trigger a refetch automatically)
    if (page === 1) getRepositories({ query, page, per_page, sort, order });
    else router.setParams({ page: 1 });
  };

  return (
    <View style={styles.container}>
      <SearchInput />
      <SearchOptions />
      <RepositoryList
        isLoading={isLoading}
        searchQuery={query}
        repositories={data?.items ?? emptyArray}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        hasNextPage={hasNextPage}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: rt.insets.bottom,
    backgroundColor: theme.colors.background,
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto',
  },
}));

export default HomeScreen;
