import { isBrowser } from '@pareeshy/internal-utils';

export interface StorageAdapter<T = unknown> {
  get: (key: string) => Promise<T | null>;
  set: (key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  keys: () => Promise<string[]>;
}

export interface AdapterOptions {
  prefix?: string;
  serialize?: (val: unknown) => string;
  deserialize?: (raw: string) => unknown;
}

export function createMemoryStorageAdapter<T = unknown>(): StorageAdapter<T> {
  const store = new Map<string, T>();
  return {
    async get(key: string) {
      return store.has(key) ? (store.get(key) as T) : null;
    },
    async set(key: string, value: T) {
      store.set(key, value);
    },
    async remove(key: string) {
      store.delete(key);
    },
    async clear() {
      store.clear();
    },
    async keys() {
      return Array.from(store.keys());
    }
  };
}

export function createWebStorageAdapter<T = unknown>(
  type: 'local' | 'session',
  options: AdapterOptions = {}
): StorageAdapter<T> {
  const {
    prefix = '',
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  const getStorage = (): Storage | null => {
    if (!isBrowser) return null;
    return type === 'session' ? window.sessionStorage : window.localStorage;
  };

  const toKey = (key: string) => `${prefix}${key}`;
  const fromKey = (fullKey: string) =>
    prefix ? (fullKey.startsWith(prefix) ? fullKey.slice(prefix.length) : null) : fullKey;

  return {
    async get(key: string) {
      const storage = getStorage();
      if (!storage) return null;
      const raw = storage.getItem(toKey(key));
      if (raw === null) return null;
      try {
        return deserialize(raw) as T;
      } catch {
        return null;
      }
    },
    async set(key: string, value: T) {
      const storage = getStorage();
      if (!storage) return;
      storage.setItem(toKey(key), serialize(value));
    },
    async remove(key: string) {
      const storage = getStorage();
      if (!storage) return;
      storage.removeItem(toKey(key));
    },
    async clear() {
      const storage = getStorage();
      if (!storage) return;
      if (!prefix) {
        storage.clear();
      } else {
        const allKeys = Object.keys(storage);
        for (const k of allKeys) {
          if (k.startsWith(prefix)) {
            storage.removeItem(k);
          }
        }
      }
    },
    async keys() {
      const storage = getStorage();
      if (!storage) return [];
      const result: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k) {
          const stripped = fromKey(k);
          if (stripped !== null) result.push(stripped);
        }
      }
      return result;
    }
  };
}

export function createIndexedDBAdapter<T = unknown>(
  dbName = 'pareeshy-storage',
  storeName = 'keyval'
): StorageAdapter<T> {
  if (!isBrowser || typeof indexedDB === 'undefined') {
    return createMemoryStorageAdapter<T>();
  }

  const openDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const withStore = async <R>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => Promise<R> | R
  ): Promise<R> => {
    const db = await openDb();
    return new Promise<R>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      let result: R;
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);

      Promise.resolve(operation(store))
        .then((res) => {
          result = res;
        })
        .catch(reject);
    });
  };

  return {
    async get(key: string) {
      return withStore('readonly', (store) => {
        return new Promise<T | null>((resolve, reject) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
          req.onerror = () => reject(req.error);
        });
      });
    },
    async set(key: string, value: T) {
      await withStore('readwrite', (store) => {
        store.put(value, key);
      });
    },
    async remove(key: string) {
      await withStore('readwrite', (store) => {
        store.delete(key);
      });
    },
    async clear() {
      await withStore('readwrite', (store) => {
        store.clear();
      });
    },
    async keys() {
      return withStore('readonly', (store) => {
        return new Promise<string[]>((resolve, reject) => {
          const req = store.getAllKeys();
          req.onsuccess = () => resolve(req.result.map(String));
          req.onerror = () => reject(req.error);
        });
      });
    }
  };
}

export function createBrowserStorage<T = unknown>(
  type: 'local' | 'session' | 'indexeddb' | 'memory',
  options?: AdapterOptions & { dbName?: string; storeName?: string }
): StorageAdapter<T> {
  switch (type) {
    case 'local':
      return createWebStorageAdapter<T>('local', options);
    case 'session':
      return createWebStorageAdapter<T>('session', options);
    case 'indexeddb':
      return createIndexedDBAdapter<T>(options?.dbName, options?.storeName);
    case 'memory':
    default:
      return createMemoryStorageAdapter<T>();
  }
}
