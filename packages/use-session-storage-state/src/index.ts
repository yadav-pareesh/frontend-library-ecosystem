import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface StorageSerializer<T> {
  stringify: (value: T) => string;
  parse: (raw: string) => T;
}

export interface UseSessionStorageOptions<T> {
  serializer?: StorageSerializer<T>;
  onError?: (error: unknown) => void;
}

export interface SessionStorageControls {
  remove: () => void;
  error: unknown | null;
}

const CUSTOM_SESSION_STORAGE_EVENT = 'pareesh:session-storage-change';

interface CustomSessionStorageDetail {
  key: string;
  newValue: string | null;
}

function dispatchCustomSessionStorageEvent(key: string, newValue: string | null) {
  if (!isBrowser) return;
  window.dispatchEvent(
    new CustomEvent<CustomSessionStorageDetail>(CUSTOM_SESSION_STORAGE_EVENT, {
      detail: { key, newValue }
    })
  );
}

export function useSessionStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
  options: UseSessionStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, SessionStorageControls] {
  const {
    serializer = {
      stringify: JSON.stringify,
      parse: JSON.parse
    },
    onError
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
      const raw = window.sessionStorage.getItem(key);
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
          window.sessionStorage.setItem(key, serialized);
          dispatchCustomSessionStorageEvent(key, serialized);
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
        window.sessionStorage.removeItem(key);
        dispatchCustomSessionStorageEvent(key, null);
      }
      setState(getInitialValue());
      setError(null);
    } catch (err) {
      setError(err);
      onError?.(err);
    }
  }, [key, getInitialValue, onError]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<CustomSessionStorageDetail>;
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

    window.addEventListener(CUSTOM_SESSION_STORAGE_EVENT, handleCustomChange);

    return () => {
      window.removeEventListener(CUSTOM_SESSION_STORAGE_EVENT, handleCustomChange);
    };
  }, [key, serializer, getInitialValue, onError]);

  return [state, setStoredValue, { remove, error }];
}
