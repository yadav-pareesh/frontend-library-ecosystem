import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '../src';

describe('useMediaQuery', () => {
  let listeners: ((e: any) => void)[] = [];

  beforeEach(() => {
    listeners = [];
    vi.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(min-width: 768px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, cb: any) => {
          listeners.push(cb);
        }),
        removeEventListener: vi.fn((event: string, cb: any) => {
          listeners = listeners.filter((l) => l !== cb);
        }),
        dispatchEvent: vi.fn()
      }))
    });
  });

  it('matches matching media query correctly', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('does not match non-matching media query', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 500px)'));
    expect(result.current).toBe(false);
  });

  it('updates state when media query change event fires', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);

    act(() => {
      listeners.forEach((l) => l({ matches: false } as MediaQueryListEvent));
    });

    expect(result.current).toBe(false);
  });
});
