import { store } from '@/store/store';
import { PersistState } from 'redux-persist';

export type RootState = ReturnType<typeof store.getState> & { _persist?: PersistState };
export type AppDispatch = typeof store.dispatch;
