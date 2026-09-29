import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedCallback, useDebouncedValue } from '../src';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces function execution until delay has elapsed', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('final');
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('final');
  });

  it('cancels pending execution when cancel is called', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current('test');
    });
    expect(result.current.isPending()).toBe(true);

    act(() => {
      result.current.cancel();
    });
    expect(result.current.isPending()).toBe(false);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('flushes pending execution immediately when flush is called', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current('flushed-arg');
    });

    act(() => {
      result.current.flush();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('flushed-arg');
    expect(result.current.isPending()).toBe(false);
  });

  it('executes immediately on leading edge when configured', () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(fn, 200, { leading: true, trailing: false })
    );

    act(() => {
      result.current('immediate');
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('immediate');

    act(() => {
      result.current('ignored-during-cooldown');
      vi.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates debounced value only after specified delay', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: string; delay: number }) => useDebouncedValue(val, delay),
      { initialProps: { val: 'initial', delay: 150 } }
    );

    expect(result.current[0]).toBe('initial');

    rerender({ val: 'updated-1', delay: 150 });
    rerender({ val: 'updated-2', delay: 150 });

    expect(result.current[0]).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current[0]).toBe('updated-2');
  });
});
