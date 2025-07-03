import { Repository } from '@/store/api';

export type RepositoryWithFavorite = Repository & { isFavorite: boolean };
