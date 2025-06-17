import { store } from '@/store';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

export const StoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);
