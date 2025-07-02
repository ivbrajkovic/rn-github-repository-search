import { reduxStorage } from '@/mmkv-store/mmkv-store-store';
import { githubApi } from '@/store/api/github-api';
import { themeReducer } from '@/theme/theme-slice';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistState,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

const themePersistedReducer = persistReducer(
  { key: 'theme', storage: reduxStorage },
  themeReducer
);

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
    theme: themePersistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
      ignoredPaths: ['_persist'],
    }).concat(githubApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState> & { _persist?: PersistState };
export type AppDispatch = typeof store.dispatch;
