import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export interface StorageSerializer<T> {
  stringify: (value: T) => string;
  parse: (raw: string) => T;
}

export interface UseLocalStorageOptions<T> {
  serializer?: StorageSerializer<T>;
  onError?: (error: unknown) => void;
  syncTabs?: boolean;
}

export interface LocalStorageControls {
  remove: () => void;
  error: unknown | null;
}

const CUSTOM_STORAGE_EVENT = 'pareesh:local-storage-change';

interface CustomStorageDetail {
  key: string;
  newValue: string | null;
}

function dispatchCustomStorageEvent(key: string, newValue: string | null) {
  if (!isBrowser) return;
  window.dispatchEvent(
    new CustomEvent<CustomStorageDetail>(CUSTOM_STORAGE_EVENT, {
      detail: { key, newValue }
    })
  );
}

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, LocalStorageControls] {
  const {
    serializer = {
      stringify: JSON.stringify,
      parse: JSON.parse
    },
    onError,
    syncTabs = true
  } = options;

  const [error, setError] = useState<unknown | null>(null);

  const getInitialValue = useCallback((): T => {
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue;
  }, [defaultValue]);

  const readValueFromStorage = useCallback((): T => {
    if (!isBrowser) {
      return getInitialValue();
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return getInitialValue();
      }
      return serializer.parse(raw);
    } catch (err) {
      setError(err);
      onError?.(err);
      return getInitialValue();
    }
  }, [key, serializer, onError, getInitialValue]);

  const [state, setState] = useState<T>(readValueFromStorage);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setStoredValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      try {
        const nextValue =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prev: T) => T)(stateRef.current)
            : valueOrUpdater;

        setState(nextValue);

        if (isBrowser) {
          const serialized = serializer.stringify(nextValue);
          window.localStorage.setItem(key, serialized);
          dispatchCustomStorageEvent(key, serialized);
        }
        setError(null);
      } catch (err) {
        setError(err);
        onError?.(err);
      }
    },
    [key, serializer, onError]
  );

  const remove = useCallback(() => {
    try {
      if (isBrowser) {
        window.localStorage.removeItem(key);
        dispatchCustomStorageEvent(key, null);
      }
      setState(getInitialValue());
      setError(null);
    } catch (err) {
      setError(err);
      onError?.(err);
    }
  }, [key, getInitialValue, onError]);

  // Synchronize across tabs and within the same window
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.storageArea === window.localStorage && e.key === key) {
        try {
          if (e.newValue === null) {
            setState(getInitialValue());
          } else {
            setState(serializer.parse(e.newValue));
          }
        } catch (err) {
          setError(err);
          onError?.(err);
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<CustomStorageDetail>;
      if (customEvent.detail && customEvent.detail.key === key) {
        try {
          if (customEvent.detail.newValue === null) {
            setState(getInitialValue());
          } else {
            setState(serializer.parse(customEvent.detail.newValue));
          }
        } catch (err) {
          setError(err);
          onError?.(err);
        }
      }
    };

    if (syncTabs) {
      window.addEventListener('storage', handleStorage);
    }
    window.addEventListener(CUSTOM_STORAGE_EVENT, handleCustomChange);

    return () => {
      if (syncTabs) {
        window.removeEventListener('storage', handleStorage);
      }
      window.removeEventListener(CUSTOM_STORAGE_EVENT, handleCustomChange);
    };
  }, [key, syncTabs, serializer, getInitialValue, onError]);

  return [state, setStoredValue, { remove, error }];
}
