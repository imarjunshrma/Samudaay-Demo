import { getSecureItem, removeSecureItem, setSecureItem } from '@/src/services/secure-storage';

export const storageService = {
  getItem(key: string) {
    return getSecureItem(key);
  },
  setItem(key: string, value: string) {
    return setSecureItem(key, value);
  },
  removeItem(key: string) {
    return removeSecureItem(key);
  },
};
