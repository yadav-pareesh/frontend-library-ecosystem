import { useRef } from 'react';

export interface UsePreviousOptions<T> {
  /** Optional comparator to decide whether value changed. */
  isEqual?: (prev: T, current: T) => boolean;
}

export function usePreviousValue<T>(
  value: T,
  initialValue?: T,
  options: UsePreviousOptions<T> = {}
): T | undefined {
  const { isEqual } = options;

  const currentRef = useRef<T>(value);
  const previousRef = useRef<T | undefined>(initialValue);

  const hasChanged = isEqual
    ? !isEqual(currentRef.current, value)
    : !Object.is(currentRef.current, value);

  if (hasChanged) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}
