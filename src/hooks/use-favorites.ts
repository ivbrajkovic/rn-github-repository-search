import { useEventCallback } from '@/hooks/use-event-callback';
import { githubApi } from '@/store/api/github-api';
import { addFavorite, removeFavorite } from '@/store/favorites-slice';
import { useAppDispatch } from '@/store/hooks';
import { AppDispatch, RootState } from '@/store/store-types';
import { useStore } from 'react-redux';

const updateApiCache = (
  state: RootState,
  dispatch: AppDispatch,
  repositoryId: number,
  isFavorite: boolean
) => {
  // Update all searchRepositories caches by iterating through them
  Object.entries(state.githubApi.queries).forEach(([key, queryState]: [string, any]) => {
    const [endpoint, serializedArgs] = key.slice(0, -1).split('(');

    if (endpoint === 'searchRepositories' && queryState?.data?.items) {
      try {
        const args = JSON.parse(serializedArgs);
        dispatch(
          githubApi.util.updateQueryData(endpoint, args, (draft) => {
            const repo = draft.items.find((item) => item.id === repositoryId);
            if (repo) repo.isFavorite = isFavorite;
          })
        );
      } catch {} // Skip malformed cache keys
    }
  });
};

export const useFavorites = () => {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();

  const toggleFavorite = useEventCallback((repositoryId: number) => {
    const state = store.getState();
    const favoriteSet = new Set(state.favorites.repositoryIds);
    const isFavorite = favoriteSet.has(repositoryId);

    if (isFavorite) {
      dispatch(removeFavorite(repositoryId));
      updateApiCache(store.getState(), dispatch, repositoryId, false);
    } else {
      dispatch(addFavorite(repositoryId));
      updateApiCache(store.getState(), dispatch, repositoryId, true);
    }
  });

  return { toggleFavorite };
};
