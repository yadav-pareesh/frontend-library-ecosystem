import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus } from '../src';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports initial online status correctly', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true
    });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(true);
  });

  it('updates when offline and online events trigger', () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true
      });
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.online).toBe(false);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        configurable: true
      });
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.online).toBe(true);
  });

  it('gracefully degrades when Network Information API is not supported', () => {
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      configurable: true
    });

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(true);
    expect(result.current.effectiveType).toBeUndefined();
    expect(result.current.downlink).toBeUndefined();
    expect(result.current.rtt).toBeUndefined();
  });
});
