import { useCallback, useEffect, useRef, useState } from 'react';

export interface DebounceOptions {
  /**
   * Execute callback on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean;
  /**
   * Execute callback on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;
  /**
   * Maximum time callback is allowed to be delayed before execution.
   */
  maxWait?: number;
}

export interface DebounceControl {
  /** Cancel any pending debounced execution. */
  cancel: () => void;
  /** Immediately invoke any pending execution and cancel timer. */
  flush: () => void;
  /** Returns whether a debounced execution is currently queued. */
  isPending: () => boolean;
}

export type DebouncedFunction<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) &
  DebounceControl;

/**
 * Creates a stable debounced callback with cancel and flush controls.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const isPendingRef = useRef(false);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current !== null) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    lastArgsRef.current = null;
    isPendingRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (lastArgsRef.current && isPendingRef.current) {
      const args = lastArgsRef.current;
      cancel();
      callbackRef.current(...args);
    }
  }, [cancel]);

  const isPending = useCallback(() => isPendingRef.current, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      const callLeading = leading && !isPendingRef.current;
      isPendingRef.current = true;

      if (callLeading) {
        callbackRef.current(...args);
      }

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (trailing && (!leading || lastArgsRef.current !== args || !callLeading)) {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
        }
        cancel();
      }, delay);

      if (maxWait !== undefined && maxTimerRef.current === null) {
        maxTimerRef.current = setTimeout(() => {
          if (lastArgsRef.current && isPendingRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
          cancel();
        }, maxWait);
      }
    },
    [delay, leading, trailing, maxWait, cancel]
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const wrapped = debounced as DebouncedFunction<T>;
  wrapped.cancel = cancel;
  wrapped.flush = flush;
  wrapped.isPending = isPending;

  return wrapped;
}

export type DebouncedValueResult<T> = [T, DebounceControl];

/**
 * Returns a debounced version of the input value along with cancel and flush controls.
 */
export function useDebouncedValue<T>(
  value: T,
  delay: number,
  options: DebounceOptions = {}
): DebouncedValueResult<T> {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const update = useDebouncedCallback(
    (nextVal: T) => {
      setDebouncedValue(nextVal);
    },
    delay,
    options
  );

  useEffect(() => {
    update(value);
  }, [value, update]);

  return [
    debouncedValue,
    {
      cancel: update.cancel,
      flush: update.flush,
      isPending: update.isPending
    }
  ];
}
