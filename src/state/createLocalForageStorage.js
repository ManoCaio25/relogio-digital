import localforage from 'localforage';
import { createJSONStorage } from 'zustand/middleware';

const storageInstance = localforage.createInstance({
  name: 'ascenda-state',
  storeName: 'zustand'
});

export const createLocalForageStorage = (keyPrefix = 'af') =>
  createJSONStorage(() => ({
    getItem: async (name) => {
      const value = await storageInstance.getItem(`${keyPrefix}:${name}`);
      return value ?? null;
    },
    setItem: async (name, value) => {
      await storageInstance.setItem(`${keyPrefix}:${name}`, value);
    },
    removeItem: async (name) => {
      await storageInstance.removeItem(`${keyPrefix}:${name}`);
    }
  }));

export default createLocalForageStorage;
