import { useCallback, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface StorageEnvelope<T> {
  value: T;
  version: number;
  expiresAt: number | null;
}

export interface UsePersistedStateOptions<T> {
  /** Storage backend to use. @default 'local' */
  storage?: 'local' | 'session';
  /** Time to live in milliseconds. If specified, data automatically expires after this duration. */
  ttlMs?: number;
  /** Schema version number for migration support. @default 1 */
  version?: number;
  /** Migration function to upgrade legacy persisted data to current version. */
  migrate?: (persistedValue: unknown, oldVersion: number) => T;
  /** Custom error handler. */
  onError?: (error: unknown) => void;
}

export interface PersistedStateControls {
  remove: () => void;
  isExpired: () => boolean;
}

function getStorageArea(storageType: 'local' | 'session'): Storage | null {
  if (!isBrowser) return null;
  return storageType === 'session' ? window.sessionStorage : window.localStorage;
}

export function usePersistedState<T>(
  key: string,
  defaultValue: T | (() => T),
  options: UsePersistedStateOptions<T> = {}
): [T, (val: T | ((prev: T) => T)) => void, PersistedStateControls] {
  const { storage = 'local', ttlMs, version = 1, migrate, onError } = options;

  const getInitial = useCallback((): T => {
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
  }, [defaultValue]);

  const readFromStorage = useCallback((): T => {
    const area = getStorageArea(storage);
    if (!area) return getInitial();

    try {
      const raw = area.getItem(key);
      if (raw === null) return getInitial();

      const envelope: StorageEnvelope<T> = JSON.parse(raw);

      // Check expiration
      if (envelope.expiresAt !== null && Date.now() > envelope.expiresAt) {
        area.removeItem(key);
        return getInitial();
      }

      // Check migration
      if (typeof envelope.version === 'number' && envelope.version < version) {
        if (migrate) {
          const upgraded = migrate(envelope.value, envelope.version);
          const nextExpires = ttlMs ? Date.now() + ttlMs : null;
          area.setItem(key, JSON.stringify({ value: upgraded, version, expiresAt: nextExpires }));
          return upgraded;
        }
      }

      return envelope.value;
    } catch (err) {
      onError?.(err);
      return getInitial();
    }
  }, [key, storage, version, ttlMs, migrate, onError, getInitial]);

  const [state, setState] = useState<T>(readFromStorage);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setStoredState = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      try {
        const nextValue =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prev: T) => T)(stateRef.current)
            : valueOrUpdater;

        setState(nextValue);

        const area = getStorageArea(storage);
        if (area) {
          const envelope: StorageEnvelope<T> = {
            value: nextValue,
            version,
            expiresAt: ttlMs ? Date.now() + ttlMs : null
          };
          area.setItem(key, JSON.stringify(envelope));
        }
      } catch (err) {
        onError?.(err);
      }
    },
    [key, storage, version, ttlMs, onError]
  );

  const remove = useCallback(() => {
    try {
      const area = getStorageArea(storage);
      if (area) {
        area.removeItem(key);
      }
      setState(getInitial());
    } catch (err) {
      onError?.(err);
    }
  }, [key, storage, getInitial, onError]);

  const isExpired = useCallback(() => {
    const area = getStorageArea(storage);
    if (!area) return false;
    try {
      const raw = area.getItem(key);
      if (!raw) return true;
      const envelope: StorageEnvelope<T> = JSON.parse(raw);
      return envelope.expiresAt !== null && Date.now() > envelope.expiresAt;
    } catch {
      return true;
    }
  }, [key, storage]);

  return [state, setStoredState, { remove, isExpired }];
}
