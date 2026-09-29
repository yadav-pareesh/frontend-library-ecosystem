import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePermission } from '../src';

describe('usePermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries permission and returns current state', async () => {
    const mockStatus = {
      state: 'granted',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };

    Object.defineProperty(navigator, 'permissions', {
      writable: true,
      value: {
        query: vi.fn().mockResolvedValue(mockStatus)
      }
    });

    const { result } = renderHook(() => usePermission('geolocation'));

    // Wait for async query
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state).toBe('granted');
    expect(result.current.isSupported).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('gracefully degrades to unsupported when permissions API is missing', async () => {
    Object.defineProperty(navigator, 'permissions', {
      writable: true,
      value: undefined
    });

    const { result } = renderHook(() => usePermission('notifications'));

    expect(result.current.state).toBe('unsupported');
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
