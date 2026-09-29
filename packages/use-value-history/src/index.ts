import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseValueHistoryOptions<T> {
  /** Maximum number of history snapshots to retain. @default 20 */
  maxSize?: number;
  /** Custom equality function to avoid duplicate snapshots. */
  isEqual?: (a: T, b: T) => boolean;
}

export interface ValueHistoryResult<T> {
  /** Current tracked value. */
  current: T;
  /** Immediately preceding value in history. */
  previous: T | undefined;
  /** Full ordered history array of all past values (oldest to latest). */
  history: T[];
  /** Whether the value has changed since initialization or last clear. */
  changed: boolean;
  /** Clears the history and resets changed flag. */
  clear: () => void;
}

export function useValueHistory<T>(
  value: T,
  options: UseValueHistoryOptions<T> = {}
): ValueHistoryResult<T> {
  const { maxSize = 20, isEqual } = options;

  const [history, setHistory] = useState<T[]>([value]);
  const lastTrackedRef = useRef<T>(value);

  useEffect(() => {
    const hasChanged = isEqual
      ? !isEqual(lastTrackedRef.current, value)
      : !Object.is(lastTrackedRef.current, value);

    if (hasChanged) {
      lastTrackedRef.current = value;
      setHistory((prev) => {
        const next = [...prev, value];
        if (next.length > maxSize) {
          return next.slice(next.length - maxSize);
        }
        return next;
      });
    }
  }, [value, maxSize, isEqual]);

  const clear = useCallback(() => {
    lastTrackedRef.current = value;
    setHistory([value]);
  }, [value]);

  const current = history[history.length - 1] ?? value;
  const previous = history.length > 1 ? history[history.length - 2] : undefined;
  const changed = history.length > 1;

  return {
    current,
    previous,
    history,
    changed,
    clear
  };
}
