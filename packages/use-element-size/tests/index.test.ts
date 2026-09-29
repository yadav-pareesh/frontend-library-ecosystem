import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useElementSize } from '../src';

describe('useElementSize', () => {
  let triggerResize: (entries: any[]) => void = () => {};

  beforeEach(() => {
    vi.clearAllMocks();

    class MockResizeObserver {
      constructor(cb: (entries: any[]) => void) {
        triggerResize = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: MockResizeObserver
    });
  });

  it('measures element dimensions when ResizeObserver fires', () => {
    const { result } = renderHook(() => useElementSize());

    expect(result.current[1]).toEqual({ width: 0, height: 0 });

    const dummyElement = document.createElement('div');

    act(() => {
      result.current[0](dummyElement);
    });

    act(() => {
      triggerResize([
        {
          contentRect: { width: 320, height: 180, top: 0, left: 0 },
          contentBoxSize: [{ inlineSize: 320, blockSize: 180 }]
        }
      ]);
    });

    expect(result.current[1].width).toBe(320);
    expect(result.current[1].height).toBe(180);
  });
});
