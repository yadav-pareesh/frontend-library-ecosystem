import { useEffect } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

interface OriginalStyles {
  overflow: string;
  paddingRight: string;
}

let lockCount = 0;
let originalStyles: OriginalStyles | null = null;

function getScrollbarWidth(): number {
  if (!isBrowser) return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Locks scroll on body element, compensating for scrollbar width to prevent layout shift.
 * Uses reference counting to support multiple nested overlays.
 */
export function lockScroll(target?: HTMLElement): () => void {
  if (!isBrowser) return () => {};

  const element = target || document.body;

  if (lockCount === 0) {
    const scrollbarWidth = getScrollbarWidth();

    originalStyles = {
      overflow: element.style.overflow,
      paddingRight: element.style.paddingRight
    };

    element.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(element).paddingRight) || 0;
      element.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  lockCount++;

  let isUnlocked = false;
  return () => {
    if (isUnlocked) return;
    isUnlocked = true;
    unlockScroll(element);
  };
}

/**
 * Decrements lock reference count and restores original body scroll when zero is reached.
 */
export function unlockScroll(target?: HTMLElement): void {
  if (!isBrowser || lockCount <= 0) return;

  lockCount--;

  if (lockCount === 0 && originalStyles) {
    const element = target || document.body;
    element.style.overflow = originalStyles.overflow;
    element.style.paddingRight = originalStyles.paddingRight;
    originalStyles = null;
  }
}

export function isScrollLocked(): boolean {
  return lockCount > 0;
}

/**
 * React hook to lock scroll when `locked` boolean is true.
 */
export function useScrollLock(locked = true, target?: HTMLElement): void {
  useEffect(() => {
    if (!locked || !isBrowser) return;

    const unlock = lockScroll(target);
    return () => {
      unlock();
    };
  }, [locked, target]);
}
