import { SearchOptionsButton } from '@/components/search-options/search-options-button';
import { SearchRepositoriesParams } from '@/store/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Sort = Required<SearchRepositoriesParams['sort']>;
type Order = Required<SearchRepositoriesParams['order']>;

const sortOptions: {
  key: Sort;
  label: string;
  icon: string;
}[] = [
  { key: 'updated', label: 'Updated', icon: 'time-outline' },
  { key: 'stars', label: 'Stars', icon: 'star-outline' },
  { key: 'forks', label: 'Forks', icon: 'git-branch-outline' },
  { key: 'help-wanted-issues', label: 'Help Wanted', icon: 'help-circle-outline' },
];

export const SearchOptions = () => {
  const router = useRouter();
  const { sort = 'updated', order = 'desc' } = useLocalSearchParams<{
    sort?: Sort;
    order?: Order;
  }>();

  const isDesc = order === 'desc';

  const handleSortChange = (sort: Sort) => () => {
    router.setParams({ sort });
  };

  const handleOrderToggle = () => {
    const newOrder = isDesc ? 'asc' : 'desc';
    router.setParams({ order: newOrder });
  };

  return (
    <View style={styles.container}>
      {sortOptions.map((option) => (
        <SearchOptionsButton
          key={option.key}
          isSelected={option.key === sort}
          icon={option.icon as any}
          label={option.label}
          onPress={handleSortChange(option.key)}
        />
      ))}
      <View style={styles.orderContainer}>
        <SearchOptionsButton
          icon={isDesc ? 'arrow-down' : 'arrow-up'}
          label={isDesc ? 'Desc' : 'Asc'}
          onPress={handleOrderToggle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: {
      xs: 'space-between',
      md: 'flex-start',
    },
    gap: {
      xs: 0,
      md: theme.spacing.md,
    },
  },
  orderContainer: {
    flex: {
      xs: 0,
      md: 1,
    },
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));
