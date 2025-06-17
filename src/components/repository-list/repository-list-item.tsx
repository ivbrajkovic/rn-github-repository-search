import { githubApi, Repository } from '@/store/api/github-api';
import { useAppDispatch } from '@/store/hooks';
import { formatDate } from '@/utils/format-date';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type RepositoryListItemProps = {
  item: Repository;
};

export const RepositoryListItem = memo(
  ({ item }: RepositoryListItemProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const updateTimeFormatted = formatDate(item.updated_at);

    const handlePress = async () => {
      // Optimistically update the cache with the repository data,
      // to ensure that the repository details are available immediately
      await dispatch(githubApi.util.upsertQueryData('repoById', item.id, item));

      router.push({
        pathname: '/repository/[id]',
        params: { id: item.id.toString() },
      });
    };

    return (
      <Pressable
        style={styles.container}
        onPress={handlePress}
        testID="repository-item-touchable"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Repository ${item.name}, ${
          item.description || 'No description'
        }, updated ${updateTimeFormatted}`}
        accessibilityHint="Tap to view repository details"
      >
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.lastUpdate}>{updateTimeFormatted}</Text>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
        ) : null}
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.description === nextProps.item.description &&
    prevProps.item.updated_at === nextProps.item.updated_at
);

RepositoryListItem.displayName = 'RepositoryListItem';

const styles = StyleSheet.create((theme) => ({
  container: {
    height: 108,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: theme.spacing.sm,
  },
  header: {
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.lg,
  },
  lastUpdate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dimmed,
    fontFamily: 'monospace',
    flexShrink: 0,
    fontWeight: theme.typography.fontWeights.medium,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dimmed,
    lineHeight: theme.typography.lineHeights.md,
  },
}));
