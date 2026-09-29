import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { lockScroll, isScrollLocked, useScrollLock } from '../src';

describe('scroll-lock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('locks body overflow and restores when unlocked', () => {
    expect(isScrollLocked()).toBe(false);

    const unlock = lockScroll();
    expect(document.body.style.overflow).toBe('hidden');
    expect(isScrollLocked()).toBe(true);

    unlock();
    expect(document.body.style.overflow).toBe('');
    expect(isScrollLocked()).toBe(false);
  });

  it('supports nested locks with reference counting', () => {
    const unlock1 = lockScroll();
    const unlock2 = lockScroll();

    expect(isScrollLocked()).toBe(true);

    unlock1();
    // Still locked because unlock2 hasn't been called
    expect(isScrollLocked()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    unlock2();
    // Now fully unlocked
    expect(isScrollLocked()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('useScrollLock hook locks while mounted and unlocks on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(isScrollLocked()).toBe(true);

    unmount();
    expect(isScrollLocked()).toBe(false);
  });
});
