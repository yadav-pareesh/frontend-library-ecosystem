import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineQueue } from '../src';

describe('useOnlineQueue', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true
    });
  });

  it('enqueues items and prevents duplicate keys (idempotency)', () => {
    const onProcess = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useOnlineQueue({ onProcess, autoProcess: false })
    );

    act(() => {
      result.current.enqueue({ action: 'create' }, 'req-1');
      result.current.enqueue({ action: 'duplicate' }, 'req-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.payload).toEqual({ action: 'create' });
  });

  it('processes queued items sequentially and removes them on success', async () => {
    const onProcess = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useOnlineQueue({ onProcess, autoProcess: false })
    );

    act(() => {
      result.current.enqueue({ msg: 'hello' });
    });

    expect(result.current.items).toHaveLength(1);

    await act(async () => {
      await result.current.processQueue();
    });

    expect(onProcess).toHaveBeenCalledTimes(1);
    expect(result.current.items).toHaveLength(0);
  });

  it('clears all queued items when clear() is called', () => {
    const onProcess = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useOnlineQueue({ onProcess, autoProcess: false })
    );

    act(() => {
      result.current.enqueue({ msg: '1' });
      result.current.enqueue({ msg: '2' });
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clear();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
