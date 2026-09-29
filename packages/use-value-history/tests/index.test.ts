import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useValueHistory } from '../src';

describe('useValueHistory', () => {
  it('tracks value history up to maxSize and reports previous/current values', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number }) => useValueHistory(val, { maxSize: 3 }),
      { initialProps: { val: 1 } }
    );

    expect(result.current.current).toBe(1);
    expect(result.current.previous).toBeUndefined();
    expect(result.current.history).toEqual([1]);
    expect(result.current.changed).toBe(false);

    rerender({ val: 2 });
    expect(result.current.current).toBe(2);
    expect(result.current.previous).toBe(1);
    expect(result.current.history).toEqual([1, 2]);
    expect(result.current.changed).toBe(true);

    rerender({ val: 3 });
    expect(result.current.history).toEqual([1, 2, 3]);

    rerender({ val: 4 });
    // maxSize is 3, so oldest (1) is evicted
    expect(result.current.history).toEqual([2, 3, 4]);
    expect(result.current.current).toBe(4);
    expect(result.current.previous).toBe(3);
  });

  it('resets history on clear()', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useValueHistory(val),
      { initialProps: { val: 'a' } }
    );

    rerender({ val: 'b' });
    expect(result.current.history).toEqual(['a', 'b']);

    act(() => {
      result.current.clear();
    });

    expect(result.current.history).toEqual(['b']);
    expect(result.current.changed).toBe(false);
  });
});
