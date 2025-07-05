import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { WebStorage } from 'redux-persist';

export const storage = new MMKV();
const isServerSide = Platform.OS === 'web' && typeof window === 'undefined';

export const reduxStorage = {
  setItem: (key, value) => {
    if (isServerSide) {
      return Promise.resolve();
    }
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key) => {
    if (isServerSide) {
      return Promise.resolve(null);
    }
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key) => {
    if (isServerSide) {
      return Promise.resolve();
    }
    storage.delete(key);
    return Promise.resolve();
  },
  getItemSync: (key) => {
    if (isServerSide) {
      return null;
    }
    const value = storage.getString(key);
    return value ?? null;
  },
} satisfies WebStorage & {
  getItemSync: (key: string) => string | null;
};
