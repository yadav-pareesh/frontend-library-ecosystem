import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../src';

describe('useInfiniteScroll', () => {
  let triggerIntersect: (entries: any[]) => void = () => {};

  beforeEach(() => {
    vi.clearAllMocks();

    class MockIntersectionObserver {
      constructor(cb: (entries: any[]) => void) {
        triggerIntersect = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver
    });
  });

  it('triggers loadMore when sentinel enters viewport and hasMore is true', () => {
    const loadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({ loadMore, hasMore: true, loading: false })
    );

    const sentinel = document.createElement('div');
    act(() => {
      result.current(sentinel);
    });

    act(() => {
      triggerIntersect([{ isIntersecting: true }]);
    });

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not trigger loadMore when loading is true or hasMore is false', () => {
    const loadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({ loadMore, hasMore: false, loading: false })
    );

    const sentinel = document.createElement('div');
    act(() => {
      result.current(sentinel);
    });

    act(() => {
      triggerIntersect([{ isIntersecting: true }]);
    });

    expect(loadMore).not.toHaveBeenCalled();
  });
});
