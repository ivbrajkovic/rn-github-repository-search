import {
  GAP,
  ITEM_HEIGHT,
  PADDING_HORIZONTAL,
  PADDING_TOP,
} from '@/components/repository-list/constants';
import { RepositoryListItem } from '@/components/repository-list/repository-list-item';
import { Repository } from '@/store/api';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type IconProps = {
  name: ComponentProps<typeof Ionicons>['name'];
};

const Icon = (props: IconProps) => {
  const { theme } = useUnistyles();
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={props.name} size={48} color={theme.colors.textSecondary} />
    </View>
  );
};

type RepositoryListProps = {
  isLoading?: boolean;
  hasNextPage?: boolean;
  searchQuery: string;
  repositories: Repository[];
  onRefresh: () => void;
  onLoadMore?: () => void;
  toggleFavorite: (id: number, isFavorite: boolean) => void;
};

export const RepositoryList = ({
  isLoading = false,
  hasNextPage,
  searchQuery,
  repositories,
  onRefresh,
  onLoadMore,
  toggleFavorite,
}: RepositoryListProps) => {
  const keyExtractor = useCallback((item: Repository) => item.id.toString(), []);

  const renderItem: ListRenderItem<Repository> = useCallback(
    ({ item }: { item: Repository }) => (
      <RepositoryListItem item={item} toggleFavorite={toggleFavorite} />
    ),
    [toggleFavorite]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT + GAP,
      offset: PADDING_TOP + index * (ITEM_HEIGHT + GAP),
      index,
    }),
    []
  );

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading && repositories.length === 0}
      onRefresh={onRefresh}
    />
  );

  const handleEndReached = () => {
    if (hasNextPage && !isLoading && onLoadMore) onLoadMore();
  };

  const FooterComponent = () => {
    if (isLoading && repositories.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Loading more repositories...</Text>
        </View>
      );
    }

    if (!hasNextPage && repositories.length > 0) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>No more repositories to load</Text>
        </View>
      );
    }

    return null;
  };

  const ListEmptyComponent = () => {
    if (!searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="search" />
          <Text style={styles.emptyText}>Search for GitHub repositories</Text>
          <Text style={styles.emptySubtext}>
            Enter a search term to find repositories
          </Text>
        </View>
      );
    }

    if (repositories.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" />
          <Text style={styles.emptyText}>No repositories found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={repositories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      removeClippedSubviews={true}
      windowSize={10}
      initialScrollIndex={0}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={FooterComponent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  contentContainer: {
    paddingTop: PADDING_TOP,
    paddingHorizontal: PADDING_HORIZONTAL,
    gap: GAP,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.huge,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  activityIndicator: {
    color: theme.colors.primary,
  },
  emptyText: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dimmed,
  },
  loadingFooter: {
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.dimmed,
    fontSize: theme.typography.fontSizes.sm,
  },
  endFooter: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  endText: {
    color: theme.colors.dimmed,
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
  },
}));
