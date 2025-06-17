import { useRepoByIdQuery } from '@/store/api/github-api';
import { formatDate } from '@/utils/format-date';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const handleOpenUrlError = (error: any) => {
  Platform.OS === 'web'
    ? alert('Failed to open repository. Please try again later.')
    : Alert.alert('Error', 'Failed to open repository. Please try again later.');
  __DEV__ && console.error('Open URL error:', error);
};

export default function RepositoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const numericId = Number(id);
  if (isNaN(numericId)) {
    throw new Error('Invalid repository ID');
  }

  const { data: repository, isLoading, error } = useRepoByIdQuery(numericId);

  const handleOpenRepository = async () => {
    if (!repository?.html_url) return;
    await Linking.openURL(repository.html_url).catch(handleOpenUrlError);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={styles.loadingText}>Loading repository details...</Text>
      </View>
    );
  }

  if (error || !repository) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Repository Not Found</Text>
        <Text style={styles.errorText}>
          Sorry, we couldn&apos;t load the repository details. Please try again later.
        </Text>
      </View>
    );
  }

  const updateTimeFormatted = formatDate(repository.updated_at);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.repositoryName} numberOfLines={2}>
            {repository.name}
          </Text>
          <Text style={styles.fullName}>{repository.full_name}</Text>
        </View>

        <View style={styles.body}>
          <View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Last Updated</Text>
              <Text style={styles.metadataValue}>{updateTimeFormatted}</Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Owner</Text>
              <Text style={styles.metadataValue}>{repository.owner.login}</Text>
            </View>

            {repository.language && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Language</Text>
                <View style={styles.languageContainer}>
                  <View style={styles.languageDot} />
                  <Text style={styles.metadataValue}>{repository.language}</Text>
                </View>
              </View>
            )}
          </View>

          {repository.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{repository.description}</Text>
            </View>
          )}

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  ⭐ {repository.stargazers_count.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Stars</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  🍴 {repository.forks_count.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Forks</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.openButton} onPress={handleOpenRepository}>
            <Text style={styles.openButtonText}>View on GitHub</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingTop: theme.spacing.md,
    paddingBottom: Math.max(theme.spacing.md, rt.insets.bottom),
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },

  card: {
    gap: theme.spacing.lg,
    maxWidth: 480,
    padding: theme.spacing.lg,
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
  },

  loadingText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dimmed,
    textAlign: 'center',
    marginBottom: theme.spacing.huge,
  },

  errorTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dimmed,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.md,
    marginBottom: theme.spacing.huge,
  },

  header: {},
  body: {
    gap: theme.spacing.md,
  },
  footer: {},

  repositoryName: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeights.xl,
  },
  fullName: {
    color: theme.colors.dimmed,
    fontFamily: 'monospace',
  },

  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  metadataValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dimmed,
  },

  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  languageDot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#3182ce',
  },

  descriptionSection: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text,
  },
  description: {
    color: theme.colors.dimmed,
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.lineHeights.md,
  },

  statsSection: {
    gap: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dimmed,
  },

  openButton: {
    backgroundColor: '#3182ce',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#ffffff',
  },
}));
