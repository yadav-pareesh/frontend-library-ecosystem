import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface ElementSize {
  width: number;
  height: number;
  top?: number;
  left?: number;
}

export interface UseElementSizeOptions {
  box?: 'content-box' | 'border-box';
  initialSize?: ElementSize;
}

export type UseElementSizeReturn<E extends HTMLElement = HTMLElement> = [
  (element: E | null) => void,
  ElementSize
];

export function useElementSize<E extends HTMLElement = HTMLDivElement>(
  options: UseElementSizeOptions = {}
): UseElementSizeReturn<E> {
  const { box = 'content-box', initialSize = { width: 0, height: 0 } } = options;

  const [size, setSize] = useState<ElementSize>(initialSize);
  const elementRef = useRef<E | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const refCallback = useCallback(
    (node: E | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !isBrowser || !('ResizeObserver' in window)) {
        return;
      }

      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;

        let width = 0;
        let height = 0;

        if (box === 'border-box' && entry.borderBoxSize) {
          const borderSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize;
          if (borderSize) {
            width = borderSize.inlineSize;
            height = borderSize.blockSize;
          }
        } else if (entry.contentBoxSize) {
          const contentSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          if (contentSize) {
            width = contentSize.inlineSize;
            height = contentSize.blockSize;
          }
        } else if (entry.contentRect) {
          width = entry.contentRect.width;
          height = entry.contentRect.height;
        }

        setSize({
          width: Math.round(width),
          height: Math.round(height),
          top: entry.contentRect ? Math.round(entry.contentRect.top) : undefined,
          left: entry.contentRect ? Math.round(entry.contentRect.left) : undefined
        });
      });

      observerRef.current.observe(node, { box });
    },
    [box]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [refCallback, size];
}
