import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isBrowser, isDeepEqual } from '@pareeshy/internal-utils';

export interface UseFormDirtyStateOptions<T> {
  /** Custom comparison function. Defaults to deep equality. */
  isEqual?: (a: T, b: T) => boolean;
  /** Whether to show browser confirmation prompt when user tries to close tab with unsaved changes. @default false */
  warnOnBeforeUnload?: boolean;
}

export interface FormDirtyStateReturn<T> {
  /** Whether the current form values differ from the initial values. */
  isDirty: boolean;
  /** Array of top-level keys that differ from initial state. */
  dirtyFields: (keyof T)[];
  /** Resets the baseline initial values to current values or custom values. */
  resetBaseline: (newBaseline?: T) => void;
  /** Initial baseline values. */
  baseline: T;
}

export function useFormDirtyState<T extends Record<string, any>>(
  currentValues: T,
  initialValues?: T,
  options: UseFormDirtyStateOptions<T> = {}
): FormDirtyStateReturn<T> {
  const { isEqual = isDeepEqual, warnOnBeforeUnload = false } = options;

  const [baseline, setBaseline] = useState<T>(() => initialValues ?? currentValues);
  const baselineRef = useRef<T>(baseline);
  baselineRef.current = baseline;

  const isDirty = useMemo(() => {
    return !isEqual(currentValues, baseline);
  }, [currentValues, baseline, isEqual]);

  const dirtyFields = useMemo(() => {
    const fields: (keyof T)[] = [];
    const allKeys = new Set([...Object.keys(currentValues), ...Object.keys(baseline)]) as Set<
      keyof T
    >;

    for (const key of allKeys) {
      if (!isEqual(currentValues[key], baseline[key])) {
        fields.push(key);
      }
    }

    return fields;
  }, [currentValues, baseline, isEqual]);

  const resetBaseline = useCallback(
    (newBaseline?: T) => {
      setBaseline(newBaseline ?? currentValues);
    },
    [currentValues]
  );

  useEffect(() => {
    if (!isBrowser || !warnOnBeforeUnload || !isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [warnOnBeforeUnload, isDirty]);

  return {
    isDirty,
    dirtyFields,
    resetBaseline,
    baseline
  };
}
