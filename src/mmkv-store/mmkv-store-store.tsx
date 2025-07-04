import { MMKV } from 'react-native-mmkv';
import { WebStorage } from 'redux-persist';

const storage = new MMKV();

export const reduxStorage = {
  setItem: (key, value) => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key) => {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    storage.delete(key);
    return Promise.resolve();
  },
  getItemSync: (key) => {
    if (typeof window === 'undefined') {
      return null;
    }
    const value = storage.getString(key);
    return value ?? null;
  },
} satisfies WebStorage & {
  getItemSync: (key: string) => string | null;
};
