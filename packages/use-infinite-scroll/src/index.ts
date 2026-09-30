import { useCallback, useEffect, useRef } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface UseInfiniteScrollOptions {
  /** Async or sync callback to load the next batch of items. */
  loadMore: () => void | Promise<void>;
  /** Whether there are more items to fetch. */
  hasMore: boolean;
  /** Whether a fetch is currently in progress. */
  loading?: boolean;
  /** Custom scrolling container element. Defaults to viewport. */
  root?: Element | Document | null;
  /** Distance margin around root to trigger early fetching. @default '100px' */
  rootMargin?: string;
  /** Intersection threshold. @default 0.1 */
  threshold?: number | number[];
  /** Disable the observer completely. @default false */
  disabled?: boolean;
}

export function useInfiniteScroll<E extends HTMLElement = HTMLDivElement>(
  options: UseInfiniteScrollOptions
): (element: E | null) => void {
  const {
    loadMore,
    hasMore,
    loading = false,
    root = null,
    rootMargin = '100px',
    threshold = 0.1,
    disabled = false
  } = options;

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<E | null>(null);

  const refCallback = useCallback(
    (node: E | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !isBrowser || !('IntersectionObserver' in window)) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry &&
            entry.isIntersecting &&
            hasMoreRef.current &&
            !loadingRef.current &&
            !disabledRef.current
          ) {
            void loadMoreRef.current();
          }
        },
        {
          root: root instanceof Document ? null : root,
          rootMargin,
          threshold
        }
      );

      observerRef.current.observe(node);
    },
    [root, rootMargin, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return refCallback;
}
