const isBrowser = typeof window !== 'undefined';

function makeKey(prefix, key) {
  return `${prefix}${key}`;
}

function createAdapter(prefix = '') {
  const storage = isBrowser ? window.localStorage : null;

  return {
    async getItem(key) {
      if (!storage) return null;
      try {
        const value = storage.getItem(makeKey(prefix, key));
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('localforage shim getItem failed', error);
        return null;
      }
    },

    async setItem(key, value) {
      if (!storage) return value;
      try {
        storage.setItem(makeKey(prefix, key), JSON.stringify(value));
      } catch (error) {
        console.error('localforage shim setItem failed', error);
      }
      return value;
    },

    async removeItem(key) {
      if (!storage) return null;
      storage.removeItem(makeKey(prefix, key));
      return null;
    },
  };
}

const defaultInstance = createAdapter('');

export default {
  createInstance({ name } = {}) {
    const prefix = name ? `${name}:` : '';
    return createAdapter(prefix);
  },
  ...defaultInstance,
};

