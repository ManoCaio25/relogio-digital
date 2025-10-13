import localforage from 'localforage';

const store = localforage.createInstance({
  name: 'ascenda',
  storeName: 'af-store'
});

export const storage = {
  async get(key, fallback = null) {
    const value = await store.getItem(key);
    return value ?? fallback;
  },
  async set(key, value) {
    await store.setItem(key, value);
    return value;
  },
  async remove(key) {
    await store.removeItem(key);
  }
};

export default store;
