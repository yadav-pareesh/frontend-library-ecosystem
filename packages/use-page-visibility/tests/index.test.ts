import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageVisibility, useDocumentVisibility } from '../src';

describe('usePageVisibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes to true when document is visible', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true
    });

    const { result } = renderHook(() => usePageVisibility());
    expect(result.current).toBe(true);
  });

  it('updates when document visibility changes', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePageVisibility(callback));

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        configurable: true
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(false);
    expect(callback).toHaveBeenCalledWith(false);

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(true);
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('useDocumentVisibility returns exact string state', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true
    });

    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe('hidden');
  });
});
