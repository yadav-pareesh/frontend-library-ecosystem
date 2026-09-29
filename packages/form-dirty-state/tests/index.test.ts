import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormDirtyState } from '../src';

describe('useFormDirtyState', () => {
  it('correctly detects modified fields and dirty status', () => {
    const initial = { username: 'john', email: 'john@example.com' };

    const { result, rerender } = renderHook(
      ({ values }: { values: typeof initial }) =>
        useFormDirtyState(values, initial),
      { initialProps: { values: initial } }
    );

    expect(result.current.isDirty).toBe(false);
    expect(result.current.dirtyFields).toEqual([]);

    // Modify username
    rerender({ values: { username: 'johnny', email: 'john@example.com' } });
    expect(result.current.isDirty).toBe(true);
    expect(result.current.dirtyFields).toEqual(['username']);

    // Reset baseline
    act(() => {
      result.current.resetBaseline();
    });

    expect(result.current.isDirty).toBe(false);
    expect(result.current.dirtyFields).toEqual([]);
  });
});
