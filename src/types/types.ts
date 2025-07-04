import { Repository } from '@/store/api/github-api-types';

export type RepositoryWithFavorite = Repository & { isFavorite: boolean };
