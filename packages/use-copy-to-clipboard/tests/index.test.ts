import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '../src';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies text successfully via navigator.clipboard.writeText', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true
    });

    const { result } = renderHook(() => useCopyToClipboard({ resetTimeout: 1000 }));

    expect(result.current.copied).toBe(false);

    let success: boolean = false;
    await act(async () => {
      success = await result.current.copy('Hello World');
    });

    expect(success).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Hello World');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('handles writeText rejection gracefully', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true
    });

    const { result } = renderHook(() => useCopyToClipboard());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.copy('Fail Text');
    });

    expect(success).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
