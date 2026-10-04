import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export type HistoryMode = 'push' | 'replace';

export interface UseUrlStateOptions<T> {
  historyMode?: HistoryMode;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

function defaultSerialize<T>(value: T): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.join(',');
  return JSON.stringify(value);
}

function defaultDeserialize<T>(raw: string, defaultValue: T): T {
  if (typeof defaultValue === 'number') {
    const num = Number(raw);
    return (Number.isNaN(num) ? defaultValue : num) as T;
  }
  if (typeof defaultValue === 'boolean') {
    return (raw === 'true' || raw === '1') as T;
  }
  if (Array.isArray(defaultValue)) {
    if (!raw) return [] as unknown as T;
    return raw.split(',') as unknown as T;
  }
  if (typeof defaultValue === 'object' && defaultValue !== null) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }
  return raw as unknown as T;
}

export function useUrlState<T>(
  paramKey: string,
  defaultValue: T,
  options: UseUrlStateOptions<T> = {}
): [T, (next: T | ((prev: T) => T)) => void, { clear: () => void }] {
  const {
    historyMode = 'replace',
    serialize = defaultSerialize,
    deserialize = defaultDeserialize
  } = options;

  const readFromUrl = useCallback((): T => {
    if (!isBrowser) return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const val = params.get(paramKey);
    if (val === null) return defaultValue;
    return deserialize(val, defaultValue);
  }, [paramKey, defaultValue, deserialize]);

  const [state, setState] = useState<T>(readFromUrl);
  const stateRef = useRef(state);
  stateRef.current = state;

  const updateUrl = useCallback(
    (nextVal: T | null) => {
      if (!isBrowser) return;

      const url = new URL(window.location.href);

      if (nextVal === null || Object.is(nextVal, defaultValue)) {
        url.searchParams.delete(paramKey);
      } else {
        url.searchParams.set(paramKey, serialize(nextVal));
      }

      if (historyMode === 'push') {
        window.history.pushState({}, '', url.toString());
      } else {
        window.history.replaceState({}, '', url.toString());
      }
    },
    [paramKey, defaultValue, historyMode, serialize]
  );

  const setUrlState = useCallback(
    (nextOrFn: T | ((prev: T) => T)) => {
      const nextValue =
        typeof nextOrFn === 'function' ? (nextOrFn as (prev: T) => T)(stateRef.current) : nextOrFn;

      setState(nextValue);
      updateUrl(nextValue);
    },
    [updateUrl]
  );

  const clear = useCallback(() => {
    setState(defaultValue);
    updateUrl(null);
  }, [defaultValue, updateUrl]);

  useEffect(() => {
    if (!isBrowser) return;

    const handlePopState = () => {
      setState(readFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [readFromUrl]);

  return [state, setUrlState, { clear }];
}
