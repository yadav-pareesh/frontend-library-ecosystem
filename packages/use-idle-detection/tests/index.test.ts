import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdleDetection } from '../src';

describe('useIdleDetection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('transitions to idle after configured timeout without activity', () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleDetection({ timeout: 5000, onIdle })
    );

    expect(result.current.isIdle).toBe(false);

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current.isIdle).toBe(false);
    expect(onIdle).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isIdle).toBe(true);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('resets idle state upon user activity', () => {
    const onActive = vi.fn();
    const { result } = renderHook(() =>
      useIdleDetection({ timeout: 3000, onActive })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isIdle).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(result.current.isIdle).toBe(false);
    expect(onActive).toHaveBeenCalledTimes(1);
  });

  it('pauses and resumes idle timer correctly', () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleDetection({ timeout: 2000, onIdle })
    );

    act(() => {
      result.current.pause();
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isIdle).toBe(false);
    expect(onIdle).not.toHaveBeenCalled();

    act(() => {
      result.current.resume();
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });
});
