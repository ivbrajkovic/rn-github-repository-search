import { MMKV } from 'react-native-mmkv';
import { Storage } from 'redux-persist';

const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      storage.set(key, value);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
  getItem: (key) => {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') {
      return Promise.resolve(false);
    }
    storage.delete(key);
    return Promise.resolve(true);
  },
};
