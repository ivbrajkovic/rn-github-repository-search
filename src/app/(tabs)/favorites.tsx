import { RepositoryList } from '@/components/repository-list/repository-list';
import { useGetRepositoriesByIdsQuery } from '@/store/api/github-api';
import { useAppSelector } from '@/store/hooks';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function FavoritesScreen() {
  const favoriteRepositoryIds = useAppSelector((state) => state.favorites.repositoryIds);
  const { data, isLoading } = useGetRepositoriesByIdsQuery(favoriteRepositoryIds, {
    skip: favoriteRepositoryIds.length === 0,
  });

  if (favoriteRepositoryIds.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.noFavoritesText}>No favorite repositories yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <RepositoryList
          repositories={data || []}
          isLoading={isLoading}
          searchQuery=""
          onRefresh={() => {
            // TODO: implement refresh
          }}
          onLoadMore={() => {
            // TODO: implement load more
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  page: {
    flex: 1,
    paddingTop: theme.spacing.md,
    paddingBottom: rt.insets.bottom,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  noFavoritesText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.dimmed,
  },
}));
