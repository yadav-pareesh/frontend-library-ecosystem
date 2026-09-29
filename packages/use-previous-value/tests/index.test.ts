import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePreviousValue } from '../src';

describe('usePreviousValue', () => {
  it('returns initialValue on first render and tracks previous value across rerenders', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number }) => usePreviousValue(val, 0),
      { initialProps: { val: 1 } }
    );

    expect(result.current).toBe(0);

    rerender({ val: 2 });
    expect(result.current).toBe(1);

    rerender({ val: 3 });
    expect(result.current).toBe(2);
  });

  it('respects custom equality comparator', () => {
    const { result, rerender } = renderHook(
      ({ obj }: { obj: { id: number; name: string } }) =>
        usePreviousValue(obj, undefined, {
          isEqual: (a, b) => a.id === b.id
        }),
      { initialProps: { obj: { id: 1, name: 'Alice' } } }
    );

    expect(result.current).toBeUndefined();

    // id is same, only name changed -> treated as equal, previous value should not update
    rerender({ obj: { id: 1, name: 'Alicia' } });
    expect(result.current).toBeUndefined();

    // id changes -> previous updates
    rerender({ obj: { id: 2, name: 'Bob' } });
    expect(result.current).toEqual({ id: 1, name: 'Alice' });
  });
});
