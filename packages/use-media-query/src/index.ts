import { useEffect, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface UseMediaQueryOptions {
  /** Default value to return during SSR. @default false */
  defaultValue?: boolean;
  /** Whether to evaluate matchMedia immediately on mount. @default true */
  initializeWithValue?: boolean;
}

export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultValue = false, initializeWithValue = true } = options;

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue && isBrowser && 'matchMedia' in window) {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (!isBrowser || !('matchMedia' in window)) return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', listener);
    } else {
      // Compatibility fallback for older browsers
      (mql as any).addListener?.(listener);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', listener);
      } else {
        (mql as any).removeListener?.(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook to match multiple media queries simultaneously.
 */
export function useMediaQueries<T extends Record<string, string>>(
  queryMap: T
): { [K in keyof T]: boolean } {
  const [matchesMap, setMatchesMap] = useState<{ [K in keyof T]: boolean }>(() => {
    const initial = {} as { [K in keyof T]: boolean };
    for (const key of Object.keys(queryMap) as (keyof T)[]) {
      const q = queryMap[key];
      initial[key] =
        isBrowser && 'matchMedia' in window && q ? window.matchMedia(q).matches : false;
    }
    return initial;
  });

  useEffect(() => {
    if (!isBrowser || !('matchMedia' in window)) return;

    const cleanups: (() => void)[] = [];
    const keys = Object.keys(queryMap) as (keyof T)[];

    for (const key of keys) {
      const q = queryMap[key];
      if (!q) continue;

      const mql = window.matchMedia(q);
      const listener = (event: MediaQueryListEvent) => {
        setMatchesMap((prev) => ({
          ...prev,
          [key]: event.matches
        }));
      };

      if (mql.addEventListener) {
        mql.addEventListener('change', listener);
        cleanups.push(() => mql.removeEventListener('change', listener));
      } else {
        (mql as any).addListener?.(listener);
        cleanups.push(() => (mql as any).removeListener?.(listener));
      }
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [queryMap]);

  return matchesMap;
}
