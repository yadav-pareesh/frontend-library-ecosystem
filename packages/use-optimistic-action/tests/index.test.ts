import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOptimisticAction } from '../src';

describe('useOptimisticAction', () => {
  it('updates state optimistically and retains it on async resolution', async () => {
    const asyncAction = vi.fn().mockResolvedValue('server-ok');

    const { result } = renderHook(() =>
      useOptimisticAction(
        ['item 1'],
        asyncAction,
        {
          update: (prev, newItem: string) => [...prev, newItem]
        }
      )
    );

    expect(result.current.state).toEqual(['item 1']);

    let promise: Promise<boolean>;
    act(() => {
      promise = result.current.execute('item 2');
    });

    expect(result.current.state).toEqual(['item 1', 'item 2']);
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.state).toEqual(['item 1', 'item 2']);
    expect(result.current.isPending).toBe(false);
  });

  it('rolls back state to previous value when async action rejects', async () => {
    const asyncAction = vi.fn().mockRejectedValue(new Error('Network error'));
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useOptimisticAction(
        { count: 0 },
        asyncAction,
        {
          update: (prev, delta: number) => ({ count: prev.count + delta }),
          onError
        }
      )
    );

    let promise: Promise<boolean>;
    act(() => {
      promise = result.current.execute(5);
    });

    expect(result.current.state).toEqual({ count: 5 });

    await act(async () => {
      await promise;
    });

    expect(result.current.state).toEqual({ count: 0 });
    expect(result.current.error?.message).toBe('Network error');
    expect(onError).toHaveBeenCalled();
  });
});
